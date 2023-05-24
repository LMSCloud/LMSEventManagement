import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { convertToISO8601 } from "../../../lib/converters";
import { InputType, ModalField } from "../../../sharedDeclarations";

@customElement("lms-primitives-input")
export default class LMSPrimitivesInput extends LitElement {
  @property({ type: Object }) field: ModalField = {} as ModalField;

  @property({ type: Object }) value: number | string = "";

  static override styles = [bootstrapStyles];

  private handleInput(e: Event) {
    const { type, value } = e.target as HTMLInputElement;
    if (type === "datetime-local") {
      this.field.value = convertToISO8601(value);
      return;
    }
    this.field.value = value;
  }

  override render() {
    const { name, desc, placeholder, type, required } = this.field;
    return html` <div class="form-group">
      <label for=${name}>${desc}</label>
      <input
        type=${ifDefined(type) as InputType}
        name=${name}
        id=${name}
        value=${ifDefined(
          typeof this.value === "string" ? this.value : this.value?.toString()
        )}
        class="form-control"
        placeholder=${ifDefined(placeholder)}
        @input=${this.handleInput}
        ?required=${required}
      />
    </div>`;
  }
}
