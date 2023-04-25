import LMSTable from "../components/LMSTable";
import { LMSLocation } from "../sharedDeclarations";
export default class LMSLocationsTable extends LMSTable {
    locations: LMSLocation[];
    handleEdit(e: Event): void;
    handleSave(e: Event): Promise<void>;
    handleDelete(e: Event): Promise<void>;
    constructor();
    connectedCallback(): void;
    private hydrate;
    updated(changedProperties: Map<string, any>): void;
}
//# sourceMappingURL=LMSLocationsTable.d.ts.map