import { css, html, LitElement } from "lit";
import {
    customElement,
    property,
    query,
    queryAssignedElements,
} from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { attr__, __ } from "../../lib/translate";
import { utilityStyles } from "../../styles/utilities";
import { tailwindStyles } from "../../tailwind.lit";
import { UploadedImage } from "../../types/common";

@customElement("lms-image-picker")
export default class LMSImagePicker extends LitElement {
    @property({ type: Array }) uploads: UploadedImage[] = [];

    @property({ type: Boolean, reflect: true }) disabled = false;

    @query("dialog") dialog!: HTMLDialogElement;

    @query("#custom-image-radio") customImageRadio!: HTMLInputElement;

    @queryAssignedElements({ slot: "input", selector: "input" })
    input!: HTMLInputElement[];

    static override styles = [
        tailwindStyles,
        utilityStyles,
        css`
            :host {
                background: transparent;
            }

            .input-slot {
                height: 100%;
            }
        `,
    ];

    private handleFocus(e: Event) {
        const target = e.target as HTMLInputElement;
        const [formInput] = this.input;
        if (target.id === "custom-image-url-input") {
            this.customImageRadio.checked = true;
            formInput.value = target.value;
            this.requestUpdate();
        }
    }

    private handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        const [formInput] = this.input;
        formInput.value = target.value;
    }

    private handleChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const [formInput] = this.input;

        if (target.id === "custom-image-radio") {
            const customInput = target.nextElementSibling as HTMLInputElement;
            formInput.value = customInput?.value ?? "";
            this.requestUpdate();
            return;
        }

        formInput.value = target.value;
        this.requestUpdate();
    }

    private handleImageKeyDown(e: KeyboardEvent, imageUrl: string) {
        if (e.key === "Enter") {
            const [formInput] = this.input;
            formInput.value = imageUrl;
            this.requestUpdate();
            this.closeModal();
        }
    }

    private showModal() {
        this.dialog.showModal();
    }

    private closeModal() {
        this.dialog.close();
    }

    override render() {
        const [formInput] = this.input;
        const isCustomSelected = this.customImageRadio?.checked;
        return html`
            <slot
                name="input"
                @click=${this.showModal}
                class="input-slot"
                tabindex="0"
            ></slot>
            <dialog
                id="lms-modal"
                class="modal"
                role="dialog"
                aria-labelledby="dialog-title"
                tabindex="-1"
            >
                <form method="dialog" class="modal-box max-w-max">
                    <ul>
                        <li class="w-full">
                            <div class="form-contol">
                                <label
                                    class="${classMap({
                                        "border-primary": isCustomSelected,
                                        "border-transparent": !isCustomSelected,
                                    })} label relative block cursor-pointer rounded-md rounded-xl border-2"
                                >
                                    <input
                                        id="custom-image-radio"
                                        type="radio"
                                        name="lms-combo-box"
                                        class="sr-only"
                                        value=""
                                        @change=${this.handleChange}
                                        ?disabled=${this.disabled}
                                    />
                                    <input
                                        id="custom-image-url-input"
                                        value=""
                                        @focus=${this.handleFocus}
                                        @input=${this.handleInput}
                                        type="text"
                                        class="input-bordered input w-full"
                                        placeholder=${attr__(
                                            "Custom Image URL, e.g. https://example.com/image.png"
                                        )}
                                    />
                                </label>
                            </div>
                        </li>
                        <div
                            class="grid w-fit grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
                        >
                            ${map(this.uploads, ({ metadata }) => {
                                const { hashvalue } = metadata;
                                const imageUrl = `/api/v1/contrib/eventmanagement/public/image/${hashvalue}`;
                                const isSelected =
                                    formInput?.value === imageUrl;
                                return html`
                                    <li
                                        tabindex="0"
                                        @keydown=${(e: KeyboardEvent) =>
                                            this.handleImageKeyDown(
                                                e,
                                                imageUrl
                                            )}
                                    >
                                        <div class="form-contol">
                                            <label
                                                class="${classMap({
                                                    "border-primary":
                                                        isSelected,
                                                    "border-transparent":
                                                        !isSelected,
                                                })} label relative block cursor-pointer rounded-md rounded-xl border-2"
                                            >
                                                <input
                                                    type="radio"
                                                    name="lms-combo-box"
                                                    ?checked=${isSelected}
                                                    value=${imageUrl}
                                                    class="sr-only"
                                                    @change=${this.handleChange}
                                                    ?disabled=${this.disabled}
                                                />

                                                <figure>
                                                    <img
                                                        src=${imageUrl}
                                                        class="aspect-square h-auto rounded-lg object-cover"
                                                    />
                                                    <figcaption class="text-sm">
                                                        ${hashvalue}
                                                    </figcaption>
                                                </figure>
                                            </label>
                                        </div>
                                    </li>
                                `;
                            })}
                        </div>
                    </ul>
                    <div class="modal-action">
                        <button class="btn" @click=${this.closeModal}>
                            ${__("Close")}
                        </button>
                    </div>
                </form>
            </dialog>
        `;
    }
}
