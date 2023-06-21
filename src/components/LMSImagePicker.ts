import { css, html, LitElement } from "lit";
import {
    customElement,
    property,
    query,
    queryAssignedElements,
} from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { attr__, __ } from "../lib/translate";
import { utilityStyles } from "../styles/utilities";
import { tailwindStyles } from "../tailwind.lit";
import { UploadedImage } from "../types/common";

@customElement("lms-image-picker")
export default class LMSImagePicker extends LitElement {
    @property({ type: Array }) uploads: UploadedImage[] = [];

    @property({ type: Boolean, reflect: true }) disabled = false;

    @query("dialog") dialog!: HTMLDialogElement;

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

    private handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        const [formInput] = this.input;
        formInput.value = target.value;
    }

    private handleChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const [formInput] = this.input;

        if (target.id === "custom-image-url") {
            const customInput = target.nextElementSibling as HTMLInputElement;
            formInput.value = customInput?.value ?? "";
            return;
        }

        formInput.value = target.value;
    }

    private showModal() {
        this.dialog.showModal();
    }

    private closeModal() {
        this.dialog.close();
    }

    override render() {
        return html`
            <slot
                name="input"
                @click=${this.showModal}
                class="input-slot"
            ></slot>
            <dialog id="lms-modal" class="modal">
                <form method="dialog" class="modal-box max-w-max">
                    <ul>
                        <li class="w-full">
                            <div class="form-contol">
                                <label class="label cursor-pointer">
                                    <input
                                        id="custom-image-url"
                                        type="radio"
                                        name="lms-combo-box"
                                        class="radio mr-4 checked:bg-primary"
                                        value=""
                                        @change=${this.handleChange}
                                        ?disabled=${this.disabled}
                                    />
                                    <input
                                        value=""
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
                        <div class="grid w-fit grid-cols-3 gap-4">
                            ${map(this.uploads, ({ metadata }) => {
                                const { hashvalue } = metadata;
                                const imageUrl = `/api/v1/contrib/eventmanagement/public/image/${hashvalue}`;
                                const [formInput] = this.input;
                                return html`
                                    <li>
                                        <div class="form-contol">
                                            <label class="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="lms-combo-box"
                                                    ?checked=${formInput?.value ===
                                                    imageUrl}
                                                    value=${imageUrl}
                                                    class="radio mr-4 checked:bg-primary"
                                                    @change=${this.handleChange}
                                                    ?disabled=${this.disabled}
                                                />

                                                <figure class="mr-4">
                                                    <img
                                                        src=${imageUrl}
                                                        class="aspect-video w-full rounded-lg object-cover"
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
