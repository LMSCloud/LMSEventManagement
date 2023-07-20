import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { convertToISO8601 } from "../../../lib/converters/datetimeConverters";
import { tailwindStyles } from "../../../tailwind.lit";
import { InputType, ModalField } from "../../../types/common";

@customElement("lms-primitives-input")
export default class LMSPrimitivesInput extends LitElement {
    @property({ type: Object }) field: ModalField = {} as ModalField;

    @property({ type: Object }) value: number | string = "";

    static override styles = [tailwindStyles];

    private handleInput(e: Event) {
        const { type, value } = e.target as HTMLInputElement;
        if (type === "datetime-local") {
            this.value = convertToISO8601(value);
            this.field.value = this.value;
        } else {
            this.value = value;
            this.field.value = this.value;
        }

        const event = new CustomEvent("change", {
            detail: { name: this.field.name, value: this.value },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    override render() {
        const { name, desc, placeholder, type, required } = this.field;
        return html` <div class="form-control w-full">
            <label for=${name} class="label"
                ><span class="label-text">${desc}</span></label
            >
            <input
                type=${ifDefined(type) as InputType}
                name=${name}
                id=${name}
                value=${ifDefined(
                    typeof this.value === "string"
                        ? this.value
                        : this.value?.toString()
                )}
                class="input-bordered input w-full"
                placeholder=${ifDefined(placeholder)}
                @input=${this.handleInput}
                ?required=${required}
            />
        </div>`;
    }
}
