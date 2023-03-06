import { LitElement } from "lit";
import LMSCard from "../components/LMSCard";
import LMSEventsFilter from "../components/LMSEventsFilter";
import { LMSEvent } from "../interfaces";
declare global {
    interface HTMLElementTagNameMap {
        "lms-card": LMSCard;
        "lms-events-filter": LMSEventsFilter;
    }
}
export default class LMSEventsView extends LitElement {
    borrowernumber: undefined;
    events: LMSEvent[];
    static styles: import("lit").CSSResult[];
    private _getEvents;
    connectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSEventsView.d.ts.map