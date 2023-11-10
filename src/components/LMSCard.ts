import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";
import { tailwindStyles } from "../tailwind.lit";
import { Image } from "../types/common";

type Link = {
    href: string;
    text: string;
};

@customElement("lms-card")
export default class LMSCard extends LitElement {
    @property({ type: String }) caption?: string;

    @property({ type: String }) text?: string;

    @property({ type: Object }) image?: Image;

    @property({ type: Array }) links?: Array<Link>;

    @property({ type: Array }) listItems?: Array<any>;

    static override styles = [tailwindStyles];

    override render() {
        return html`
            <div
                class="card shadow-md hover:relative hover:bottom-2 hover:cursor-pointer hover:shadow-lg"
            >
                <figure>
                    <img
                        src=${ifDefined(this.image?.src)}
                        alt=${ifDefined(this.image?.alt)}
                        class="${classMap({
                            hidden: !this.image?.src,
                        })} w-full"
                    />
                </figure>
                <div class="card-body">
                    <h5
                        class="${classMap({
                            hidden: !this.caption,
                        })} card-title"
                    >
                        ${this.caption}
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
