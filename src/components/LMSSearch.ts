import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { debounce } from "../lib/utilities";

@customElement("lms-search")
export default class LMSSearch extends LitElement {
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

  private debouncedSearch = debounce(
    (query: string) => {
      this.dispatchEvent(
        new CustomEvent("search", {
          detail: query,
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
    console.log(inputElement.value);
    this.debouncedSearch(inputElement.value);
  }

  override render() {
    return html`
      <div class="input-group flex-nowrap">
        <div class="input-group-prepend">
          <span class="input-group-text" id="addon-wrapping"
            >${litFontawesome(faSearch)}</span
          >
        </div>
        <input
          type="text"
          class="form-control"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="addon-wrapping"
          @input=${this.handleInput}
        />
      </div>
    `;
  }
}
