import LMSTable from "../components/LMSTable";
import { URIComponents } from "../sharedDeclarations";
import LMSAnchor from "../components/LMSAnchor";
declare global {
    interface HTMLElementTagNameMap {
        "lms-anchor": LMSAnchor;
    }
}
export default class LMSEventTypesTable extends LMSTable {
    href: URIComponents;
    handleEdit(e: Event): void;
    handleInput(input: HTMLInputElement | HTMLSelectElement, value: unknown): unknown;
    handleSave(e: Event): Promise<void>;
    handleDelete(e: Event): Promise<void>;
    connectedCallback(): void;
    private isInputType;
    private getInputFromColumn;
}
//# sourceMappingURL=LMSEventTypesTable.d.ts.map