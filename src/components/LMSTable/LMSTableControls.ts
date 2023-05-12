import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
@customElement("lms-table-controls")
export default class LMSTableControls extends LitElement {
  static override styles = [bootstrapStyles];

  override render() {
    return html`
      <nav class="navbar navbar-light bg-white border border-bottom-0">
        <slot></slot>
      </nav>
    `;
  }
}
