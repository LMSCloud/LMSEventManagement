import { LitElement } from "lit";
import LMSTargetGroupsModal from "../extensions/LMSTargetGroupsModal";
import LMSTargetGroupsTable from "../extensions/LMSTargetGroupsTable";
import { TargetGroup } from "../sharedDeclarations";
declare global {
    interface HTMLElementTagNameMap {
        "lms-target-groups-table": LMSTargetGroupsTable;
        "lms-target-groups-modal": LMSTargetGroupsModal;
    }
}
export default class StaffEventTypesView extends LitElement {
    data: TargetGroup[];
    handleCreated(): Promise<void>;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffTargetGroupsView.d.ts.map