import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("lms-table-controls")
export default class LMSTableControls extends LitElement {
  static override styles = [
    bootstrapStyles,
    css`
      nav > * {
        margin: 0.5rem 0;
      }
    `,
  ];

  override render() {
    return html`
      <nav
        class="navbar navbar-light bg-white border border-bottom-0 sticky-top"
      >
        <slot></slot>
      </nav>
    `;
  }
}
