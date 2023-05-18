import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

type Image = {
  src: string;
  alt: string;
};

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

  static override styles = [
    bootstrapStyles,
    css`
      .card:hover {
        cursor: pointer;
        postion: relative;
        top: -3px;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        border: 1px solid var(--primary);
      }

      .card img {
        aspect-ratio: 4 / 3;
        object-fit: cover;
      }

      svg {
        display: inline-block;
        width: 0.75em;
        height: 0.75em;
        color: #6c757d;
      }
    `,
  ];

  override render() {
    return html`
      <div class="card">
        <img
          src=${this.image.src}
          class="card-img-top"
          alt=${this.image.alt}
          ?hidden=${!this.image.src}
        />
        <div class="card-body">
          <h5
            class="card-title ${classMap({
              "mb-0": !this.text,
            })}"
            ?hidden=${!this.title}
          >
            ${this.title}
          </h5>
          <p class="card-text" ?hidden=${!this.text}>${this.text}</p>
        </div>
        <ul
          class="list-group list-group-flush"
          ?hidden=${!this.listItems.length}
        >
          ${this.listItems.map(
            (listItem) => html`<li class="list-group-item">${listItem}</li>`
          )}
        </ul>
        <div class="card-body" ?hidden=${!this.links.length}>
          ${this.links.length
            ? this.links.map(
                (link) =>
                  html`<a href=${link.href} class="card-link">${link.text}</a>`
              )
            : nothing}
        </div>
      </div>
    `;
  }
}
