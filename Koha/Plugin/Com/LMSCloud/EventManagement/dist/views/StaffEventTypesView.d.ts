import { LitElement } from "lit";
import LMSEventTypesModal from "../extensions/LMSEventTypesModal";
import LMSEventTypesTable from "../extensions/LMSEventTypesTable";
declare global {
    interface HTMLElementTagNameMap {
        "lms-event-types-table": LMSEventTypesTable;
        "lms-event-types-modal": LMSEventTypesModal;
    }
}
export default class StaffEventTypesView extends LitElement {
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffEventTypesView.d.ts.map