import { LitElement } from "lit";
import LMSStaffEventCardsDeck from "../components/LMSStaffEventCardDeck";
import LMSEventsModal from "../extensions/LMSEventsModal";
import { Column } from "../sharedDeclarations";
declare global {
    interface HTMLElementTagNameMap {
        "lms-staff-event-card-deck": LMSStaffEventCardsDeck;
        "lms-events-modal": LMSEventsModal;
    }
}
export default class StaffEventsView extends LitElement {
    events: Column[];
    private event_types;
    private target_groups;
    private locations;
    private href;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    hasData(): boolean;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffEventsView.d.ts.map