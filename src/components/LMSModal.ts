/* eslint-disable no-underscore-dangle */
import { LitElement, html, css, TemplateResult } from "lit";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { faPlus, faClose } from "@fortawesome/free-solid-svg-icons";
import TranslationHandler from "../lib/TranslationHandler";
import { customElement, property } from "lit/decorators";
import { Gettext } from "gettext.js";
import { CreateOpts, Field } from "../interfaces";

@customElement("lms-modal")
export default class LMSModal extends LitElement {
  @property({ type: Array }) fields: Field[] = [];
  @property({ type: Object }) createOpts: CreateOpts = {
    endpoint: "",
  };
  @property({ type: Boolean }) editable = false;
  @property({ type: Boolean }) isOpen = false;
  @property({ type: String, attribute: false }) _alertMessage = "";
  @property({ type: String, attribute: false }) _modalTitle = "";
  @property({ type: Object, attribute: false }) _i18n:
    | Gettext
    | Promise<Gettext> = {} as Gettext;

  static override styles = [
    bootstrapStyles,
    css`
      .btn-modal-wrapper {
        position: fixed;
        bottom: 1em;
        right: 1em;
        border-radius: 50%;
        background-color: var(--background-color);
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: var(--shadow-hv);
        cursor: pointer;
        z-index: 1049;
      }
      .btn-modal-wrapper > .btn-modal {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 2em;
        width: 2em;
        height: 2em;
      }
      .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(0 0 0 / 50%);
        z-index: 1048;
      }
      button.btn-modal:not(.tilted) {
        transition: 0.2s;
        transition-timing-function: ease-in-out;
        transform: translateX(1px) rotate(0deg);
      }
      .tilted {
        transition: 0.2s;
        transition-timing-function: ease-in-out;
        transform: translateX(2px) translateY(1px) rotate(45deg);
      }
      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #ffffff;
      }
      button {
        white-space: nowrap;
      }
      button.btn-modal > svg {
        color: var(--text-color);
      }
    `,
  ];

  override connectedCallback() {
    super.connectedCallback();
    const translationHandler = new TranslationHandler();
    this._i18n = translationHandler.loadTranslations();
    this._i18n
      .then((i18n) => {
        this._i18n = i18n;
      })
      .then(async () => {
        for (let index = 0; index < this.fields.length; index += 1) {
          const field = this.fields[index];
          if (field.logic) {
            const entries = await field.logic();
            field.entries = entries;
          }
        }
      })
      .then(() => {
        this._moveOnOverlap();
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

  _toggleModal() {
    this.isOpen = !this.isOpen;
  }

  async _create(e: Event) {
    e.preventDefault();
    const { endpoint, method } = this.createOpts;
    const response = await fetch(endpoint, {
      method,
      body: JSON.stringify({
        ...Object.assign(
          {},
          ...this.fields.map((field: Field) => ({
            [field.name]: field.value,
          }))
        ),
      }),
    });

    if (response.status >= 200 && response.status <= 299) {
      this._toggleModal();

      const event = new CustomEvent("created", { bubbles: true });
      this.dispatchEvent(event);
    }

    if (response.status >= 400) {
      const result = await response.json();

      /** We have to check whether we get a single error or an
       *  errors object. If we get an errors object, we have to
       *  loop through it and display each error message. */
      if (result.error) {
        this._alertMessage = `Sorry! ${result.error}`;
        return;
      }

      if (result.errors) {
        console.trace(result.errors);
      }
    }
  }

  _dismissAlert() {
    this._alertMessage = "";
  }

  override render() {
    return html`
      <div class="btn-modal-wrapper">
        <button
          @click=${this._toggleModal}
          class="btn-modal ${this.isOpen && "tilted"}"
          type="button"
        >
          ${litFontawesome(faPlus)}
        </button>
      </div>
      <div class="backdrop" ?hidden=${!this.isOpen}></div>
      <div
        class="modal fade ${this.isOpen && "d-block show"}"
        id="lms-modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="lms-modal-title"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="lms-modal-title">
                ${this._modalTitle || "Add"}
              </h5>
              <button
                @click=${this._toggleModal}
                type="button"
                class="close"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form @submit="${this._create}">
              <div class="modal-body">
                <div
                  role="alert"
                  ?hidden=${!this._alertMessage}
                  class="alert alert-${this._alertMessage.includes("Sorry!") &&
                  "danger"} alert-dismissible fade show"
                >
                  ${this._alertMessage}
                  <button
                    @click=${this._dismissAlert}
                    type="button"
                    class="close"
                    data-dismiss="alert"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                ${this.fields.map((field) => this._getFieldMarkup(field))}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  @click=${this._toggleModal}
                >
                  ${litFontawesome(faClose)}
                  <span>Close</span>
                </button>
                <button type="submit" class="btn btn-primary">
                  ${litFontawesome(faPlus)}
                  <span>Create</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  _getFieldMarkup(field: Field) {
    if (!field.desc) return html``;

    const fieldTypes = new Map<string, () => TemplateResult>([
      [
        "select",
        (): TemplateResult => {
          if (!field.entries) return html``;
          return html`
            <div class="form-group">
              <label for=${field.name}>${field.desc}</label>
              <select
                name=${field.name}
                id=${field.name}
                class="form-control"
                @change=${(e: Event) => {
                  field.value =
                    (e.target as HTMLSelectElement).value ?? field.value;
                }}
                ?required=${field.required}
              >
                ${field.entries.map(
                  (entry) =>
                    html`<option value=${entry.value}>${entry.name}</option>`
                )}
              </select>
            </div>
          `;
        },
      ],
      [
        "checkbox",
        (): TemplateResult => {
          return html`
            <div class="form-check">
              <input
                type="checkbox"
                name=${field.name}
                id=${field.name}
                value="1"
                class="form-check-input"
                @input=${(e: Event) => {
                  field.value =
                    (e.target as HTMLInputElement).value ?? field.value;
                }}
                ?required=${field.required}
              />
              <label for="${field.name}">&nbsp;${field.desc}</label>
            </div>
          `;
        },
      ],
      [
        "info",
        (): TemplateResult => {
          return html`<p>${field.desc}</p>`;
        },
      ],
      [
        "default",
        (): TemplateResult => {
          return html`
            <div class="form-group">
              <label for=${field.name}>${field.desc}</label>
              <input
                type=${field.type}
                name=${field.name}
                id=${field.name}
                class="form-control"
                @input=${(e: Event) => {
                  field.value =
                    (e.target as HTMLInputElement).value ?? field.value;
                }}
                ?required=${field.required}
              />
            </div>
          `;
        },
      ],
    ]);

    return fieldTypes.get(field.type)?.() || fieldTypes.get("default")?.();
  }

  _moveOnOverlap() {
    const fixedElement = this.renderRoot.querySelector(".btn-modal-wrapper");
    if (!fixedElement) return;

    const fixedRect = fixedElement.getBoundingClientRect();
    if (
      [...document.querySelectorAll("body *")].some((element) => {
        if (element === fixedElement) return false;
        const otherRect = element.getBoundingClientRect();
        // Check if the fixedRect and otherRect overlap by comparing their positions
        return (
          fixedRect.right < otherRect.left &&
          fixedRect.left > otherRect.right &&
          fixedRect.bottom < otherRect.top &&
          fixedRect.top > otherRect.bottom
        );
      })
    ) {
      (fixedElement as HTMLElement).style.top =
        parseFloat(getComputedStyle(fixedElement).top) - 1 + "em";
    }
  }
}
