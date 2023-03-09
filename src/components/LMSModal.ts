/* eslint-disable no-underscore-dangle */
import { LitElement, html, css, TemplateResult, nothing } from "lit";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { faPlus, faClose } from "@fortawesome/free-solid-svg-icons";
import TranslationHandler from "../lib/TranslationHandler";
import { customElement, property } from "lit/decorators";
import { Gettext } from "gettext.js";
import {
  CreateOpts,
  HandlerCallbackFunction,
  ModalField,
} from "../sharedDeclarations";
import LMSSelect from "./Inputs/LMSSelect";
import LMSCheckboxInput from "./Inputs/LMSCheckboxInput";
import LMSPrimitivesInput from "./Inputs/LMSPrimitivesInput";
import LMSMatrix from "./Inputs/LMSMatrix";

type HandlerExecutorArgs = {
  handler: HandlerCallbackFunction;
  event?: Event;
  value?: string | number;
  requestUpdate: boolean;
};

declare global {
  interface HTMLElementTagNameMap {
    "lms-select": LMSSelect;
    "lms-checkbox-input": LMSCheckboxInput;
    "lms-primitives-input": LMSPrimitivesInput;
    "lms-matrix": LMSMatrix;
  }
}

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
  @property({ type: Boolean, attribute: false }) hasResolvedEntries = false;

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
      .then(() => {
        /** Here we declare an array of Promises for each field in this.fields.
         *  The Promises themselves resolve to tuples of the form [index, field.logic ? false : true].
         *  When the then after the call to the logic function is executed,
         *  the second element of the tuple is set to true. */
        const logicResolved = this.fields.map((field, index) => {
          if (field.logic) {
            return field.logic().then((entries) => {
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

              return [index, true];
            });
          }
          return Promise.resolve([index, true]);
        });

        /** We then wait for all the Promises to resolve and then set the
         * hasResolvedEntries property to true. */
        Promise.all(logicResolved).then(() => {
          this.hasResolvedEntries = true;
        });
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
    return this.fields.every((field) => field.value === undefined)
      ? nothing
      : html`
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
                      class="alert alert-${this._alertMessage.includes(
                        "Sorry!"
                      ) && "danger"} alert-dismissible fade show"
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

  public executeHandler({
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
    if (!field.desc) return nothing;

    const { value } = field;
    const fieldTypes = new Map<string, TemplateResult>([
      [
        "select",
        html`<lms-select
          .field=${field}
          .outerScope=${this}
          .hasResolvedEntries=${this.hasResolvedEntries}
        ></lms-select>`,
      ],
      [
        "checkbox",
        html`<lms-checkbox-input
          .field=${field}
          .value=${value as string}
        ></lms-checkbox-input>`,
      ],
      ["info", html`<p>${field.desc}</p>`],
      [
        "matrix",
        html`<lms-matrix
          .field=${field}
          .value=${value as { [key: string]: string }[]}
          .hasResolvedEntries=${this.hasResolvedEntries}
        ></lms-matrix>`,
      ],
      [
        "default",
        html`<lms-primitives-input
          .field=${field}
          .value=${value as string | number}
        ></lms-primitives-input>`,
      ],
    ]);

    if (!field.type) {
      return nothing;
    }

    return fieldTypes.has(field.type)
      ? fieldTypes.get(field.type)
      : fieldTypes.get("default");
  }
}
