import {
  faArrowRight,
  faClose,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import {
  LitElement,
  PropertyValueMap,
  TemplateResult,
  css,
  html,
  nothing,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { DirectiveResult } from "lit/directive";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { styleMap } from "lit/directives/style-map.js";
import { IntersectionObserverHandler } from "../lib/IntersectionObserverHandler";
import { TranslateDirective, __, attr__, locale } from "../lib/translate";
import {
  CreateOpts,
  KohaAPIError,
  MatrixGroup,
  ModalField,
} from "../sharedDeclarations";
import { skeletonStyles } from "../styles/skeleton";
import LMSCheckboxInput from "./inputs/modal/LMSCheckboxInput";
import LMSMatrix from "./inputs/modal/LMSMatrix";
import LMSPrimitivesInput from "./inputs/modal/LMSPrimitivesInput";
import LMSSelect from "./inputs/modal/LMSSelect";

declare global {
  interface HTMLElementTagNameMap {
    "lms-select": LMSSelect;
    "lms-checkbox-input": LMSCheckboxInput;
    "lms-primitives-input": LMSPrimitivesInput;
    "lms-matrix": LMSMatrix;
  }
}

export type Alert = {
  active: boolean;
  message: TemplateResult | undefined;
};

@customElement("lms-modal")
export default class LMSModal extends LitElement {
  @property({ type: Array }) fields: ModalField[] = [];

  @property({ type: Object }) createOpts: CreateOpts = {
    endpoint: "",
  };

  @property({ type: Boolean }) editable = false;

  @state() protected isOpen = false;

  @state() protected alert: Alert = { active: false, message: undefined };

  @state() protected modalTitle:
    | string
    | DirectiveResult<typeof TranslateDirective> = "";

  @query(".btn-modal-wrapper") btnModalWrapper!: HTMLElement;

  @query(".close") closeBtn!: HTMLElement;

  /** TODO: Maybe we can find a cleaner way to do the intersection observations than in the base modal component */
  private footer: HTMLElement | undefined | null =
    document.getElementById("i18nMenu")?.parentElement;

  private intersectionObserverHandler: IntersectionObserverHandler | null =
    null;

  private boundHandleKeyDown = (e: KeyboardEvent) =>
    this.handleKeyDown.bind(this)(e);

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
        display: flex;
        justify-content: center;
        align-items: center;
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
      }
      .tilted {
        transition: 0.2s;
        transition-timing-function: ease-in-out;
        transform: rotate(45deg);
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
      .color-unset {
        color: unset;
      }
    `,
  ];

  private toggleModal() {
    this.isOpen = !this.isOpen;
    document.body.style.overflow = this.isOpen ? "hidden" : "auto";

    if (!this.isOpen) {
      this.alert = {
        active: false,
        message: undefined,
      };
    }
  }

  private getEndpointUrl(endpoint: string, locale: string): string {
    const _endpoint = new URL(endpoint, window.location.origin);
    if (locale !== "en") {
      _endpoint.searchParams.append("lang", locale);
    }
    return _endpoint.toString();
  }

  private async create(e: Event) {
    e.preventDefault();
    const { endpoint, method } = this.createOpts;
    const response = await fetch(this.getEndpointUrl(endpoint, locale), {
      method,
      body: JSON.stringify(
        this.fields.reduce(
          (acc, field) => ({ ...acc, [field.name]: field.value }),
          {}
        )
      ),
    });

    if (response.ok) {
      this.toggleModal();

      const event = new CustomEvent("created", { bubbles: true });
      this.dispatchEvent(event);
    }

    if (!response.ok) {
      const result = await response.json();

      if (result.error) {
        this.alert = {
          active: true,
          message: Array.isArray(result.error)
            ? html`<span>Sorry!</span>
                <ol>
                  ${map(
                    result.error,
                    (message: string) => html`<li>${message}</li>`
                  )}
                </ol>`
            : html`<span>Sorry! ${result.error}</span>`,
        };
        return;
      }

      if (result.errors) {
        this.alert = {
          active: true,
          message: html`<span>Sorry!</span>
            <ol>
              ${map(
                result.errors,
                (error: KohaAPIError) =>
                  html`<li>
                    ${error.message}
                    ${litFontawesome(faArrowRight, {
                      className: "color-unset",
                    })}
                    ${error.path}
                  </li>`
              )}
            </ol>`,
        };
        return;
      }
    }
  }

  private dismissAlert() {
    this.alert = {
      active: false,
      message: undefined,
    };
  }

  private handleKeyDown(e: KeyboardEvent) {
    const isEscapeKey = e.key.toLowerCase() === "escape";
    const isCmdOrCtrlPressed = e.metaKey || e.ctrlKey;
    const isShiftPressed = e.shiftKey;

    if (isEscapeKey && this.isOpen) {
      e.preventDefault();
      this.toggleModal();
    }

    // Check for the suggested shortcut: Command/Ctrl + Shift + M
    if (isCmdOrCtrlPressed && isShiftPressed && e.key.toLowerCase() === "m") {
      e.preventDefault();
      this.toggleModal();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.boundHandleKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.boundHandleKeyDown);
  }

  override firstUpdated() {
    if (this.footer && this.btnModalWrapper) {
      this.intersectionObserverHandler = new IntersectionObserverHandler({
        intersecting: {
          ref: this.btnModalWrapper,
          do: () => {
            const bottom = parseFloat(
              getComputedStyle(this.btnModalWrapper).bottom
            );
            this.btnModalWrapper.style.bottom = `${
              bottom + (this.footer ? this.footer.offsetHeight : 0)
            }px`;
          },
        },
        intersected: {
          ref: this.footer,
        },
      });

      this.intersectionObserverHandler.init();
    }

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

  protected override updated(
    _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
  ): void {
    if (_changedProperties.has("isOpen")) {
      if (this.isOpen) {
        this.closeBtn.focus();
      }
    }
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
        aria-hidden=${!this.isOpen}
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
                aria-label=${attr__("Close")}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form @submit=${this.create}>
              <div class="modal-body">
                <div
                  role="alert"
                  ?hidden=${!this.alert.active}
                  class="alert ${classMap({
                    "alert-danger": this.alert.active,
                  })} alert-dismissible fade show"
                >
                  ${this.alert.message}
                  <button
                    @click=${this.dismissAlert}
                    type="button"
                    class="close"
                    data-dismiss="alert"
                    aria-label=${attr__("Close")}
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
    this.fields = this.fields.map((field) =>
      field.name === name ? { ...field, value } : field
    );
  }

  private getFieldMarkup(field: ModalField) {
    const { type, desc } = field;
    if (!type || !desc) return nothing;

    const { value } = field;
    const fieldTypes: Record<string, TemplateResult> = {
      select: html`<lms-select
        @change=${this.mediateChange}
        .field=${field}
      ></lms-select>`,
      checkbox: html`<lms-checkbox-input
        .field=${field}
        .value=${value as boolean}
      ></lms-checkbox-input>`,
      info: html`<p>${desc}</p>`,
      matrix: html`<lms-matrix
        .field=${field}
        .value=${value as MatrixGroup[]}
      ></lms-matrix>`,
      default: html`<lms-primitives-input
        .field=${field}
        .value=${value as string | number}
      ></lms-primitives-input>`,
    };

    return {}.hasOwnProperty.call(fieldTypes, type)
      ? fieldTypes[type]
      : fieldTypes["default"];
  }
}
