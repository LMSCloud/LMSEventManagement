import { LitElement, html, css } from "lit";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { customElement, property } from "lit/decorators.js";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { TranslateDirective, __ } from "../lib/translate";
import { DirectiveResult } from "lit/directive.js";
import { skeletonStyles } from "../styles/skeleton";

type MenuEntry = {
  name: string | DirectiveResult<typeof TranslateDirective>;
  icon: IconDefinition;
  url: string;
  method: string;
};

@customElement("lms-floating-menu")
export default class LMSFloatingMenu extends LitElement {
  @property({ type: String }) brand = "Navigation";
  @property({
    type: Array,
    converter: (value) => (value ? JSON.parse(value) : []),
  })
  items: MenuEntry[] = [];
  @property({ type: String, attribute: false }) _currentUrl =
    window.location.href;
  @property({ type: String, attribute: false }) _currentSearchParams =
    new URLSearchParams(window.location.search);

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
    css`
      svg {
        width: 1rem;
        height: 1rem;
      }

      nav {
        background-color: var(--background-color);
        backdrop-filter: blur(5px);
        box-shadow: var(--shadow-hv);
      }
    `,
  ];

  override render() {
    return html` <nav
      class="navbar navbar-expand-lg navbar-light mx-2 mt-3 mb-5 rounded"
    >
      <a class="navbar-brand" href="#"><strong>${this.brand}</strong></a>
      <button
        @click=${() => {
          (this.renderRoot as ShadowRoot)
            .getElementById("navbarNav")
            ?.classList.toggle("collapse");
        }}
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          ${this.items.map((item) => {
            /** We split the searchParams from the URL and
             *  compare them to the currentSearchParams of
             *  the window.location. If they match, we add
             *  the "active" class to the item. */
            let [, itemSearchParams]: string[] | URLSearchParams[] =
              item.url.split("?");
            itemSearchParams = new URLSearchParams(itemSearchParams ?? "");
            const matches =
              itemSearchParams.toString() ===
              this._currentSearchParams.toString();

            return html` <li class="nav-item ${matches ? "active" : ""}">
              <a class="nav-link" href="${item.url}"
                >${litFontawesome(item.icon)}
                ${item.name}${matches
                  ? html` <span class="sr-only">(${__("current")})</span>`
                  : ""}</a
              >
            </li>`;
          })}
        </ul>
      </div>
    </nav>`;
  }
}
