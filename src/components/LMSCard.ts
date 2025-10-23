import {
    faCheckCircle,
    faClock,
    faTimesCircle,
    faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";
import { __, attr__ } from "../lib/translate";
import { tailwindStyles } from "../tailwind.lit";
import { Image } from "../types/common";

type Link = {
    href: string;
    text: string;
};

type EventStatus = "pending" | "confirmed" | "canceled" | "sold_out";

@customElement("lms-card")
export default class LMSCard extends LitElement {
    @property({ type: String }) caption?: string;

    @property({ type: String }) text?: string;

    @property({ type: Object }) image?: Image;

    @property({ type: Array }) links?: Array<Link>;

    @property({ type: Array }) listItems?: Array<any>;

    @property({ type: String }) status?: EventStatus;

    static override styles = [tailwindStyles];

    private getStatusConfig() {
        switch (this.status) {
            case "confirmed":
                return {
                    icon: faCheckCircle,
                    class: "badge-success",
                    label: __("Confirmed"),
                    ariaLabel: attr__("Confirmed"),
                };
            case "pending":
                return {
                    icon: faClock,
                    class: "badge-warning",
                    label: __("Pending"),
                    ariaLabel: attr__("Pending"),
                };
            case "canceled":
                return {
                    icon: faTimesCircle,
                    class: "badge-error",
                    label: __("Canceled"),
                    ariaLabel: attr__("Canceled"),
                };
            case "sold_out":
                return {
                    icon: faUserSlash,
                    class: "badge-neutral",
                    label: __("Sold Out"),
                    ariaLabel: attr__("Sold Out"),
                };
            default:
                return null;
        }
    }

    private renderStatusBadge(inline: boolean = false) {
        const config = this.getStatusConfig();
        if (!config) {
            return nothing;
        }

        return html`
            <div
                class="${classMap({
                    badge: true,
                    "badge-success": config.class === "badge-success",
                    "badge-warning": config.class === "badge-warning",
                    "badge-error": config.class === "badge-error",
                    "badge-neutral": config.class === "badge-neutral",
                    absolute: !inline,
                    "right-2": !inline,
                    "top-2": !inline,
                    "z-[1]": !inline,
                    "gap-1": true,
                    "shadow-lg": !inline,
                })}"
                role="status"
                aria-label="${config.ariaLabel}"
            >
                <span aria-hidden="true">
                    ${litFontawesome(config.icon, {
                        className: "w-3 h-3",
                    })}
                </span>
                <span class="text-xs font-semibold">${config.label}</span>
            </div>
        `;
    }

    override render() {
        const hasImage = !!this.image?.src;
        return html`
            <div
                class="card relative shadow-md hover:bottom-2 hover:cursor-pointer hover:shadow-lg"
            >
                <figure>
                    <img
                        src=${ifDefined(this.image?.src)}
                        alt=${ifDefined(this.image?.alt)}
                        class="${classMap({
                            hidden: !hasImage,
                        })} w-full"
                    />
                    ${hasImage ? this.renderStatusBadge() : nothing}
                </figure>
                <div class="card-body">
                    <h5
                        class="${classMap({
                            hidden: !this.caption,
                        })} card-title flex items-start justify-between gap-2"
                    >
                        <span class="flex-1 min-w-0">${this.caption}</span>
                        ${!hasImage ? html`<span class="flex-shrink-0">${this.renderStatusBadge(true)}</span>` : nothing}
                    </h5>
                    <p
                        class=${classMap({
                            hidden: !this.text,
                        })}
                    >
                        ${this.text}
                    </p>
                    <ul
                        class=${classMap({
                            hidden: !this.listItems?.length,
                        })}
                    >
                        ${map(
                            this.listItems,
                            (listItem) => html`<li>${listItem}</li>`
                        )}
                    </ul>
                    <div
                        class="${classMap({
                            hidden: !this.links?.length,
                        })} card-actions justify-end"
                    >
                        ${map(
                            this.links,
                            (link) =>
                                html`<a href=${link.href}>${link.text}</a>`
                        )}
                    </div>
                </div>
            </div>
        `;
    }
}
