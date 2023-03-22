import { LitElement } from "lit";
import LMSCard from "../components/LMSCard";
import LMSEventsFilter from "../components/LMSEventsFilter";
import { LMSEvent } from "../sharedDeclarations";
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
    connectedCallback(): void;
    handleFilter: (event: CustomEvent) => void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSEventsView.d.ts.map