import { html, TemplateResult } from "lit";
import {
    InputTypeValue,
    ModalField,
    SelectOption,
    TranslatedString,
} from "../../../../../types/common";
import { __ } from "../../../../translate";

export default class ModalSelect {
    private name: string;

    private desc: string | TranslatedString;

    private required: boolean | undefined;

    private value: InputTypeValue | undefined;

    private data: SelectOption[] | undefined;

    constructor(value: ModalField, data: SelectOption[]) {
        this.name = value.name;
        this.desc = value.desc;
        this.required = value.required;
        this.value = value.value;
        this.data = data;
    }

    public render() {
        if (!this.data) {
            return this.renderError();
        }

        return html`<div class="form-control w-full">
            <label class="label">
                <span class="label-text">${this.desc}</span>
            </label>
            <select
                class="select select-bordered"
                name=${this.name}
                ?required=${this.required}
            >
                <option selected disabled>
                    ${__("Please select an option")}
                </option>
                ${this.data.map(
                    (datum) =>
                        html`<option
                            value=${datum.id}
                            ?selected=${datum.id === this.value}
                        >
                            ${datum.name}
                        </option>`
                )}
            </select>
        </div>`;
    }

    private renderError(): TemplateResult {
        return html`<strong>${__("Error")}!</strong>`;
    }
}
