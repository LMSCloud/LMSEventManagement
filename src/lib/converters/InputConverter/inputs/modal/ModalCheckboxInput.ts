import { html } from "lit";
import {
    InputTypeValue,
    ModalField,
    TranslatedString,
} from "../../../../../types/common";

export default class ModalCheckboxInput {
    private name: string;

    private desc: string | TranslatedString;

    private required: boolean | undefined;

    private value: InputTypeValue | undefined;

    constructor(value: ModalField) {
        this.name = value.name;
        this.desc = value.desc;
        this.required = value.required;
        this.value = value.value;
    }

    public render() {
        return html`<div
            class="form-control my-4"
            @change=${this.handleCheckboxChange}
        >
            <label class="label cursor-pointer">
                <input
                    type="checkbox"
                    ?checked=${this.value}
                    class="checkbox"
                    name=${this.name}
                    ?required=${this.required}
                />
                <span class="label-text">${this.desc}</span>
            </label>
        </div>`;
    }

    private handleCheckboxChange(e: Event | CustomEvent): void {
        if (e instanceof CustomEvent) {
            return;
        }

        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        const { name } = target;
        const value = Boolean(target.checked);

        const changeEvent = new CustomEvent("change", {
            detail: { name, value },
            bubbles: true,
        });

        target.dispatchEvent(changeEvent);
    }
}
