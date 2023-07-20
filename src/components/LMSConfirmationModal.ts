import { html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { __ } from "../lib/translate";
import { tailwindStyles } from "../tailwind.lit";
import { TranslatedString } from "../types/common";

@customElement("lms-confirmation-modal")
export default class LMSConfirmationModal extends LitElement {
    @property({ type: String }) header: string | TranslatedString | undefined;

    @property({ type: String }) message: string | TranslatedString | undefined;

    @property({ type: Object }) ref: EventTarget | undefined | null;

    @property({ type: String }) obj: string | undefined | null;

    @query("#confirmation-modal") modal: HTMLDialogElement | undefined;

    static override styles = [tailwindStyles];

    private handleClick(e: Event) {
        const { name } = e.target as HTMLButtonElement;
        this.dispatchEvent(
            new CustomEvent(name, { bubbles: true, composed: true })
        );
    }

    public showModal() {
        this.modal?.showModal();
    }

    public reset() {
        this.header = undefined;
        this.message = undefined;
        this.ref = undefined;
    }

    override render() {
        return html` <dialog id="confirmation-modal" class="modal">
            <form method="dialog" class="modal-box">
                <h3 class="text-lg font-bold">${this.header}</h3>
                <p class="py-4">
                    ${this.message}
                    <span class="font-semibold">${this.obj}</span>
                </p>
                <div class="modal-action" @click=${this.handleClick}>
                    <button class="btn-secondary btn" name="abort">
                        ${__("Abort")}
                    </button>
                    <button class="btn-primary btn" name="confirm">
                        ${__("Confirm")}
                    </button>
                </div>
            </form>
        </dialog>`;
    }
}
