import { LitElement } from "lit";
import { EventType, LMSEvent, LMSLocation, TargetGroup } from "../sharedDeclarations";
type Facets = {
    eventTypeIds: string[];
    targetGroupIds: number[];
    locationIds: string[];
    description: string;
    end_time: Date;
    id: number;
    image: string;
    max_age: number;
    max_participants: number;
    min_age: number;
    name: string;
    open_registration: boolean;
    registration_end: Date;
    registration_link: string;
    registration_start: Date;
    start_time: Date;
    status: "pending" | "confirmed" | "canceled" | "sold_out";
};
export default class LMSEventsFilter extends LitElement {
    events: LMSEvent[];
    facetsStrategy: "preserve" | "update";
    facets: Partial<Facets>;
    event_types: EventType[];
    target_groups: TargetGroup[];
    locations: LMSLocation[];
    isHidden: boolean;
    inputs: NodeListOf<HTMLInputElement> | undefined;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    private facetsStrategyManager;
    private deepCopy;
    private _eventsDeepCopy;
    private get eventsDeepCopy();
    private set eventsDeepCopy(value);
    willUpdate(): void;
    handleReset(): void;
    handleChange(): void;
    emitChange(e: Event): void;
    handleHideToggle(): void;
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSEventsFilter.d.ts.map