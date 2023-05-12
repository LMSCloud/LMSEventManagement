import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import LMSCard from "../LMSCard";
import { Column } from "../../sharedDeclarations";
import { TemplateResultConverter } from "../../lib/converters";
import { skeletonStyles } from "../../styles/skeleton";

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

  private templateResultConverter = new TemplateResultConverter(undefined);

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
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

    this.title = this.templateResultConverter.getValueByIndex(
      name as TemplateResult,
      0
    );
    this.text = this.templateResultConverter.getValueByIndex(
      description as TemplateResult,
      0
    );
  }

  override render() {
    return html`<lms-card .title=${this.title} .text=${this.text}> </lms-card>`;
  }
}
