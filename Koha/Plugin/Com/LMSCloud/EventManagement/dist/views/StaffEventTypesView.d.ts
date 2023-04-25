import { LitElement } from "lit";
import LMSEventTypesModal from "../extensions/LMSEventTypesModal";
import LMSEventTypesTable from "../extensions/LMSEventTypesTable";
import { Column } from "../sharedDeclarations";
declare global {
    interface HTMLElementTagNameMap {
        "lms-event-types-table": LMSEventTypesTable;
        "lms-event-types-modal": LMSEventTypesModal;
    }
}
export default class StaffEventTypesView extends LitElement {
    event_types: Column[];
    private target_groups;
    private locations;
    connectedCallback(): void;
    hasData(): boolean;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffEventTypesView.d.ts.map