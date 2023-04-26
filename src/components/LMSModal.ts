import { LitElement, html, css, nothing, TemplateResult } from "lit";
import { map } from "lit/directives/map.js";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { faPlus, faClose } from "@fortawesome/free-solid-svg-icons";
import { customElement, property, state } from "lit/decorators.js";
import { CreateOpts, MatrixGroup, ModalField } from "../sharedDeclarations";
import LMSSelect from "./Inputs/LMSSelect";
import LMSCheckboxInput from "./Inputs/LMSCheckboxInput";
import LMSPrimitivesInput from "./Inputs/LMSPrimitivesInput";
import LMSMatrix from "./Inputs/LMSMatrix";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { TranslateDirective, __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { DirectiveResult } from "lit/directive";

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
  @state() protected isOpen = false;
  @state() protected alertMessage = "";
  @state() protected modalTitle:
    | string
    | DirectiveResult<typeof TranslateDirective> = "";

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
    css`
      .btn-modal-wrapper {
        position: fixed;
        bottom: 1em;
        right: 1em;
        border-radius: 50%;
        background-color: var(--primary-color);
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
        color: var(--background-color);
      }
      button {
        white-space: nowrap;
      }
      button.btn-modal > svg {
        color: var(--background-color);
      }
    `,
  ];

  private toggleModal() {
    this.isOpen = !this.isOpen;
    document.body.style.overflow = this.isOpen ? "hidden" : "auto";
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

    if (response.ok) {
      this.toggleModal();

      const event = new CustomEvent("created", { bubbles: true });
      this.dispatchEvent(event);
    }

    if (!response.ok) {
      const result = await response.json();

      if (result.error) {
        this.alertMessage = `Sorry! ${result.error}`;
        return;
      }

      if (result.errors) {
        console.trace(result.errors);
      }
    }
  }

  private dismissAlert() {
    this.alertMessage = "";
  }

  override firstUpdated() {
    this.initIntersectionObserver();

    const dbDataPopulated = this.fields.map(async (field: ModalField) => {
      if (field.logic) {
        return {
          ...field,
          dbData: await field.logic(),
        };
      }
      return field;
    });

    Promise.all(dbDataPopulated).then((fields: ModalField[]) => {
      this.fields = fields;
    });
  }

  override render() {
    return html`
      <div
        class="btn-modal-wrapper"
        style=${styleMap({
          zIndex: this.isOpen ? "1051" : "1049",
        })}
      >
        <button
          @click=${this.toggleModal}
          class="btn-modal ${classMap({ tilted: this.isOpen })}"
          type="button"
        >
          ${litFontawesome(faPlus)}
        </button>
      </div>
      <div
        class="backdrop"
        ?hidden=${!this.isOpen}
        @click=${this.toggleModal}
      ></div>
      <div
        class="modal fade ${classMap({
          "d-block": this.isOpen,
          show: this.isOpen,
        })}"
        id="lms-modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="lms-modal-title"
        aria-hidden="true"
        style=${styleMap({
          overflowY: this.isOpen ? "scroll" : "auto",
        })}
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="lms-modal-title">
                ${this.modalTitle ?? `${__("Add")}`}
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
                  ?hidden=${!this.alertMessage}
                  class="alert ${classMap({
                    "alert-danger": this.alertMessage.includes("Sorry!"),
                  })} alert-dismissible fade show"
                >
                  ${this.alertMessage}
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
                ${map(this.fields, (value) => this.getFieldMarkup(value))}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  @click=${this.toggleModal}
                >
                  ${litFontawesome(faClose)}
                  <span>${__("Close")}</span>
                </button>
                <button type="submit" class="btn btn-primary">
                  ${litFontawesome(faPlus)}
                  <span>${__("Create")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  protected mediateChange(e: CustomEvent) {
    const { name, value } = e.detail;
    this.fields = [
      ...this.fields.map((field) => {
        if (field.name === name) {
          return {
            ...field,
            value,
          };
        }
        return field;
      }),
    ];
  }

  private getFieldMarkup(field: ModalField) {
    const { type, desc } = field;
    if (!type || !desc) return nothing;

    const { value } = field;
    const fieldTypes = new Map<string, TemplateResult>([
      [
        "select",
        html`<lms-select
          @change=${this.mediateChange}
          .field=${field}
        ></lms-select>`,
      ],
      [
        "checkbox",
        html`<lms-checkbox-input
          .field=${field}
          .value=${value as string}
        ></lms-checkbox-input>`,
      ],
      ["info", html`<p>${desc}</p>`],
      [
        "matrix",
        html`<lms-matrix
          .field=${field}
          .value=${value as MatrixGroup[]}
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

    return fieldTypes.has(type)
      ? fieldTypes.get(type)
      : fieldTypes.get("default");
  }

  initIntersectionObserver() {
    const footer = document.getElementById("i18nMenu")?.parentElement;
    const btnModalWrapper = this.shadowRoot?.querySelector(
      ".btn-modal-wrapper"
    ) as HTMLElement;
    if (!footer || !btnModalWrapper) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            let bottom = parseFloat(getComputedStyle(btnModalWrapper).bottom);
            bottom = bottom + footer.offsetHeight;
            btnModalWrapper.style.bottom = `${bottom}px`;
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );
    observer.observe(footer);
  }
}
