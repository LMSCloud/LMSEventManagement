import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { debounce } from "../lib/utilities";
import { attr__ } from "../lib/translate";
import { SortableColumns } from "../sharedDeclarations";

@customElement("lms-search")
export default class LMSSearch extends LitElement {
  @property({ type: Array }) sortableColumns: SortableColumns = ["id"];

  static override styles = [
    bootstrapStyles,
    css`
      svg {
        color: #000000;
        height: 1rem;
        width: 1rem;
      }
    `,
  ];

  private parseQuery(query: string): Record<string, any> {
    const entries: Record<string, any> = {};
    const parts = query.split(" AND ");

    parts.forEach((part) => {
      const [rawKey, rawValue] = part.split(":").map((s) => s.trim());
      if (!rawKey || rawValue === undefined) return;

      let value: string | number | string[] = rawValue;
      let operator = "=";

      // Handle OR queries
      if (rawValue.includes(" OR ")) {
        operator = "||";
        value = rawValue.split("OR").map((s) => s.trim());
      }

      // Handle numeric and quoted values
      else if (!isNaN(parseFloat(rawValue))) {
        value = parseFloat(rawValue);
      } else if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
        value = rawValue.slice(1, -1);
      }

      // Handle operators
      else if (rawValue.includes(">=")) {
        operator = ">=";
        value = rawValue.split(">=")[1].trim();
      } else if (rawValue.includes("<=")) {
        operator = "<=";
        value = rawValue.split("<=")[1].trim();
      } else if (rawValue.includes(">")) {
        operator = ">";
        value = rawValue.split(">")[1].trim();
      } else if (rawValue.includes("<")) {
        operator = "<";
        value = rawValue.split("<")[1].trim();
      } else if (rawValue.includes("~")) {
        operator = "-like";
        value = rawValue.split("~")[1].trim();
      } else if (rawValue.includes("!~")) {
        operator = "-not_like";
        value = rawValue.split("!~")[1].trim();
      }

      entries[rawKey] = { operator, value };
    });

    return entries;
  }

  private buildQuery(query: Record<string, any>): any[] {
    let builtQuery: any[] = [];
    for (const [key, { operator, value }] of Object.entries(query)) {
      switch (operator) {
        case "=":
          builtQuery.push({ [key]: value });
          break;
        case "||":
          if (Array.isArray(value)) {
            value.forEach((v: string) => builtQuery.push({ [key]: v }));
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

  private getQuery(query: string) {
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
        const wildcardQuery = this.sortableColumns.reduce((entries, field) => {
          entries.push({
            [field]: {
              "-like": `${encoded["%"]}${encoded.query}${encoded["%"]}`,
            },
          });
          return entries;
        }, [] as Array<Record<string, any>>);
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

  override render() {
    return html`
      <div class="input-group flex-nowrap">
        <div class="input-group-prepend">
          <span class="input-group-text" id="addon-wrapping" aria
            >${litFontawesome(faSearch)}</span
          >
        </div>
        <input
          type="text"
          class="form-control"
          placeholder=${attr__("Search")}
          aria-label=${attr__("Search")}
          aria-describedby="addon-wrapping"
          @input=${this.handleInput}
        />
      </div>
    `;
  }
}
