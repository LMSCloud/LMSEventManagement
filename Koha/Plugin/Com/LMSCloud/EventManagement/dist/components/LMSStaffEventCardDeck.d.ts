import { LitElement, TemplateResult } from "lit";
import LMSStaffEventCardForm from "./LMSStaffEventCard/LMSStaffEventCardForm";
import { TargetGroup, EventType, LMSLocation, LMSEvent } from "../sharedDeclarations";
import LMSStaffEventCardAttendees from "./LMSStaffEventCard/LMSStaffEventCardAttendees";
import LMSStaffEventCardPreview from "./LMSStaffEventCard/LMSStaffEventCardPreview";
import LMSAnchor from "./LMSAnchor";
declare global {
    interface HTMLElementTagNameMap {
        "lms-staff-event-card-form": LMSStaffEventCardForm;
        "lms-staff-event-card-attendees": LMSStaffEventCardAttendees;
        "lms-staff-event-card-preview": LMSStaffEventCardPreview;
        "lms-anchor": LMSAnchor;
    }
}
export default class LMSStaffEventCardDeck extends LitElement {
    events: LMSEvent[];
    event_types: EventType[];
    target_groups: TargetGroup[];
    locations: LMSLocation[];
    private data;
    private cardStates;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    private hydrate;
    private getInputFromColumn;
    private handleTabClick;
    render(): TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCardDeck.d.ts.map