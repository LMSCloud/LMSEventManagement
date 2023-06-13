import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TemplateResultConverter } from "../../lib/converters";
import { Column } from "../../sharedDeclarations";
import { skeletonStyles } from "../../styles/skeleton";
import { tailwindStyles } from "../../tailwind.lit";
import LMSCard from "../LMSCard";

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
    tailwindStyles,
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
    return html`<lms-card .title=${this.title} .text=${this.text}>
        </lms-card>`;
  }
}
