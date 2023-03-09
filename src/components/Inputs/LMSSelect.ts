import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ModalField, SelectOption } from "../../interfaces";
import LMSModal from "../LMSModal";

@customElement("lms-select")
export default class LMSSelect extends LitElement {
  @property({ type: Object }) field: ModalField = {} as ModalField;
  @property({ type: Object }) outerScope: LMSModal = {} as LMSModal;
  @property({ type: Boolean }) hasResolvedEntries = false;
  static override styles = [bootstrapStyles];

  override render() {
    if (!this.field.entries) return nothing;
    return html`
      <div class="form-group">
        <label for=${this.field.name}>${this.field.desc}</label>
        <select
          name=${this.field.name}
          id=${this.field.name}
          class="form-control"
          @change=${(e: Event) => {
            this.field.value =
              (e.target as HTMLSelectElement).value ?? this.field.value;
            if (this.field.handler) {
              this.outerScope.executeHandler({
                handler: this.field.handler,
                event: e,
                requestUpdate: true,
              });
            }
          }}
          ?required=${this.field.required}
        >
          ${this.field.default?.name
            ? html`<option value=${this.field.default.value}>
                ${this.field.default.name}
              </option>`
            : nothing}
          ${this.field.entries.map(
            ({ value, name }: SelectOption) =>
              html`<option value=${value}>${name}</option>`
          )}
        </select>
      </div>
    `;
  }
}
