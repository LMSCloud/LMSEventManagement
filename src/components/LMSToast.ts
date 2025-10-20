import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { IntersectionObserverHandler } from "../lib/IntersectionObserverHandler";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-toast")
export default class LMSToast extends LitElement {
    @property({ type: String }) heading: string | TemplateResult = "";

    @property({ type: String }) message: string | TemplateResult = "";

    @property({ type: String }) type: "success" | "error" | "warning" | "info" = "error";

    @state() elapsedTime = 0;

    @query(".toast") toast!: HTMLElement;

    private footer: HTMLElement | undefined | null =
        document.getElementById("i18nMenu")?.parentElement;

    private intersectionObserverHandler: IntersectionObserverHandler | null =
        null;

    static override styles = [tailwindStyles, skeletonStyles];

    private handleDismiss() {
        this.remove();
    }

    override render() {
        return html`
            <div class="toast toast-center z-50">
                <div class="${classMap({
                    alert: true,
                    "alert-success": this.type === "success",
                    "alert-error": this.type === "error",
                    "alert-warning": this.type === "warning",
                    "alert-info": this.type === "info",
                    "gap-2": true,
                })}">
                    <div id="heading">
                        <strong class="mr-auto">${this.heading}</strong>
                    </div>

                    <div
                        class="inline-block h-full min-h-[1em] w-0.5 
                        self-stretch bg-current opacity-100 dark:opacity-50"
                    ></div>

                    <div id="message">
                        <span>${this.message}</span>
                    </div>

                    <div
                        class="inline-block h-full min-h-[1em] w-0.5 
                        self-stretch  bg-current opacity-100 dark:opacity-50"
                    ></div>

                    <div id="controls" class="flex items-center justify-center">
                        <span>${this.elapsedTime} ${__("sec ago")}</span>
                        <button
                            class="btn btn-ghost"
                            @click=${this.handleDismiss}
                        >
                            <span aria-hidden="true"
                                >${litFontawesome(faTimes, {
                                    className: "w-4 h-4 inline-block",
                                })}</span
                            >
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    override connectedCallback() {
        super.connectedCallback();

        setInterval(() => {
            this.elapsedTime++;
        }, 1000);

        this.renderRoot.addEventListener("click", (e) => {
            if (!e.target) {
                return;
            }

            const element = e.target as HTMLElement;
            if (element.tagName === "SPAN") {
                this.remove();
            }
        });

        setTimeout(() => {
            this.remove();
        }, 10000);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.renderRoot.removeEventListener("click", (e) => {
            if (!e.target) {
                return;
            }

            const element = e.target as HTMLElement;
            if (element.tagName === "SPAN") {
                this.remove();
            }
        });

        this.intersectionObserverHandler?.destroy();
    }

    override firstUpdated() {
        if (this.footer && this.toast) {
            const toast = this.toast;
            this.intersectionObserverHandler = new IntersectionObserverHandler({
                intersecting: {
                    ref: this.toast,
                    do: () => {
                        const bottom = parseFloat(
                            getComputedStyle(toast).bottom
                        );
                        toast.style.bottom = `${
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
    }
}
