import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map";
import { ModalField, SelectOption } from "../../sharedDeclarations";

@customElement("lms-select")
export default class LMSSelect extends LitElement {
  private defaultOption = {} as SelectOption;

  @property({ type: Object }) field: ModalField = {} as ModalField;
  static override styles = [bootstrapStyles];

  override willUpdate() {
    const { dbData } = this.field;
    if (dbData?.length) {
      const [defaultOption] = dbData;
      const { id } = defaultOption;
      this.field.value = id.toString();
      this.defaultOption = defaultOption;
    }
  }

  override render() {
    const { name, desc, value, required, dbData } = this.field;
    return html`
      <div class="form-group">
        <label for=${name}>${desc}</label>
        <select
          name=${name}
          id=${name}
          class="form-control"
          @change=${(e: Event) => {
            this.field.value = (e.target as HTMLSelectElement).value ?? value;
          }}
          ?required=${required}
        >
          ${this.defaultOption.name
            ? html`<option value=${this.defaultOption.id} selected>
                ${this.defaultOption.name}
              </option>`
            : nothing}
          ${map(
            dbData,
            ({ id, name }: SelectOption) =>
              html`<option value=${id}>${name}</option>`
          )}
        </select>
      </div>
    `;
  }
}
