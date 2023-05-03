import { LitElement } from "lit";
import LMSEventTypesModal from "../extensions/LMSEventTypesModal";
import LMSEventTypesTable from "../extensions/LMSEventTypesTable";
import { URIComponents } from "../sharedDeclarations";
declare global {
    interface HTMLElementTagNameMap {
        "lms-event-types-table": LMSEventTypesTable;
        "lms-event-types-modal": LMSEventTypesModal;
    }
}
export default class StaffEventTypesView extends LitElement {
    hasLoaded: boolean;
    private isEmpty;
    private event_types;
    private target_groups;
    private locations;
    href: URIComponents;
    static styles: import("lit").CSSResult[];
    fetchUpdate(): Promise<void>;
    connectedCallback(): void;
    hasData(): boolean;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffEventTypesView.d.ts.map