import LMSTable from "../components/LMSTable";
import { EventType, TargetGroup, URIComponents, LMSLocation } from "../sharedDeclarations";
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
    href: URIComponents;
    handleEdit(e: Event): void;
    handleInput(input: HTMLInputElement | HTMLSelectElement, value: unknown): unknown;
    handleSave(e: Event): Promise<void>;
    handleDelete(e: Event): Promise<void>;
    constructor();
    connectedCallback(): void;
    private hydrate;
}
//# sourceMappingURL=LMSEventTypesTable.d.ts.map