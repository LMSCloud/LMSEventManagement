import { html } from "lit";
import { InputTypeValue, SelectOption } from "../../../../types/common";

export default class Select {
    private name: string;

    private value: InputTypeValue;

    private data: SelectOption[];

    private disabled: boolean;

    constructor(name: string, value: InputTypeValue, data: SelectOption[]) {
        this.name = name;
        this.value = value;
        this.data = data;
        this.disabled = true;
    }

    public render() {
        return html`<select
            class="select select-bordered w-full"
            name=${this.name}
            ?disabled=${this.disabled}
        >
            ${this.data.map(
                (datum) =>
                    html`<option
                        value=${datum.id}
                        ?selected=${datum.id == this.value}
                    >
                        ${datum.name}
                    </option>`
            )};
        </select>`;
    }
}
