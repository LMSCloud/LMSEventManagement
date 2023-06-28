import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { LiteElement, reactive } from '@lmscloud/lite';

export default class LMSIconSpan extends LiteElement {
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

    @reactive icon: IconDefinition | undefined;
    
    @reactive textSize: keyof typeof LMSIconSpan.prototype.sizeMap = "text-base";
    
    @reactive iconOnXs = false;

    render() {
        if (!this.icon) return html``;

        const className = this.sizeMap[this.textSize];
        return html`
        <div class="inline-flex items-center whitespace-nowrap">
            <span
                class="${classMap({
                    "sm:hidden": this.iconOnXs,
                })} mr-2"
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
            </div>
        `;
    }
}