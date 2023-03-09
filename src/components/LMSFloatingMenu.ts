import { LitElement, html, css, nothing } from "lit";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { customElement, property } from "lit/decorators.js";
import TranslationHandler from "../lib/TranslationHandler.js";
import { Gettext } from "gettext.js";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type MenuEntry = {
  name: string;
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
  @property({ type: Object, attribute: false }) _i18n:
    | Gettext
    | Promise<Gettext> = {} as Gettext;

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

  override connectedCallback() {
    super.connectedCallback();
    const translationHandler = new TranslationHandler();
    this._i18n = new Promise((resolve, reject) => {
      translationHandler
        .loadTranslations()
        .then(() => {
          resolve(translationHandler.i18n);
        })
        .catch((err) => reject(err));
    });
  }

  override updated() {
    /** We have to set the _i18n attribute to the actual
     *  class after the promise has been resolved.
     *  We also want to cover the case were this._i18n
     *  is defined but not yet a Promise. */
    if (this._i18n instanceof Promise) {
      this._i18n.then((i18n) => {
        this._i18n = i18n;
      });
    }
  }

  override render() {
    return this._i18n instanceof Promise
      ? nothing
      : html` <nav
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
                      ? html` <span class="sr-only"
                          >(${(this._i18n as Gettext).gettext("current")})</span
                        >`
                      : ""}</a
                  >
                </li>`;
              })}
            </ul>
          </div>
        </nav>`;
  }
}
