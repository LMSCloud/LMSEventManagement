import { LitElement } from "lit";
import LMSEventTypesModal from "../extensions/LMSEventTypesModal";
import LMSEventTypesTable from "../extensions/LMSEventTypesTable";
import { Gettext } from "gettext.js";
declare global {
    interface HTMLElementTagNameMap {
        "lms-event-types-table": LMSEventTypesTable;
        "lms-event-types-modal": LMSEventTypesModal;
    }
}
export default class StaffEventTypesView extends LitElement {
    protected i18n: Gettext;
    private translationHandler;
    connectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffEventTypesView.d.ts.map