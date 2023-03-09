import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import LMSCard from "../LMSCard";
import { Column } from "../../sharedDeclarations";
import TemplateResultConverter from "../../lib/TemplateResultConverter";

declare global {
  interface HTMLElementTagNameMap {
    "lms-card": LMSCard;
  }
}

@customElement("lms-staff-event-card-preview")
export default class LMSStaffEventCardPreview extends LitElement {
  @property({ type: Array }) datum: Column = {} as Column;
  @property({ type: String }) override title = "";
  @property({ type: String }) text = "";
  @property({ type: Object, attribute: false }) templateResultConverter =
    new TemplateResultConverter(undefined);

  static override styles = [
    bootstrapStyles,
    css`
      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #ffffff;
      }

      button {
        white-space: nowrap;
      }
    `,
  ];

  override connectedCallback() {
    super.connectedCallback();

    const { name, description } = this.datum;

    this.templateResultConverter.templateResult = name;
    this.title = this.templateResultConverter.getRenderValues()[0] as string;

    this.templateResultConverter.templateResult = description;
    this.text = this.templateResultConverter.getRenderValues()[0] as string;
  }

  override render() {
    return html`<lms-card .title=${this.title} .text=${this.text}> </lms-card>`;
  }
}
