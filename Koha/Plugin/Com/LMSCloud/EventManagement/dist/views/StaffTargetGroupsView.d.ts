import { LitElement } from "lit";
import LMSTargetGroupsModal from "../extensions/LMSTargetGroupsModal";
import LMSTargetGroupsTable from "../extensions/LMSTargetGroupsTable";
import { TargetGroup } from "../sharedDeclarations";
import { Gettext } from "gettext.js";
declare global {
    interface HTMLElementTagNameMap {
        "lms-target-groups-table": LMSTargetGroupsTable;
        "lms-target-groups-modal": LMSTargetGroupsModal;
    }
}
export default class StaffEventTypesView extends LitElement {
    data: TargetGroup[];
    protected i18n: Gettext;
    private translationHandler;
    connectedCallback(): void;
    handleCreated(): Promise<void>;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffTargetGroupsView.d.ts.map