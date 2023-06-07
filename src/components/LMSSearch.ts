import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { attr__ } from "../lib/translate";
import { debounce } from "../lib/utilities";
import { SortableColumns } from "../sharedDeclarations";
import { tailwindStyles } from "../tailwind.lit";

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

    static override styles = [
        tailwindStyles,
        css`
            svg {
                color: #000000;
                height: 1rem;
                width: 1rem;
            }
        `,
    ];

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
            if (!rawKey || rawValue === undefined) return;

            let value: string | number | string[] = rawValue;
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
                        value = value.trim();
                        break;
                    }
                }
            }

            entries[rawKey] = { operator, value };
        });

        return entries;
    }

    private buildQuery(query: ParsedQuery): Record<string, any> {
        let builtQuery: any[] = [];
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
            [builtQuery] = builtQuery;
        }
        return builtQuery;
    }

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
                    [] as Array<Record<string, any>>
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

    private handleInput(e: InputEvent) {
        const inputElement = e.target as HTMLInputElement;
        this.debouncedSearch(inputElement.value);
    }

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

    private handleFocus() {
        this.isInputFocused = true;
    }

    private handleBlur() {
        this.isInputFocused = false;
    }

    override render() {
        const shortcutText = this.isMacOS ? "⌘" : "Ctrl";

        return html`
            <div class="relative">
                <input
                    type="text"
                    class="input input-bordered rounded-xl w-full"
                    placeholder=${attr__("Search")}
                    aria-label=${attr__("Search")}
                    @input=${this.handleInput}
                    @focus=${this.handleFocus}
                    @blur=${this.handleBlur}
                />
                <span class="absolute inset-y-0 right-2 flex items-center"  >
                    <kbd
                        class="kbd kbd-md mr-1 ${classMap({
                            hidden: this.isInputFocused,
                        })}"
                        >${shortcutText}</kbd
                    >
                    <kbd
                        class="kbd kbd-md ${classMap({
                            hidden: this.isInputFocused,
                        })}"
                        >E</kbd
                    >
                </span>
            </div>
        `;
    }
}
