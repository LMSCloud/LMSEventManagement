import LMSTable from "../components/LMSTable";
import { TargetGroup } from "../sharedDeclarations";
export default class LMSEventTypesTable extends LMSTable {
    target_groups: TargetGroup[];
    handleEdit(e: Event): void;
    handleSave(e: Event): Promise<void>;
    handleDelete(e: Event): Promise<void>;
    constructor();
    connectedCallback(): void;
    private hydrate;
    updated(changedProperties: Map<string, any>): void;
}
//# sourceMappingURL=LMSTargetGroupsTable.d.ts.map