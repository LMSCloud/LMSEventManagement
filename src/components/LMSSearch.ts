import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("lms-search")
export default class LMSSearch extends LitElement {
  private debouncedSearch = this.debounce(this.search, 250, false);

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

  private debounce<F extends (...args: any[]) => void>(
    func: F,
    wait: number,
    immediate: boolean
  ): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
      const context = this;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeout;
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait);

      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  private search(query: string) {
    this.dispatchEvent(
      new CustomEvent("search", {
        detail: query,
        bubbles: true,
        composed: false,
      })
    );
  }

  private handleInput(e: InputEvent) {
    const inputElement = e.target as HTMLInputElement;
    this.debouncedSearch.call(this, inputElement.value);
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
