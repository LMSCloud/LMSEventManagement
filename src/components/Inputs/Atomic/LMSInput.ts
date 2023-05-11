/** Let's write an atomic LitElement that functions as a generic input component */
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators";

@customElement("lms-input")
export default class LMSInput extends LitElement {
  static override styles = [bootstrapStyles];

  @property({ type: Boolean }) disabled = false;

  @property({ type: String }) name = "...";

  @property({ type: String }) placeholder = "...";

  @property({ type: String }) type = "text";

  @property({ type: String }) value = "";

  override render() {
    return html`
      <input
        class="form-control"
        type=${this.type}
        name=${this.name}
        value=${this.value}
        placeholder=${this.placeholder}
        ?disabled=${this.disabled}
      />
    `;
  }
}
