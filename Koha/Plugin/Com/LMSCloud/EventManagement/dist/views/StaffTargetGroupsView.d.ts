import { LitElement } from "lit";
import LMSTargetGroupsModal from "../extensions/LMSTargetGroupsModal";
import LMSTargetGroupsTable from "../extensions/LMSTargetGroupsTable";
declare global {
    interface HTMLElementTagNameMap {
        "lms-target-groups-table": LMSTargetGroupsTable;
        "lms-target-groups-modal": LMSTargetGroupsModal;
    }
}
export default class StaffEventTypesView extends LitElement {
    hasLoaded: boolean;
    private isEmpty;
    private target_groups;
    static styles: import("lit").CSSResult[];
    fetchUpdate(): Promise<void>;
    connectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffTargetGroupsView.d.ts.map