import { LitElement, TemplateResult } from "lit";
import LMSStaffEventCardForm from "./LMSStaffEventCardForm";
import { Column } from "../interfaces";
declare global {
    interface HTMLElementTagNameMap {
        "lms-staff-event-card-form": LMSStaffEventCardForm;
    }
}
export default class LMSStaffEventCardDeck extends LitElement {
    data: Column[];
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    private getInputFromColumn;
    render(): TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCardDeck.d.ts.map