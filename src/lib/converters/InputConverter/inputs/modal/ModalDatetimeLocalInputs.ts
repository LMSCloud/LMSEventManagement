import { html } from "lit";
import {
    InputTypeValue,
    ModalField,
    TranslatedString,
} from "../../../../../types/common";
import { convertToISO8601 } from "../../../datetimeConverters";

export default class ModalDatetimeLocalInput {
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
        return html` <div
            class="form-control w-full"
            @change=${this.handleDatetimeLocalChange}
        >
            <label class="label">
                <span class="label-text">${this.desc}</span>
            </label>
            <input
                class="input input-bordered w-full"
                type="datetime-local"
                name=${this.name}
                ?required=${this.required}
                value=${this.value}
            />
        </div>`;
    }

    private handleDatetimeLocalChange(e: Event | CustomEvent): void {
        if (e instanceof CustomEvent) {
            return;
        }

        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        const { name } = target;
        let { value } = target;

        value = convertToISO8601(value);

        const changeEvent = new CustomEvent("change", {
            detail: { name, value },
            bubbles: true,
        });

        target.dispatchEvent(changeEvent);
    }
}
