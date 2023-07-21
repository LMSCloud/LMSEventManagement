import { html } from "lit";
import {
    InputTypeValue,
    ModalField,
    TranslatedString,
} from "../../../../../types/common";

export default class ModalTextInput {
    private name: string;

    private desc: string | TranslatedString;

    private placeholder: string | TranslatedString | undefined;

    private required: boolean | undefined;

    private value: InputTypeValue | undefined;

    constructor(value: ModalField) {
        this.name = value.name;
        this.desc = value.desc;
        this.placeholder = value.placeholder;
        this.required = value.required;
        this.value = value.value;
    }

    public render() {
        return html` <div class="form-control w-full">
            <label class="label">
                <span class="label-text">${this.desc}</span>
            </label>
            <input
                class="input-bordered input w-full"
                type="text"
                name=${this.name}
                placeholder=${this.placeholder}
                ?required=${this.required}
                value=${this.value}
            />
        </div>`;
    }
}
