import LMSTable from "../components/LMSTable";
import { EventType, TargetGroup, LMSLocation } from "../sharedDeclarations";
import LMSAnchor from "../components/LMSAnchor";
declare global {
    interface HTMLElementTagNameMap {
        "lms-anchor": LMSAnchor;
    }
}
export default class LMSEventTypesTable extends LMSTable {
    target_groups: TargetGroup[];
    locations: LMSLocation[];
    event_types: EventType[];
    handleEdit(e: Event): void;
    handleInput(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, value: unknown): unknown;
    handleSave(e: Event): Promise<void>;
    handleDelete(e: Event): Promise<void>;
    constructor();
    connectedCallback(): void;
    private hydrate;
    updated(changedProperties: Map<string, any>): void;
}
//# sourceMappingURL=LMSEventTypesTable.d.ts.map