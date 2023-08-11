import { InputElement } from "../types/common";

export class InputsSnapshot {
    private inputs?: InputElement[];

    private values?: unknown[];

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
        this.values = this.inputs.map((element) => element.value);
    }

    public revert() {
        this.inputs?.forEach((input, index) => {
            input.value = this.values?.[index] as string;
        });
    }
}
