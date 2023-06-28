import {
    faArrowRight,
    faClose,
    faPlus,
    faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, nothing, TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { DirectiveResult } from "lit/directive";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { IntersectionObserverHandler } from "../lib/IntersectionObserverHandler";
import { locale, TranslateDirective, __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import {
    CreateOpts,
    KohaAPIError,
    MatrixGroup,
    ModalField,
} from "../types/common";
import LMSCheckboxInput from "./inputs/modal/LMSCheckboxInput";
import LMSMatrix from "./inputs/modal/LMSMatrix";
import LMSPrimitivesInput from "./inputs/modal/LMSPrimitivesInput";
import LMSSelect from "./inputs/modal/LMSSelect";
import LMSIconSpan from "./LMSIconSpan";

declare global {
    interface HTMLElementTagNameMap {
        "lms-select": LMSSelect;
        "lms-checkbox-input": LMSCheckboxInput;
        "lms-primitives-input": LMSPrimitivesInput;
        "lms-matrix": LMSMatrix;
        "lms-icon-span": LMSIconSpan;
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

    @query(".btn-modal") buttonModal!: HTMLElement;

    @query(".close") closeButton!: HTMLElement;

    @query("#lms-modal") modal!: HTMLDialogElement;

    /** TODO: Maybe we can find a cleaner way to do the intersection observations than in the base modal component */
    private footer: HTMLElement | undefined | null =
        document.getElementById("i18nMenu")?.parentElement;

    private intersectionObserverHandler: IntersectionObserverHandler | null =
        null;

    private boundHandleKeyDown = (e: KeyboardEvent) =>
        this.handleKeyDown.bind(this)(e);

    static override styles = [tailwindStyles, skeletonStyles];

    private toggleModal(e?: Event) {
        e?.preventDefault();
        if (!this.isOpen) {
            this.modal.showModal();
        } else {
            this.modal.close();
        }

        this.isOpen = !this.isOpen;

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
                                      (message: string) =>
                                          html`<li>${message}</li>`
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
                                            className: "w-4 h-4 inline-block",
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

    private dismissAlert(e?: Event) {
        e?.preventDefault();
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
        if (
            isCmdOrCtrlPressed &&
            isShiftPressed &&
            e.key.toLowerCase() === "m"
        ) {
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
        if (this.footer && this.buttonModal) {
            this.intersectionObserverHandler = new IntersectionObserverHandler({
                intersecting: {
                    ref: this.buttonModal,
                    do: () => {
                        const bottom = parseFloat(
                            getComputedStyle(this.buttonModal).bottom
                        );
                        this.buttonModal.style.bottom = `${
                            bottom +
                            (this.footer ? this.footer.offsetHeight : 0)
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

    override render() {
        return html`
            <button
                class="btn-modal ${classMap({
                    "rotate-45": this.isOpen,
                })} btn-circle btn fixed bottom-4 right-4 h-20 w-20 rounded-full 
                border-none bg-primary text-4xl shadow hover:shadow-md"
                @click=${this.toggleModal}
            >
                <span class="flex items-center justify-center">
                    ${litFontawesome(faPlus, {
                        className: "w-8 h-8 inline-block",
                    })}
                </span>
            </button>
            <dialog id="lms-modal" class="modal modal-bottom sm:modal-middle">
                <form
                    @submit=${this.create}
                    method="dialog"
                    class="modal-box bg-base-100"
                >
                    <button
                        for="lms-modal"
                        class="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
                        @click=${this.toggleModal}
                    >
                        &times;
                    </button>
                    <h5 class="text-lg font-bold" id="lms-modal-title">
                        ${this.modalTitle ?? `${__("Add")}`}
                    </h5>
                    <div class="py-4">
                        <div
                            class="${classMap({
                                hidden: !this.alert.active,
                            })} alert alert-error"
                        >
                            <lms-icon-span
                                .icon=${faXmarkCircle}
                                .textSize="text-lg"
                            >
                                ${this.alert.message}
                            </lms-icon-span>
                            <button
                                for="lms-modal"
                                class="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
                                @click=${this.dismissAlert}
                            >
                                &times;
                            </button>
                        </div>
                        ${map(this.fields, (value) =>
                            this.getFieldMarkup(value)
                        )}
                    </div>
                    <div class="modal-action">
                        <button
                            type="button"
                            class="btn-secondary btn"
                            @click=${this.toggleModal}
                        >
                            <lms-icon-span
                                .icon=${faClose}
                                .textSize="text-base"
                            >
                                ${__("Close")}
                            </lms-icon-span>
                        </button>
                        <button type="submit" class="btn-primary btn">
                            <lms-icon-span
                                .icon=${faPlus}
                                .textSize="text-base"
                            >
                                ${__("Create")}
                            </lms-icon-span>
                        </button>
                    </div>
                </form>
            </dialog>
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
