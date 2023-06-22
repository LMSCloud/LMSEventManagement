import { faSliders, faTimes } from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { __ } from "../lib/translate";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-data-navbar")
export default class LMSDataNavbar extends LitElement {
    @state() isDrawerOpen = false;

    @state() isXs = window.matchMedia("(max-width: 640px)").matches;

    @query("#navbar-drawer") navbarDrawer!: HTMLElement;

    @query("#navbar-backdrop") navbarBackdrop!: HTMLElement;

    private boundHandleResize = this.handleResize.bind(this);

    static override styles = [tailwindStyles];

    private handleClick() {
        this.isDrawerOpen = !this.isDrawerOpen;
    }

    private handleBackdropClick() {
        this.isDrawerOpen = false;
    }

    private handleResize() {
        this.isXs = window.matchMedia("(max-width: 640px)").matches;
    }

    override connectedCallback() {
        super.connectedCallback();
        window.addEventListener("resize", this.boundHandleResize);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("resize", this.boundHandleResize);
    }

    private setStateDrawer(
        transform: string,
        opacity: string,
        visibility: string
    ) {
        this.navbarDrawer.style.transform = transform;
        this.navbarBackdrop.style.opacity = opacity;
        this.navbarBackdrop.style.visibility = visibility;
    }

    protected override updated(
        _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
    ): void {
        if (_changedProperties.has("isDrawerOpen") && this.isXs) {
            if (this.isDrawerOpen) {
                this.setStateDrawer("translateY(0)", "0.3", "visible");
            } else {
                this.setStateDrawer("translateY(100%)", "0", "hidden");
            }
        }

        if (_changedProperties.has("isXs")) {
            if (this.isXs) {
                this.isDrawerOpen = false;
                this.setStateDrawer("translateY(100%)", "0", "hidden");
            } else {
                this.setStateDrawer("", "", "");
            }
        }
    }

    override render() {
        return html`
            <nav
                class="navbar mb-4 max-w-min rounded-xl bg-base-100 sm:hidden sm:w-full"
            >
                <button class="btn-ghost btn" @click=${this.handleClick}>
                    ${litFontawesome(faSliders, {
                        className: "w-4 h-4 inline-block",
                    })}
                </button>
            </nav>
            <div
                id="navbar-backdrop"
                class="invisible fixed left-0 top-0 z-30 h-screen w-screen bg-black opacity-0 transition-all duration-200 sm:hidden"
                @click=${this.handleBackdropClick}
            ></div>
            <nav
                id="navbar-drawer"
                class="navbar fixed bottom-0 left-0 z-[1050] mb-4 w-full 
                min-w-min flex-col gap-4 rounded-t-xl bg-base-100 p-8
                transition-all duration-200 sm:min-h-16 sm:static
                sm:flex sm:flex-row sm:rounded-xl sm:p-4"
            >
                <div class="p-4 sm:hidden">
                    <h2 class="text-lg font-bold">${__("Table Controls")}</h2>
                </div>
                <button
                    class="btn-ghost btn absolute right-0 top-0 m-2 sm:hidden"
                    @click=${this.handleClick}
                >
                    ${litFontawesome(faTimes, {
                        className: "w-4 h-4 inline-block",
                    })}
                </button>
                <div
                    class="w-full justify-start justify-center sm:navbar-start sm:w-1/2"
                >
                    <slot name="navbar-start"></slot>
                </div>
                <div class="w-full justify-center sm:navbar-center sm:w-auto">
                    <slot name="navbar-center"></slot>
                </div>
                <div
                    class="w-full justify-end justify-center sm:navbar-end sm:w-1/2"
                >
                    <slot name="navbar-end"></slot>
                </div>
            </nav>
        `;
    }
}
