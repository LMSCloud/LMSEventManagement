import { LitElement } from "lit";
import LMSLocationsModal from "../extensions/LMSLocationsModal";
import LMSLocationsTable from "../extensions/LMSLocationsTable";
import { Gettext } from "gettext.js";
declare global {
    interface HTMLElementTagNameMap {
        "lms-locations-table": LMSLocationsTable;
        "lms-locations-modal": LMSLocationsModal;
    }
}
export default class StaffLocationsView extends LitElement {
    protected i18n: Gettext;
    private translationHandler;
    connectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffLocationsView.d.ts.map