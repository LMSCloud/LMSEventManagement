import { LitElement } from "lit";
import LMSCard from "../components/LMSCard";
import LMSEventsFilter from "../components/LMSEventsFilter";
import { LMSEvent } from "../sharedDeclarations";
import LMSCardDetailsModal from "../components/LMSCardDetailsModal";
declare global {
    interface HTMLElementTagNameMap {
        "lms-card": LMSCard;
        "lms-events-filter": LMSEventsFilter;
        "lms-card-details-modal": LMSCardDetailsModal;
    }
}
export default class LMSEventsView extends LitElement {
    borrowernumber: undefined;
    events: LMSEvent[];
    hasHiddenFacets: boolean;
    modalData: LMSEvent;
    hasOpenModal: boolean;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    handleFilter(event: CustomEvent): void;
    handleHide(e: CustomEvent): void;
    handleShowDetails({ lmsEvent }: {
        lmsEvent: LMSEvent;
    }): void;
    handleHideDetails(): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSEventsView.d.ts.map