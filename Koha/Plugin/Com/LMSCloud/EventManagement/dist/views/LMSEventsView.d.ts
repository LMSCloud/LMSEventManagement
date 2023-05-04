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
type ReservedParam = "_match" | "_order_by" | "_page" | "_per_page" | "q";
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
    static styles: import("lit").CSSResult[];
    getReservedQueryParams(this: {
        [key in ReservedParam]?: number | string;
    }): void;
    getReservedQueryString(this: {
        [key in ReservedParam]?: number | string;
    }, useParams?: ReservedParam[]): string;
    updateUrlWithReservedParams(reservedParams: {
        [key in ReservedParam]?: string | number;
    }): void;
    connectedCallback(): void;
    handleFilter(event: CustomEvent): void;
    handleShowDetails({ lmsEvent }: {
        lmsEvent: LMSEvent;
    }): void;
    handleHideDetails(): void;
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSEventsView.d.ts.map