import { LitElement } from "lit";
import LMSLocationsModal from "../extensions/LMSLocationsModal";
import LMSLocationsTable from "../extensions/LMSLocationsTable";
import { Column } from "../sharedDeclarations";
declare global {
    interface HTMLElementTagNameMap {
        "lms-locations-table": LMSLocationsTable;
        "lms-locations-modal": LMSLocationsModal;
    }
}
export default class StaffLocationsView extends LitElement {
    locations: Column[];
    static styles: import("lit").CSSResult[];
    fetchUpdate(): Promise<void>;
    connectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffLocationsView.d.ts.map