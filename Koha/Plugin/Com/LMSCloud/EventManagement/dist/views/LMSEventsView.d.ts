import { LitElement } from "lit";
import LMSCard from "../components/LMSCard";
import LMSEventsFilter from "../components/LMSEventsFilter";
import { LMSEvent } from "../sharedDeclarations";
import LMSCardDetailsModal from "../components/LMSCardDetailsModal";
import LMSPaginationNav from "../components/LMSPaginationNav";
declare global {
    interface HTMLElementTagNameMap {
        "lms-card": LMSCard;
        "lms-events-filter": LMSEventsFilter;
        "lms-card-details-modal": LMSCardDetailsModal;
        "lms-pagination-nav": LMSPaginationNav;
    }
}
export default class LMSEventsView extends LitElement {
    borrowernumber: undefined;
    events: LMSEvent[];
    modalData: LMSEvent;
    hasOpenModal: boolean;
    _match?: string;
    _order_by?: string;
    _page: number;
    _per_page: number;
    q?: string;
    private hasLoaded;
    static styles: import("lit").CSSResult[];
    private getReservedQueryParams;
    private getReservedQueryString;
    private updateUrlWithReservedParams;
    connectedCallback(): void;
    private handleQuery;
    private handleShowDetails;
    private handleHideDetails;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSEventsView.d.ts.map