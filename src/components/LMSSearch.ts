import { consume } from "@lit/context";
import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { match } from "ts-pattern";
import { searchContext } from "../context/search-context";
import { __, attr__ } from "../lib/translate";
import { debounce } from "../lib/utilities";
import { tailwindStyles } from "../tailwind.lit";
import { SortableColumns } from "../types/common";

type Operator = "=" | "||" | ">=" | "<=" | ">" | "<" | "-like" | "-not_like";

type ParsedQueryValue = string | number | string[];

interface QueryEntry {
    operator: Operator;
    value: ParsedQueryValue;
}

type ParsedQuery = Record<string, QueryEntry>;

type QueryObj = unknown[] | Record<string, unknown>;

@customElement("lms-search")
export default class LMSSearch extends LitElement {
    @property({ type: Array }) sortableColumns: Array<any> | SortableColumns = [
        "id",
    ];

    @query("input") input!: HTMLInputElement;

    @state() isFocused = false;

    @state() hasValue = false;

    @consume({ context: searchContext, subscribe: true })
    @state()
    search?: string;

    private isMacOS: boolean = /(Mac|iPhone|iPod|iPad)/i.test(
        navigator.userAgent
    );

    private shortcutText = this.isMacOS ? "⌘" : "Ctrl";

    private boundHandleShortcut = (e: KeyboardEvent) =>
        this.handleShortcut.bind(this)(e);

    static override styles = [tailwindStyles];

    /**
     * Parse a query string into a structured query object.
     *
     * @param {string} query - The query string to parse.
     * @returns {ParsedQuery} The structured query object.
     */
    private parseQuery(query: string): ParsedQuery {
        const entries: ParsedQuery = {};
        const parts = query.split(" AND ");
        parts.forEach((part) => {
            const [rawKey, rawValue] = part.split(":").map((s) => s.trim());
            if (!rawKey || rawValue === undefined) {
                return;
            }

            entries[rawKey] = match(rawValue)
                .when(
                    (v) => v.includes(" OR "),
                    (value) => ({
                        operator: "||" as const,
                        value: value.split(" OR ").map((s) => s.trim()),
                    })
                )
                .when(
                    (v) => !isNaN(parseFloat(v)),
                    (value) => ({
                        operator: "=" as const,
                        value: parseFloat(value),
                    })
                )
                .when(
                    (v) => v.startsWith('"') && v.endsWith('"'),
                    (value) => ({
                        operator: "=" as const,
                        value: value.slice(1, -1),
                    })
                )
                .when(
                    (v) => {
                        // Check if the value contains any of the defined operators
                        return Object.keys({
                            ">=": ">=",
                            "<=": "<=",
                            ">": ">",
                            "<": "<",
                            "~": "-like",
                            "!~": "-not_like",
                        }).some((op) => v.includes(op));
                    },
                    (value) => {
                        const operator =
                            Object.entries({
                                ">=": ">=",
                                "<=": "<=",
                                ">": ">",
                                "<": "<",
                                "~": "-like",
                                "!~": "-not_like",
                            }).find(([op]) => value.includes(op))?.[1] || "=";

                        const [_, extractedValue] = value.split(operator);
                        return {
                            operator: operator as Operator,
                            value: extractedValue ? extractedValue.trim() : "",
                        };
                    }
                )
                .otherwise(() => ({
                    operator: "=" as const,
                    value: rawValue,
                }));
        });

        return entries;
    }

    /**
     * Build a structured query object into the format expected by the backend.
     *
     * @param {ParsedQuery} query - The structured query object to build.
     * @returns {QueryObj} The built query.
     */
    private buildQuery(query: ParsedQuery): QueryObj {
        const builtQuery: unknown[] = Object.entries(query)
            .map(([key, { operator, value }]) =>
                match(operator)
                    .with("=", () => ({ [key]: value }))
                    .with("||", () =>
                        Array.isArray(value)
                            ? value.map((v: string) => ({ [key]: v }))
                            : { [key]: value }
                    )
                    .otherwise(() => ({ [key]: { [operator]: value } }))
            )
            .flat();

        return builtQuery.length === 1
            ? (builtQuery[0] as Record<string, unknown>)
            : builtQuery;
    }

    /**
     * Get the query string or build a structured query.
     *
     * @param {string} query - The query string or structured query to get.
     * @returns {string} The built query as a string.
     */
    private getQuery(query: string): string {
        return match(query)
            .when(
                (q) => q.includes(":"),
                (q) => {
                    // It's a structured query
                    const parsedQuery = this.parseQuery(q);
                    const builtQuery = this.buildQuery(parsedQuery);
                    return JSON.stringify(builtQuery);
                }
            )
            .when(
                (q) => q.length > 0,
                (q) => {
                    // Handle wildcard query
                    const wildcardQuery = this.sortableColumns.reduce(
                        (entries, field) => {
                            entries.push({ [field]: { "-like": `%${q}%` } });
                            return entries;
                        },
                        [] as Array<Record<string, unknown>>
                    );
                    return JSON.stringify(wildcardQuery);
                }
            )
            .otherwise(() => JSON.stringify({}));
    }

    private debouncedSearch = debounce(
        (query: string) => {
            this.dispatchEvent(
                new CustomEvent("search", {
                    detail: {
                        q: this.getQuery(query),
                        search: query,
                    },
                    bubbles: true,
                    composed: true,
                })
            );
        },
        250,
        false
    );

    /**
     * Handle the input event by debouncing the search.
     *
     * @param {InputEvent} e - The input event.
     */
    private handleInput(e: InputEvent) {
        const inputElement = e.target as HTMLInputElement;
        const { value } = inputElement;
        this.hasValue = Boolean(value);

        this.debouncedSearch(inputElement.value);
    }

    /**
     * Handle keyboard shortcuts to focus and blur the search input.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     */
    private handleShortcut(e: KeyboardEvent) {
        const isCmdOrCtrlPressed = e.metaKey || e.ctrlKey;

        match({ key: e.key.toLowerCase(), isCmdOrCtrlPressed })
            .with({ key: "e", isCmdOrCtrlPressed: true }, () => {
                e.preventDefault();
                this.input?.focus();
            })
            .with({ key: "escape" }, () => {
                this.input?.blur();
            })
            .otherwise(() => {});
    }

    override connectedCallback() {
        super.connectedCallback();
        document.addEventListener("keydown", this.boundHandleShortcut);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("keydown", this.boundHandleShortcut);
    }

    protected override updated(
        _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
    ): void {
        if (_changedProperties.has("search") && this.input) {
            this.input.value = this.search ?? "";
        }
    }

    /**
     * Set the isInputFocused state to true when the search input is focused.
     */
    private handleFocus() {
        this.isFocused = true;
    }

    /**
     * Set the isInputFocused state to false when the search input is blurred.
     */
    private handleBlur() {
        this.isFocused = false;
    }

    override render() {
        return html`
            <div class="relative">
                <input
                    type="text"
                    class="input input-bordered w-full rounded-xl"
                    placeholder=${attr__("Search")}
                    aria-label=${attr__("Search")}
                    @input=${this.handleInput}
                    @focus=${this.handleFocus}
                    @blur=${this.handleBlur}
                />
                <span
                    class="absolute inset-y-0 right-2 hidden items-center sm:flex"
                >
                    <kbd
                        class="${classMap({
                            hidden: this.isFocused || this.hasValue,
                        })} kbd kbd-md mr-1"
                        >${__(this.shortcutText)}</kbd
                    >
                    <kbd
                        class="${classMap({
                            hidden: this.isFocused || this.hasValue,
                        })} kbd kbd-md"
                        >E</kbd
                    >
                </span>
            </div>
        `;
    }
}
