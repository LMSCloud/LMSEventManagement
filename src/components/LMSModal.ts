/* eslint-disable no-underscore-dangle */
import { LitElement, html, css, TemplateResult, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { faPlus, faClose } from "@fortawesome/free-solid-svg-icons";
import TranslationHandler from "../lib/TranslationHandler";
import { customElement, property } from "lit/decorators";
import { Gettext } from "gettext.js";
import {
  CreateOpts,
  HandlerExecutorArgs,
  Input,
  ModalField,
  SelectOption,
} from "../interfaces";
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
      input[type="checkbox"].form-control {
        font-size: 0.375rem;
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

            if (field.type === "select") {
              [field.value] = field.default
                ? field.default.value
                : field.entries.map((entry) => entry.value);

              if (field.handler) {
                this.executeHandler({
                  handler: field.handler,
                  value: field.value,
                  requestUpdate: false,
                });
              }
            }
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
            <form @submit=${this.create}>
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

  private executeHandler({
    handler,
    event,
    value,
    requestUpdate,
  }: HandlerExecutorArgs) {
    if (event) {
      handler({ e: event, fields: this.fields }).then(() => {
        if (requestUpdate) this.requestUpdate();
      });
      return;
    }

    if (value) {
      handler({ value, fields: this.fields }).then(() => {
        if (requestUpdate) this.requestUpdate();
      });
    }
  }

  private getFieldMarkup(field: ModalField) {
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
                  if (field.handler) {
                    this.executeHandler({
                      handler: field.handler,
                      event: e,
                      requestUpdate: true,
                    });
                  }
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
                value=${(field.value as string) ?? "1"}
                class="form-check-input"
                @input=${(e: Event) => {
                  field.value =
                    (e.target as HTMLInputElement).value ?? field.value;
                }}
                ?required=${field.required}
                ?checked=${[true, "true", "1"].includes(field.value as string)}
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
          /** We reinitialise the value prop of the field to a prefilled
           *  array with default values so that we have a state that we
           *  can write to the DB if the respective item doesn't get selected. */
          field.value = field.value?.length ? field.value : [];
          const fieldValueRef: { [key: string]: string }[] = field.value as [];

          if (!fieldValueRef.length) {
            field.entries.forEach(({ value }) => {
              let id = value;

              fieldValueRef.push({ id });
              field.headers?.slice(1).forEach((header) => {
                const [name] = header;
                const currentObjIndex = fieldValueRef.findIndex(
                  (item) => item.id === id
                );

                if (!currentObjIndex) {
                  return;
                }
                fieldValueRef[currentObjIndex][name] = "0";
              });
            });
          }

          if (fieldValueRef.length) {
            field.value = fieldValueRef.map(
              ({ target_group_id, fee, selected }) => {
                return {
                  id: target_group_id,
                  fee: fee.toString(),
                  selected: selected ? "1" : "0",
                };
              }
            );
          }

          return html` <label for=${field.name}>${field.desc}</label>
            <table class="table table-bordered" id=${field.name}>
              <thead>
                <tr>
                  ${field.headers?.map(
                    ([name]) => html`<th scope="col">${name}</th>`
                  )}
                </tr>
              </thead>
              <tbody>
                ${field.entries.map(
                  ({ value, name }) => html`
                    <tr>
                      <td class="align-middle" id=${value}>${name}</td>
                      ${field.headers /* Tuples: [name, type] */
                        ?.slice(1)
                        .map((header) =>
                          this.getMatrixInputMarkup(
                            field,
                            { value, name },
                            header
                          )
                        )}
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
                value=${ifDefined(
                  typeof field.value === "string"
                    ? field.value
                    : field.value?.toString()
                )}
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

  private getMatrixInputMarkup(
    field: ModalField,
    entry: Input,
    [name, type]: string[]
  ) {
    const inputTypes = new Map<string, () => TemplateResult>([
      [
        "number",
        (): TemplateResult => {
          return html`<td class="align-middle">
            <input
              type="number"
              name=${entry.name}
              id=${entry.value}
              value=${ifDefined(
                field.value instanceof Array
                  ? field.value?.find((item) => item.id === entry.value)?.[name]
                  : undefined
              )}
              step="0.01"
              class="form-control"
              step=${ifDefined(
                field.attributes
                  ?.find(([attribute]) => attribute === "step")
                  ?.at(-1) as number
              )}
              @input=${(e: Event) => {
                // if (field.handler) {
                //   this.executeHandler({ handler: field.handler, event: e });
                // }
                this.handleMatrixInput(e, field, name, entry);
              }}
              ?required=${field.required}
            />
          </td>`;
        },
      ],
      [
        "checkbox",
        (): TemplateResult => {
          return html` <td class="align-middle">
            <input
              type="checkbox"
              name=${entry.name}
              id=${entry.value}
              value="1"
              class="form-control"
              @input=${(e: Event) => {
                // if (field.handler) {
                //   this.executeHandler({ handler: field.handler, event: e });
                // }
                this.handleMatrixInput(e, field, name, entry);
              }}
              ?required=${field.required}
              ?checked=${field.value instanceof Array
                ? field.value?.find((item) => item.id === entry.value)?.[
                    name
                  ] === "1"
                : undefined}
            />
          </td>`;
        },
      ],
    ]);

    if (!field.headers?.length) return inputTypes.get("default")?.();

    return inputTypes.get(type)?.() ?? inputTypes.get("default")?.();
  }

  private handleMatrixInput(
    e: Event,
    field: ModalField,
    name: string,
    entry: { value: string; name: string }
  ) {
    const target = e.target;
    if (
      !(target instanceof HTMLInputElement) ||
      !(field.value instanceof Array) ||
      !target?.value
    ) {
      return;
    }

    const index = field.value.findIndex((row) => row.id === entry.value);
    if (index === -1) {
      field.value.push({
        id: entry.value,
        [name]:
          new Map<string, string>([
            ["number", target.value],
            ["checkbox", target.checked ? "1" : "0"],
          ]).get(target.type) ?? target.value,
      });
      return;
    }

    field.value[index][name] = target.value;
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
