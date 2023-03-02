/* eslint-disable no-underscore-dangle */
import { LitElement, html, css, TemplateResult, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { faPlus, faClose } from "@fortawesome/free-solid-svg-icons";
import TranslationHandler from "../lib/TranslationHandler";
import { customElement, property } from "lit/decorators";
import { Gettext } from "gettext.js";
import { CreateOpts, ModalField, SelectOption } from "../interfaces";
import { InputType } from "../types";

@customElement("lms-modal")
export default class LMSModal extends LitElement {
  @property({ type: Array }) fields: ModalField[] = [];
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
        this.moveOnOverlap();
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

  private toggleModal() {
    const { renderRoot } = this;
    this.isOpen = !this.isOpen;
    document.body.style.overflow = this.isOpen ? "hidden" : "auto";
    const lmsModal = (renderRoot as ShadowRoot).getElementById("lms-modal");
    if (lmsModal) {
      lmsModal.style.overflowY = this.isOpen ? "scroll" : "auto";
    }
  }

  private async create(e: Event) {
    e.preventDefault();
    const { endpoint, method } = this.createOpts;
    console.log(this.fields);
    const response = await fetch(endpoint, {
      method,
      body: JSON.stringify({
        ...Object.assign(
          {},
          ...this.fields.map((field: ModalField) => ({
            [field.name]: field.value,
          }))
        ),
      }),
    });

    if (response.status >= 200 && response.status <= 299) {
      this.toggleModal();

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

  private dismissAlert() {
    this._alertMessage = "";
  }

  override render() {
    return html`
      <div class="btn-modal-wrapper">
        <button
          @click=${this.toggleModal}
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
                @click=${this.toggleModal}
                type="button"
                class="close"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form @submit="${this.create}">
              <div class="modal-body">
                <div
                  role="alert"
                  ?hidden=${!this._alertMessage}
                  class="alert alert-${this._alertMessage.includes("Sorry!") &&
                  "danger"} alert-dismissible fade show"
                >
                  ${this._alertMessage}
                  <button
                    @click=${this.dismissAlert}
                    type="button"
                    class="close"
                    data-dismiss="alert"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                ${this.fields.map((field) => this.getFieldMarkup(field))}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  @click=${this.toggleModal}
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

  private getFieldMarkup(field: ModalField) {
    if (!field.desc) return html``;

    const fieldTypes = new Map<string, () => TemplateResult>([
      [
        "select",
        (): TemplateResult => {
          if (!field.entries) return html``;
          [field.value] = field.default
            ? field.default.value
            : field.entries.map((entry) => entry.value);
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
                ${field.default?.name
                  ? html`<option value=${field.default.value}>
                      ${field.default.name}
                    </option>`
                  : nothing}
                ${field.entries.map(
                  ({ value, name }: SelectOption) =>
                    html`<option value=${value}>${name}</option>`
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
        "matrix",
        (): TemplateResult => {
          if (!field.entries) return html``;
          /** We reinitialise the value prop of the field to an empty object
           *  so we can add the values of the matrix to it. */
          field.value = {};

          return html` <label for=${field.name}>${field.desc}</label>
            <table class="table table-bordered" id=${field.name}>
              <thead>
                <tr>
                  ${field.headers?.map(
                    (header) => html`<th scope="col">${header}</th>`
                  )}
                </tr>
              </thead>
              <tbody>
                ${field.entries.map(
                  ({ value, name }) => html`
                    <tr>
                      <td id=${name}>${value}</td>
                      <td>
                        <input
                          type="number"
                          name=${name}
                          id=${value}
                          step="0.01"
                          class="form-control"
                          step=${ifDefined(
                            field.attributes
                              ?.find(([attribute]) => attribute === "step")
                              ?.at(-1) as number
                          )}
                          @input=${(e: Event) => {
                            if (
                              !(e.target instanceof HTMLInputElement) ||
                              !e.target?.value ||
                              typeof field.value !== "object"
                            ) {
                              return;
                            }
                            const target = e.target as HTMLInputElement;
                            (field.value as Record<string, string>)[value] =
                              target.value;
                          }}
                          ?required=${field.required}
                        />
                      </td>
                    </tr>
                  `
                )}
              </tbody>
            </table>`;
        },
      ],
      [
        "default",
        (): TemplateResult => {
          return html`
            <div class="form-group">
              <label for=${field.name}>${field.desc}</label>
              <input
                type=${ifDefined(field.type) as InputType}
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

    const fieldType =
      field.type && fieldTypes.has(field.type) ? field.type : "default";
    return fieldTypes.get(fieldType)?.() ?? fieldTypes.get("default")?.();
  }

  private moveOnOverlap() {
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
