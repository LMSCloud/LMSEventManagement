import { LitElement, TemplateResult } from "lit";
import LMSStaffEventCardForm from "./LMSStaffEventCard/LMSStaffEventCardForm";
import { Column } from "../interfaces";
import LMSStaffEventCardAttendees from "./LMSStaffEventCard/LMSStaffEventCardAttendees";
import LMSStaffEventCardPreview from "./LMSStaffEventCard/LMSStaffEventCardPreview";
declare global {
    interface HTMLElementTagNameMap {
        "lms-staff-event-card-form": LMSStaffEventCardForm;
        "lms-staff-event-card-attendees": LMSStaffEventCardAttendees;
        "lms-staff-event-card-preview": LMSStaffEventCardPreview;
    }
}
export default class LMSStaffEventCardDeck extends LitElement {
    data: Column[];
    cardStates: Map<string, string[]>;
    constants: {
        ID: number;
    };
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    private getInputFromColumn;
    private handleTabClick;
    render(): TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCardDeck.d.ts.map