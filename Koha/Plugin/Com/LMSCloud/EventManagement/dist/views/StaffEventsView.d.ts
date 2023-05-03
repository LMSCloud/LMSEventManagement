import { LitElement } from "lit";
import LMSEventsModal from "../extensions/LMSEventsModal";
import LMSStaffEventCardsDeck from "../components/LMSStaffEventCardDeck";
declare global {
    interface HTMLElementTagNameMap {
        "lms-staff-event-card-deck": LMSStaffEventCardsDeck;
        "lms-events-modal": LMSEventsModal;
    }
}
export default class StaffEventsView extends LitElement {
    hasLoaded: boolean;
    private isEmpty;
    private events;
    private event_types;
    private target_groups;
    private locations;
    private href;
    static styles: import("lit").CSSResult[];
    fetchUpdate(): Promise<void>;
    connectedCallback(): void;
    hasData(): boolean;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=StaffEventsView.d.ts.map