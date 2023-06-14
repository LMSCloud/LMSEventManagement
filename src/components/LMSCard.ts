import { html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { tailwindStyles } from "../tailwind.lit";
import { Image } from "../types/common";

type Link = {
    href: string;
    text: string;
};

@customElement("lms-card")
export default class LMSCard extends LitElement {
    @property({ type: String }) override title = "";

    @property({ type: String }) text = "";

    @property({ type: Object }) image = {} as Image;

    @property({ type: Array }) links = [] as Link[];

    @property({ type: Array }) listItems = [];

    static override styles = [tailwindStyles];

    override render() {
        return html`
            <div
                class="card shadow-md hover:relative hover:bottom-2 hover:cursor-pointer hover:shadow-lg"
            >
                <figure>
                    <img
                        src=${this.image.src}
                        alt=${this.image.alt}
                        class="${classMap({
                            hidden: !this.image.src,
                        })} w-full"
                    />
                </figure>
                <div class="card-body">
                    <h5 class="card-title" ?hidden=${!this.title}>
                        ${this.title}
                    </h5>
                    <p ?hidden=${!this.text}>${this.text}</p>
                    <ul ?hidden=${!this.listItems.length}>
                        ${this.listItems.map(
                            (listItem) => html`<li>${listItem}</li>`
                        )}
                    </ul>
                    <div
                        class="card-actions justify-end"
                        ?hidden=${!this.links.length}
                    >
                        ${this.links.length
                            ? this.links.map(
                                  (link) =>
                                      html`<a href=${link.href}
                                          >${link.text}</a
                                      >`
                              )
                            : nothing}
                    </div>
                </div>
            </div>
        `;
    }
}
