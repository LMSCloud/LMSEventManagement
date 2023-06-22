import { html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-dropdown")
export default class LMSDropdown extends LitElement {
    @property({ type: Boolean }) isHidden = false;

    @property({ type: Boolean }) shouldFold = false;

    @property({ type: String }) label = "";

    @query("details") details!: HTMLDetailsElement;

    public uuid = crypto.getRandomValues(new Uint32Array(2)).join("-");

    static override styles = [tailwindStyles];

    override connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener("click", this.handleClickOutside);
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        document.removeEventListener("click", this.handleClickOutside);
    }

    public close() {
        if (this.details) {
            this.details.open = false;
        }
    }

    private handleClickOutside = (event: MouseEvent) => {
        // Get the path from the event target to the document root
        const path = event.composedPath();

        // Check if the dropdown is in the path (i.e., the click happened inside the dropdown)
        if (path.includes(this)) {
            return;
        }

        // If the click happened outside the dropdown, close it
        this.close();
    };

    private dispatchToggleEvent() {
        if (this.details && this.uuid) {
            this.dispatchEvent(
                new CustomEvent("dropdown-toggle", {
                    bubbles: true,
                    composed: true,
                    detail: {
                        id: this.uuid,
                        open: this.details.open,
                    },
                })
            );
        }
    }

    private handleBlur(event: FocusEvent) {
        // Check if the new target of focus is inside the dropdown
        if (!this.contains(event.relatedTarget as Node)) {
            this.close();
        }
    }

    override render() {
        return html`
            <details
                class="dropdown"
                id=${this.uuid}
                @toggle=${this.dispatchToggleEvent}
                @blur=${this.handleBlur}
                tabindex="0"
            >
                <summary class="btn">${this.label}</summary>
                <ul
                    class="dropdown-content menu rounded-box z-40 w-max bg-base-100 p-2 shadow"
                >
                    <slot></slot>
                </ul>
            </details>
        `;
    }
}
