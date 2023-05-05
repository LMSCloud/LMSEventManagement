import { LitElement } from "lit";
import { EventType, LMSEvent, LMSLocation, TargetGroup, Facets } from "../sharedDeclarations";
import LMSSearch from "./LMSSearch";
import LMSDropdown from "./LMSDropdown";
declare global {
    interface HTMLElementTagNameMap {
        "lms-search": LMSSearch;
        "lms-dropdown": LMSDropdown;
    }
}
export default class LMSEventsFilter extends LitElement {
    private shouldFold;
    events: LMSEvent[];
    facetsStrategy: "preserve" | "update";
    isHidden: boolean;
    facets: Partial<Facets>;
    event_types: EventType[];
    target_groups: TargetGroup[];
    locations: LMSLocation[];
    activeFilters: [string, string | boolean][];
    inputs: NodeListOf<HTMLInputElement> | undefined;
    lmsDropdowns: NodeListOf<LMSDropdown>;
    static styles: import("lit").CSSResult[];
    private throttle;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private facetsStrategyManager;
    private deepCopy;
    private _eventsDeepCopy;
    private get eventsDeepCopy();
    private set eventsDeepCopy(value);
    willUpdate(): void;
    private handleReset;
    private handleChange;
    private handleSearch;
    private handleHideToggle;
    private handleDropdownToggle;
    protected urlSearchParamsToQueryParam(searchParams: URLSearchParams): string;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSEventsFilter.d.ts.map