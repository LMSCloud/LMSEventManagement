import { faSliders, faTimes } from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
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

    protected override updated(
        _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
    ): void {
        if (_changedProperties.has("isDrawerOpen") && this.isXs) {
            if (this.isDrawerOpen) {
                this.navbarDrawer.style.transform = "translateX(0)";
                this.navbarBackdrop.style.opacity = "0.3";
                this.navbarBackdrop.style.visibility = "visible";
            } else {
                this.navbarDrawer.style.transform = "translateX(-100%)";
                this.navbarBackdrop.style.opacity = "0";
                this.navbarBackdrop.style.visibility = "hidden";
            }
        }

        if (_changedProperties.has("isXs")) {
            if (!this.isXs) {
                this.navbarDrawer.style.transform = "translateX(0)";
                this.navbarBackdrop.style.opacity = "0";
                this.navbarBackdrop.style.visibility = "hidden";
            } else if (this.isXs && this.isDrawerOpen) {
                this.isDrawerOpen = false;
            }
        }
    }

    override render() {
        return html`
            <nav class="navbar mb-4 rounded-xl bg-base-100 sm:hidden">
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
                class="${classMap({
                    "-translate-x-full": this.isXs,
                    "translate-x-0": !this.isXs,
                })} navbar fixed left-0 top-0 z-40 mb-4 
                min-h-full w-4/5 flex-col gap-4 rounded-none
                bg-base-100 transition-all duration-200 sm:min-h-16 sm:static sm:z-auto
                sm:flex sm:w-full sm:flex-row sm:rounded-xl"
            >
                <div class="p-4 sm:hidden">
                    <h2 class="text-lg font-bold">${__("Menu")}</h2>
                </div>
                <button
                    class="btn-ghost btn absolute right-0 top-0 m-2 sm:hidden"
                    @click=${this.handleClick}
                >
                    ${litFontawesome(faTimes, {
                        className: "w-4 h-4 inline-block",
                    })}
                </button>
                <div class="w-full sm:navbar-start sm:w-1/2">
                    <slot name="navbar-start"></slot>
                </div>
                <div class="w-full sm:navbar-center sm:w-auto">
                    <slot name="navbar-center"></slot>
                </div>
                <div class="w-full sm:navbar-end sm:w-1/2">
                    <slot name="navbar-end"></slot>
                </div>
            </nav>
        `;
    }
}
