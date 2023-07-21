import { html } from "lit";
import { InputTypeValue } from "../../../../types/common";

export default class Checkbox {
    private name: string;

    private value: InputTypeValue;

    private disabled: boolean;

    constructor(name: string, value: InputTypeValue) {
        this.name = name;
        this.value = value;
        this.disabled = true;
    }

    public render() {
        return html`<input
            class="checkbox"
            type="checkbox"
            name=${this.name}
            ?checked=${Boolean(this.value)}
            ?disabled=${this.disabled}
        />`;
    }
}
