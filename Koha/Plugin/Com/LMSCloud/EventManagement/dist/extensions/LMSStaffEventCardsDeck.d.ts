import { LitElement, TemplateResult } from "lit";
import { LMSStaffEventCard } from "../components/LMSStaffEventCard";
import { Column } from "../interfaces";
declare global {
    interface HTMLElementTagNameMap {
        "lms-staff-event-card": LMSStaffEventCard;
    }
}
export default class LMSStaffEventCardsDeck extends LitElement {
    data: Column[];
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    private getInputFromColumn;
    render(): TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCardsDeck.d.ts.map