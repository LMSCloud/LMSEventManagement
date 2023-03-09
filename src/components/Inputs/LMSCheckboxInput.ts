import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ModalField } from "../../sharedDeclarations";

@customElement("lms-checkbox-input")
export default class LMSCheckboxInput extends LitElement {
  @property({ type: Object }) field: ModalField = {} as ModalField;
  @property({ type: Object }) value: string = "";

  static override styles = [bootstrapStyles];

  override render() {
    return html`
      <div class="form-check">
        <input
          type="checkbox"
          name=${this.field.name}
          id=${this.field.name}
          value=${(this.field.value as string) ?? "1"}
          class="form-check-input"
          @input=${(e: Event) => {
            this.field.value = (e.target as HTMLInputElement).checked
              ? "1"
              : "0";
          }}
          ?required=${this.field.required}
          ?checked=${[true, "true", "1"].includes(this.value as string)}
        />
        <label for="${this.field.name}">&nbsp;${this.field.desc}</label>
      </div>
    `;
  }
}
