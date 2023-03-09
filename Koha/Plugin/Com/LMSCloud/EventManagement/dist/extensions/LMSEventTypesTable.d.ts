import LMSTable from "../components/LMSTable";
export default class LMSEventTypesTable extends LMSTable {
    handleEdit(e: Event): void;
    handleInput(input: HTMLInputElement | HTMLSelectElement, value: unknown): unknown;
    handleSave(e: Event): Promise<void>;
    handleDelete(e: Event): Promise<void>;
    connectedCallback(): void;
    private isInputType;
    private getInputFromColumn;
}
//# sourceMappingURL=LMSEventTypesTable.d.ts.map