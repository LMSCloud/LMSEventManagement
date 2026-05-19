import {
    faArrowLeft,
    faCheckCircle,
    faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { match } from "ts-pattern";
import { buildOpacUrl } from "../lib/opacUrl";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-event-booking-confirm-page")
export default class LMSEventBookingConfirmPage extends LitElement {
    @property({ type: String }) token?: string;

    @state() private state: "confirming" | "confirmed" | "invalid" | "error" =
        "confirming";

    @state() private errorMessage: string | null = null;

    static override styles = [tailwindStyles, skeletonStyles];

    override connectedCallback(): void {
        super.connectedCallback();
        this.confirm();
    }

    private async confirm(): Promise<void> {
        if (!this.token) {
            this.state = "invalid";
            return;
        }
        this.state = "confirming";
        this.errorMessage = null;
        try {
            const resp = await requestHandler.post({
                endpoint: "bookingConfirmPublic",
                path: [this.token],
                requestInit: { method: "post" },
            });
            if (resp.status === 404) {
                this.state = "invalid";
                return;
            }
            if (!resp.ok) {
                const data = (await resp.json().catch(() => ({}))) as {
                    error?: string;
                };
                this.errorMessage = data.error ?? `error ${resp.status}`;
                this.state = "error";
                return;
            }
            this.state = "confirmed";
        } catch (err) {
            console.error(err);
            this.errorMessage = `${err}`;
            this.state = "error";
        }
    }

    private renderConfirming() {
        return html`
            <div class="space-y-4 text-center">
                <div
                    class="skeleton skeleton-text mx-auto h-8 w-2/3 rounded"
                ></div>
                <div
                    class="skeleton skeleton-text mx-auto h-4 w-1/2 rounded"
                ></div>
            </div>
        `;
    }

    private renderConfirmed() {
        return html`
            <div class="text-center">
                <div
                    class="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-success"
                >
                    ${litFontawesome(faCheckCircle, {
                        className: "w-7 h-7",
                    })}
                </div>
                <h1 class="text-2xl font-bold">${__("Booking confirmed")}</h1>
                <p class="mt-2 text-base-content/70">
                    ${__("Your seats are reserved. See you at the event!")}
                </p>
                <a href=${buildOpacUrl({})} class="btn btn-primary mt-6">
                    ${litFontawesome(faArrowLeft, {
                        className: "w-3 h-3 mr-1",
                    })}
                    ${__("Back to events")}
                </a>
            </div>
        `;
    }

    private renderInvalid() {
        return html`
            <div class="text-center">
                <h1 class="text-2xl font-bold">
                    ${__("This link is no longer valid")}
                </h1>
                <p class="mt-2 text-base-content/70">
                    ${__(
                        "The booking may already be confirmed, or the link has expired.",
                    )}
                </p>
                <a href=${buildOpacUrl({})} class="btn btn-primary mt-6">
                    ${__("Back to events")}
                </a>
            </div>
        `;
    }

    private renderError() {
        return html`
            <div class="text-center">
                <div
                    class="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-error/20 text-error"
                >
                    ${litFontawesome(faExclamationCircle, {
                        className: "w-7 h-7",
                    })}
                </div>
                <h1 class="text-2xl font-bold">
                    ${__("Could not confirm right now")}
                </h1>
                ${this.errorMessage
                    ? html`<p class="mt-2 text-base-content/70">
                          ${this.errorMessage}
                      </p>`
                    : nothing}
                <div class="mt-6 flex justify-center gap-3">
                    <button
                        class="btn btn-ghost"
                        @click=${() => this.confirm()}
                    >
                        ${__("Try again")}
                    </button>
                    <a href=${buildOpacUrl({})} class="btn btn-primary">
                        ${__("Back to events")}
                    </a>
                </div>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="mx-auto max-w-xl p-4">
                ${match(this.state)
                    .with("confirming", () => this.renderConfirming())
                    .with("confirmed", () => this.renderConfirmed())
                    .with("invalid", () => this.renderInvalid())
                    .with("error", () => this.renderError())
                    .exhaustive()}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "lms-event-booking-confirm-page": LMSEventBookingConfirmPage;
    }
}
