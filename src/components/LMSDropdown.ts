import { html, LitElement, SVGTemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ClassInfo, classMap } from "lit/directives/class-map.js";
import { tailwindStyles } from "../tailwind.lit";

type Positions = "end" | "top" | "bottom" | "left" | "right";

type PositionsTuple = [Positions?, Positions?];

@customElement("lms-dropdown")
export default class LMSDropdown extends LitElement {
    @property({ type: String }) label = "";

    @property({ type: Object }) icon: SVGTemplateResult | undefined;

    @property({ type: Array }) position: PositionsTuple = [];

    @query("details") details!: HTMLDetailsElement;

    @query("#label") labelElement!: HTMLSpanElement;

    @query("#icon") iconElement!: HTMLSpanElement;

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
            if (this.label && this.icon && !this.details.open) {
                this.labelElement.classList.add("hidden");
                this.iconElement.classList.remove("hidden");
            }
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

    private composePosition(): ClassInfo {
        if (!this.position.length) {
            return {};
        }

        return {
            "dropdown-end": this.position.includes("end"),
            "dropdown-top": this.position.includes("top"),
            "dropdown-bottom": this.position.includes("bottom"),
            "dropdown-left": this.position.includes("left"),
            "dropdown-right": this.position.includes("right"),
        };
    }

    private handleHover(e: MouseEvent) {
        if (this.details.open || !(this.label && this.icon)) {
            return;
        }

        if (e.type === "mouseenter") {
            this.labelElement.classList.remove("hidden");
            this.iconElement.classList.add("hidden");
            return;
        }
        if (e.type === "mouseleave") {
            this.labelElement.classList.add("hidden");
            this.iconElement.classList.remove("hidden");
        }
    }

    override render() {
        return html`
            <details
                class="${classMap(this.composePosition())} dropdown"
                id=${this.uuid}
                @toggle=${this.dispatchToggleEvent}
                @blur=${this.handleBlur}
                @mouseenter=${this.handleHover}
                @mouseleave=${this.handleHover}
                tabindex="0"
            >
                <summary class="btn">
                    <span id="icon" class="xl:hidden">${this.icon}</span>
                    <span
                        id="label"
                        class="${classMap({
                            hidden: this.label && Boolean(this.icon),
                        })} xl:block"
                        >${this.label}</span
                    >
                </summary>
                <ul
                    class="dropdown-content menu rounded-box z-40 w-max bg-base-100 p-2 shadow"
                >
                    <slot></slot>
                </ul>
            </details>
        `;
    }
}
