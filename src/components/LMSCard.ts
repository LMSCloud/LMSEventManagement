import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";

@customElement("lms-card")
export default class LMSCard extends LitElement {
  @property({ type: String }) override title = "Card title";
  @property({ type: String }) text =
    "Some quick example text to build on the card title and make up the bulk of the card's content.";
  @property({ type: Object }) image = { src: "#", alt: "..." };
  @property({ type: Array }) links = [
    { href: "#", text: "Card link" },
    { href: "#", text: "Another link" },
  ];
  @property({ type: Array }) listItems = [
    "An item",
    "A second item",
    "A third item",
  ];

  static override styles = [bootstrapStyles];

  override render() {
    return html`
      <div class="card">
        <img
          src=${this.image.src}
          class="card-img-top"
          alt=${this.image.alt}
          ?hidden=${!this.image}
        />
        <div class="card-body">
          <h5 class="card-title" ?hidden=${!this.title}>${this.title}</h5>
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
          ${this.links.map(
            (link) =>
              html`<a href="${link.href}" class="card-link">${link.text}</a>`
          )}
        </div>
      </div>
    `;
  }
}
