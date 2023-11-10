import {
    faArrowRight,
    faClose,
    faPlus,
    faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { DirectiveResult } from "lit/directive";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { repeat } from "lit/directives/repeat.js";
import { InputsSnapshot } from "../lib/InputsSnapshot";
import { IntersectionObserverHandler } from "../lib/IntersectionObserverHandler";
import { InputConverter } from "../lib/converters/InputConverter/InputConverter";
import { TranslateDirective, __, locale } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import {
    CreateOpts,
    KohaAPIError,
    ModalField,
    TaggedData,
} from "../types/common";

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

    @property({ type: Array }) inputs: Array<[ModalField, TemplateResult]> = [];

    @state() protected isOpen = false;

    @state() protected alert: Alert = { active: false, message: undefined };

    @state() protected modalTitle:
        | string
        | DirectiveResult<typeof TranslateDirective> = "";

    @query(".btn-modal") buttonModal!: HTMLElement;

    @query(".close") closeButton!: HTMLElement;

    @query("#lms-modal") modal!: HTMLDialogElement;

    protected inputConverter = new InputConverter();

    /** TODO: Maybe we can find a cleaner way to do the intersection observations than in the base modal component */
    private footer: HTMLElement | undefined | null =
        document.getElementById("i18nMenu")?.parentElement;

    private intersectionObserverHandler: IntersectionObserverHandler | null =
        null;

    private boundHandleKeyDown = (e: KeyboardEvent) =>
        this.handleKeyDown.bind(this)(e);

    private snapshot?: InputsSnapshot;

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
            this.snapshot?.revert();

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

    protected composeTaggedInputs(
        field: ModalField,
        taggedData?: TaggedData[]
    ) {
        return Array.from(
            this.getColumnData({ name: field.name, value: field }, taggedData)
        ).map((template) => [field, template] as [ModalField, TemplateResult]);
    }

    override connectedCallback() {
        super.connectedCallback();
        document.addEventListener("keydown", this.boundHandleKeyDown);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("keydown", this.boundHandleKeyDown);
        this.intersectionObserverHandler?.destroy();
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

        if (this.modal) {
            this.snapshot = new InputsSnapshot(
                this.modal.querySelectorAll("input, select, textarea")
            );
        }
    }

    protected *getColumnData(
        query: { name: string; value: ModalField },
        data?: TaggedData[]
    ) {
        const { value } = query;

        yield this.inputConverter.getInputTemplate({
            name: `modal_${value.type}`,
            value,
            data,
        });
    }

    override render() {
        return html`
            <button
                class="btn-modal ${classMap({
                    "rotate-45": this.isOpen,
                })} btn btn-circle fixed bottom-4 right-4 h-20 w-20 rounded-full 
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
                    @change=${this.mediateChange}
                    method="dialog"
                    class="modal-box bg-base-100"
                >
                    <button
                        for="lms-modal"
                        class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
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
                            ${litFontawesome(faXmarkCircle, {
                                className: "w-4 h-4 inline-block",
                            })}
                            <span>${this.alert.message}</span>
                            <button
                                for="lms-modal"
                                class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
                                @click=${this.dismissAlert}
                            >
                                &times;
                            </button>
                        </div>
                        <!-- Here we render the inputs -->
                        ${repeat(
                            this.inputs,
                            ([field]) => field.value,
                            ([, templateResult]) => templateResult
                        )}
                    </div>
                    <div class="modal-action">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click=${this.toggleModal}
                        >
                            ${litFontawesome(faClose, {
                                className: "w-4 h-4 inline-block",
                            })}
                            <span>${__("Close")}</span>
                        </button>
                        <button type="submit" class="btn btn-primary">
                            ${litFontawesome(faPlus, {
                                className: "w-4 h-4 inline-block",
                            })}
                            <span>${__("Create")}</span>
                        </button>
                    </div>
                </form>
            </dialog>
        `;
    }

    protected mediateChange(e: Event | CustomEvent) {
        let source: HTMLInputElement | { name: string; value: string };
        if (e instanceof CustomEvent) {
            const { detail } = e;
            source = detail;
        } else {
            const target = e.target as HTMLInputElement;
            source = target;
        }

        const { name, value } = source;

        // Create a copy of fields, modify it, and then replace the original.
        const newFields = this.fields.map((field) =>
            field.name === name ? { ...field, value } : field
        );

        this.fields = [...newFields];

        // Explicitly request an update since we're changing a sub-property.
        this.requestUpdate("fields");
    }
}
