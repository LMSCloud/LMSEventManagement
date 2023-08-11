import { InputElement } from "../types/common";

export class InputsSnapshot {
    private inputs?: InputElement[];

    private values?: { value: string; checked?: boolean }[];

    constructor(elements: NodeListOf<Element>) {
        this.snapshot(elements);
    }

    private filterForInputs(elements: NodeListOf<Element>): InputElement[] {
        return Array.from(elements).filter(
            (element) =>
                element instanceof HTMLInputElement ||
                element instanceof HTMLSelectElement ||
                element instanceof HTMLTextAreaElement
        ) as InputElement[];
    }

    private snapshot(elements: NodeListOf<Element>) {
        this.inputs = this.filterForInputs(elements);
        this.values = this.inputs.map((element) => {
            if (
                element instanceof HTMLInputElement &&
                element.type === "checkbox"
            ) {
                return { value: element.value, checked: element.checked };
            }
            return { value: element.value };
        });
    }

    public revert() {
        this.inputs?.forEach((input, index) => {
            const snapshotValue = this.values?.[index];
            if (snapshotValue) {
                input.value = snapshotValue.value;

                if (
                    input instanceof HTMLInputElement &&
                    input.type === "checkbox"
                ) {
                    input.checked = !!snapshotValue.checked;
                }

                if (input instanceof HTMLTextAreaElement) {
                    input.innerText = snapshotValue.value;
                }
            }
        });
    }
}
