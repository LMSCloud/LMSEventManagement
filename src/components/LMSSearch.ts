import { html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { attr__ } from "../lib/translate";
import { debounce } from "../lib/utilities";
import { tailwindStyles } from "../tailwind.lit";
import { SortableColumns } from "../types/common";

interface QueryEntry {
    operator: string;
    value: string | number | Array<string>;
}

type ParsedQuery = Record<string, QueryEntry>;

@customElement("lms-search")
export default class LMSSearch extends LitElement {
    @property({ type: Array }) sortableColumns: SortableColumns = ["id"];

    @query("input") input!: HTMLInputElement;

    @state() isInputFocused = false;

    private isMacOS: boolean = /(Mac|iPhone|iPod|iPad)/i.test(
        navigator.userAgent
    );

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

        const operators = {
            ">=": ">=",
            "<=": "<=",
            ">": ">",
            "<": "<",
            "~": "-like",
            "!~": "-not_like",
        };

        parts.forEach((part) => {
            const [rawKey, rawValue] = part.split(":").map((s) => s.trim());
            if (!rawKey || rawValue === undefined) {
                return;
            }

            let value: string | number | string[] | undefined = rawValue;
            let operator = "=";

            // Handle OR queries
            if (rawValue.includes(" OR ")) {
                operator = "||";
                value = rawValue.split(" OR ").map((s) => s.trim());
            }

            // Handle numeric and quoted values
            else if (!isNaN(parseFloat(rawValue))) {
                value = parseFloat(rawValue);
            } else if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
                value = rawValue.slice(1, -1);
            }

            // Handle operators
            else {
                for (const op of Object.keys(operators)) {
                    if (rawValue.includes(op)) {
                        operator = operators[op as keyof typeof operators];
                        [, value] = rawValue.split(op);
                        if (value) {
                            value = value.trim();
                        } else {
                            value = "";
                        }
                        break;
                    }
                }
            }

            entries[rawKey] = { operator, value };
        });

        return entries;
    }

    /**
     * Build a structured query object into the format expected by the backend.
     *
     * @param {ParsedQuery} query - The structured query object to build.
     * @returns {unknown[] | Record<string, unknown>} The built query.
     */
    private buildQuery(
        query: ParsedQuery
    ): unknown[] | Record<string, unknown> {
        const builtQuery: unknown[] = [];
        for (const [key, { operator, value }] of Object.entries(query)) {
            switch (operator) {
                case "=":
                    builtQuery.push({ [key]: value });
                    break;
                case "||":
                    if (Array.isArray(value)) {
                        value.forEach((v: string) =>
                            builtQuery.push({ [key]: v })
                        );
                    } else {
                        builtQuery.push({ [key]: value });
                    }
                    break;
                default:
                    builtQuery.push({ [key]: { [operator]: value } });
            }
        }

        if (builtQuery.length === 1) {
            const [queryItem] = builtQuery;
            return queryItem as Record<string, unknown>;
        }

        return builtQuery;
    }

    /**
     * Get the query string or build a structured query.
     *
     * @param {string} query - The query string or structured query to get.
     * @returns {string} The built query as a string.
     */
    private getQuery(query: string): string {
        let q = undefined;
        if (query) {
            if (query.includes(":")) {
                // It's a structured query
                const parsedQuery = this.parseQuery(query);
                const builtQuery = this.buildQuery(parsedQuery);
                q = JSON.stringify(builtQuery);
            } else {
                // It's a bare search term, build a wildcard query for each field
                const encoded = {
                    "%": window.encodeURIComponent("%"),
                    query: window.encodeURIComponent(query),
                };
                const wildcardQuery = this.sortableColumns.reduce(
                    (entries, field) => {
                        entries.push({
                            [field]: {
                                "-like": `${encoded["%"]}${encoded.query}${encoded["%"]}`,
                            },
                        });
                        return entries;
                    },
                    [] as Array<Record<string, unknown>>
                );
                q = JSON.stringify(wildcardQuery);
            }
        } else {
            q = JSON.stringify({});
        }

        return q;
    }

    private debouncedSearch = debounce(
        (query: string) => {
            this.dispatchEvent(
                new CustomEvent("search", {
                    detail: {
                        q: this.getQuery(query),
                    },
                    bubbles: true,
                    composed: false,
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
        this.debouncedSearch(inputElement.value);
    }

    /**
     * Handle keyboard shortcuts to focus and blur the search input.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     */
    private handleShortcut(e: KeyboardEvent) {
        const isCmdOrCtrlPressed = e.metaKey || e.ctrlKey;
        if (isCmdOrCtrlPressed && e.key.toLowerCase() === "e") {
            e.preventDefault();
            if (this.input) {
                this.input.focus();
            }
        } else if (e.key === "Escape") {
            if (this.input) {
                this.input.blur();
            }
        }
    }

    override connectedCallback() {
        super.connectedCallback();
        document.addEventListener("keydown", this.boundHandleShortcut);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("keydown", this.boundHandleShortcut);
    }

    /**
     * Set the isInputFocused state to true when the search input is focused.
     */
    private handleFocus() {
        this.isInputFocused = true;
    }

    /**
     * Set the isInputFocused state to false when the search input is blurred.
     */
    private handleBlur() {
        this.isInputFocused = false;
    }

    override render() {
        const shortcutText = this.isMacOS ? "⌘" : "Ctrl";

        return html`
            <div class="relative">
                <input
                    type="text"
                    class="input-bordered input w-full rounded-xl"
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
                            hidden: this.isInputFocused,
                        })} kbd kbd-md mr-1"
                        >${shortcutText}</kbd
                    >
                    <kbd
                        class="${classMap({
                            hidden: this.isInputFocused,
                        })} kbd kbd-md"
                        >E</kbd
                    >
                </span>
            </div>
        `;
    }
}
