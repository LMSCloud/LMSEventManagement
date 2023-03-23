import { LitElement } from "lit";
import LMSStaffEventCardsDeck from "../components/LMSStaffEventCardDeck";
import LMSEventsModal from "../extensions/LMSEventsModal";
declare global {
    interface HTMLElementTagNameMap {
        "lms-staff-event-card-deck": LMSStaffEventCardsDeck;
        "lms-events-modal": LMSEventsModal;
    }
}
export default class StaffEventsView extends LitElement {
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffEventsView.d.ts.map