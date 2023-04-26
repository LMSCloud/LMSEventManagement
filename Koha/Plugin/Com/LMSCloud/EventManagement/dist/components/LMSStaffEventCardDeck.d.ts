import { LitElement } from "lit";
import LMSStaffEventCardForm from "./LMSStaffEventCard/LMSStaffEventCardForm";
import { TargetGroup, EventType, LMSLocation, LMSEvent, TaggedData } from "../sharedDeclarations";
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
    private inputConverter;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    protected getColumnData(query: Record<string, string | number | boolean | any[]>, data?: TaggedData[]): Generator<(string | import("lit").TemplateResult<2 | 1>)[], void, unknown>;
    private hydrate;
    updated(changedProperties: Map<string, any>): void;
    private handleTabClick;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCardDeck.d.ts.map