import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-icon-span")
export default class LMSIconSpan extends LitElement {
    private sizeMap = {
        "text-xs": "h-2 w-2",
        "text-sm": "h-2 w-2",
        "text-base": "h-3 w-3",
        "text-lg": "h-3 w-3",
        "text-xl": "h-4 w-4",
        "text-2xl": "h-4 w-4",
        "text-3xl": "h-5 w-5",
        "text-4xl": "h-6 w-6",
        "text-5xl": "h-6 w-6",
        "text-6xl": "h-8 w-8",
        "text-7xl": "h-8 w-8",
        "text-8xl": "h-10 w-10",
        "text-9xl": "h-12 w-12",
    };

    @property({ type: String, attribute: "icon" }) icon:
        | IconDefinition
        | undefined;

    @property({ type: String, attribute: "text-size" })
    textSize: keyof typeof LMSIconSpan.prototype.sizeMap = "text-base";

    @property({ type: Boolean, attribute: "icon-on-xs" }) iconOnXs = false;

    static override styles = [
        tailwindStyles,
        css`
            :host {
                display: inline-flex;
                align-items: center;
                white-space: nowrap;
            }

            .icon {
                margin-right: 8px;
            }
        `,
    ];

    override render() {
        if (!this.icon) return nothing;

        const className = this.sizeMap[this.textSize];
        return html`
            <span
                class="${classMap({
                    "sm:hidden": this.iconOnXs,
                })} icon"
                >${litFontawesome(this.icon, {
                    className,
                })}</span
            >
            <slot
                class=${classMap({
                    [this.textSize]: true,
                    hidden: this.iconOnXs,
                    "sm:inline": this.iconOnXs,
                })}
            ></slot>
        `;
    }
}
