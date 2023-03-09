import { LitElement } from "lit";
import { LMSEvent } from "../sharedDeclarations";
type FacetType = "checkbox" | "date" | "range";
type Facet = {
    type: FacetType;
    name: string;
    value: string;
    checked?: boolean;
};
type Facets = {
    event_types: Facet[];
    target_groups: Facet[];
    locations: Facet[];
    min_age: Facet;
    max_age: Facet;
    open_registration: Facet;
    start_date: Facet;
    end_date: Facet;
    fee: Facet;
};
export default class LMSEventsFilter extends LitElement {
    events: LMSEvent[];
    facets: Facets;
    static styles: import("lit").CSSResult[];
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSEventsFilter.d.ts.map