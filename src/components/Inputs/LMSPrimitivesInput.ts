import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined";
import { ModalField } from "../../interfaces";
import { InputType } from "../../types";

@customElement("lms-primitives-input")
export default class LMSPrimitivesInput extends LitElement {
  @property({ type: Object }) field: ModalField = {} as ModalField;
  @property({ type: Object }) value: number | string = "";

  static override styles = [bootstrapStyles];

  override render() {
    return html` <div class="form-group">
      <label for=${this.field.name}>${this.field.desc}</label>
      <input
        type=${ifDefined(this.field.type) as InputType}
        name=${this.field.name}
        id=${this.field.name}
        value=${ifDefined(
          typeof this.value === "string" ? this.value : this.value?.toString()
        )}
        class="form-control"
        @input=${(e: Event) => {
          this.field.value =
            (e.target as HTMLInputElement).value ?? this.field.value;
        }}
        ?required=${this.field.required}
      />
    </div>`;
  }
}
