import { html } from "lit";
import { InputTypeValue } from "../../../../types/common";
import { normalizeForInput } from "../../datetimeConverters";

export const associations = {
    city: "text",
    country: "text",
    end_time: "datetime-local",
    link: "text",
    max_age: "number",
    max_participants: "number",
    min_age: "number",
    name: "text",
    number: "text",
    registration_end: "datetime-local",
    registration_link: "text",
    registration_start: "datetime-local",
    start_time: "datetime-local",
    street: "text",
    value: "text",
    zip: "text",
};

export default class Input {
    private associations: Record<string, string>;

    private name: keyof typeof associations;

    private value: InputTypeValue;

    private disabled: boolean;

    constructor(name: keyof typeof associations, value: InputTypeValue) {
        this.associations = associations;
        this.name = name;
        this.value = value;
        this.disabled = true;
    }

    public render() {
        return html`<input
            class="input-bordered input w-full"
            type=${this.associations[this.name]}
            name=${this.name}
            value=${this.formatValue()}
            ?disabled=${this.disabled}
        />`;
    }

    private formatValue() {
        switch (this.associations[this.name]) {
            case "datetime-local":
                return normalizeForInput(
                    this.value as string,
                    "datetime-local"
                );
            default:
                return this.value;
        }
    }
}
