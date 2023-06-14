import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { tailwindStyles } from "../../../tailwind.lit";
import { ModalField } from "../../../types/common";

@customElement("lms-checkbox-input")
export default class LMSCheckboxInput extends LitElement {
    @property({ type: Object }) field: ModalField = {} as ModalField;

    @property({ type: Object }) value = "";

    static override styles = [tailwindStyles];

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
        const { name, desc, placeholder, value, required } = this.field;
        return html`
            <div class="form-control">
                <label for=${name} class="label cursor-pointer">
                    <input
                        type="checkbox"
                        name=${name}
                        id=${name}
                        value=${value ? 1 : 0}
                        class="checkbox"
                        placeholder=${ifDefined(placeholder)}
                        @change=${this.handleChange}
                        ?required=${required}
                        ?checked=${this.getCheckedState}
                    />
                    <span class="label-text">${desc}</span>
                </label>
            </div>
        `;
    }
}
