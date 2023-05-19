import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ModalField } from "../../../sharedDeclarations";

@customElement("lms-checkbox-input")
export default class LMSCheckboxInput extends LitElement {
  @property({ type: Object }) field: ModalField = {} as ModalField;

  @property({ type: Object }) value = "";

  static override styles = [bootstrapStyles];

  private handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.field.value = input.checked ? 1 : 0;
  }

  private getCheckedState() {
    if (typeof this.value === "boolean") {
      return this.value;
    }

    if (typeof this.value === "string") {
      return ["true", "1"].includes(this.value);
    }

    return false;
  }

  override render() {
    const { name, value, desc, required } = this.field;
    return html`
      <div class="form-check">
        <input
          type="checkbox"
          name=${name}
          id=${name}
          value=${value ? 1 : 0}
          class="form-check-input"
          @change=${this.handleChange}
          ?required=${required}
          ?checked=${this.getCheckedState}
        />
        <label for=${name}>&nbsp;${desc}</label>
      </div>
    `;
  }
}
