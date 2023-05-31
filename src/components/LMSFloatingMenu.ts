import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { __, attr__ } from "../lib/translate";
import { TranslatedString } from "../sharedDeclarations";

type MenuEntry = {
  name: string | TranslatedString;
  icon: IconDefinition;
  url: string;
  method: string;
};

@customElement("lms-floating-menu")
export default class LMSFloatingMenu extends LitElement {
  @property({ type: String }) brand = "Navigation";

  @property({ type: Array }) items: MenuEntry[] = [];

  @property({ type: URLSearchParams, attribute: false })
  private currentSearchParams = new URLSearchParams(window.location.search);

  @query("#navbarNav") private navbarNav!: HTMLElement;

  private isOpen = false;

  static override styles = [
    bootstrapStyles,
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

  private toggleNavbarCollapse() {
    this.navbarNav.classList.toggle("collapse");
    this.isOpen = this.navbarNav.classList.contains("show");
  }

  private isUrlMatchingSearchParams(
    url: string,
    searchParams: URLSearchParams
  ): boolean {
    const [, itemSearchParams]: string[] | URLSearchParams[] = url.split("?");
    const itemSearchParamsObj = new URLSearchParams(itemSearchParams ?? "");
    return itemSearchParamsObj.toString() === searchParams.toString();
  }

  override render() {
    return html`
      <nav class="navbar navbar-expand-lg navbar-light mx-2 mt-3 mb-5 rounded">
        <a class="navbar-brand" href="#"><strong>${this.brand}</strong></a>
        <button
          @click=${this.toggleNavbarCollapse}
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded=${this.isOpen ? "true" : "false"}
          aria-label=${attr__("Toggle navigation")}
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            ${this.items.map((item) => {
              const matches = this.isUrlMatchingSearchParams(
                item.url,
                this.currentSearchParams
              );

              return html`
                <li class=${classMap({ "nav-item": true, active: matches })}>
                  <a class="nav-link" href=${item.url}>
                    ${litFontawesome(item.icon)} ${item.name}
                    ${matches
                      ? html`<span class="sr-only">(${__("current")})</span>`
                      : ""}
                  </a>
                </li>
              `;
            })}
          </ul>
        </div>
      </nav>
    `;
  }
}
