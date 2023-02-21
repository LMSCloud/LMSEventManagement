import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
declare enum Status {
    Pending = "Pending",
    Approved = "Approved",
    Cancelled = "Cancelled"
}
export interface Event {
    id: number;
    name: string;
    event_type: string;
    location: Location;
    start_time: string;
    end_time: string;
    registration_start: string;
    registration_end: string;
    max_participants: number;
    fee: number;
    age_restriction: string;
    image: string;
    notes: string;
    status: Status;
}
export interface Facet {
    type: "checkbox" | "date" | "range";
    name: string;
    value: string;
    checked?: boolean;
}
export interface Facets {
    event_types: Facet[];
    target_groups: Facet[];
    locations: Facet[];
    min_age: Facet;
    max_age: Facet;
    open_registration: Facet;
    start_date: Facet;
    end_date: Facet;
    fee: Facet;
}
export interface Location {
    id: number;
    street: string;
    number: string;
    city: string;
    zip: string;
    country: string;
    name: string;
}
export interface MenuEntry {
    name: string;
    icon: IconDefinition;
    url: string;
    method: string;
}
export interface Field {
    name: string;
    type: "text" | "password" | "checkbox" | "radio" | "number" | "date" | "time" | "datetime-local" | "email" | "search" | "tel" | "url" | "color";
    desc?: string;
    logic?: () => Promise<{
        value: string;
        name: string;
    }[]>;
    required?: boolean;
    value?: string;
    entries?: {
        value: string;
        name: string;
    }[];
}
export interface SpecialField extends Omit<Field, "type"> {
    type: "select" | "info" | "checkbox";
}
export interface CreateOpts extends RequestInit {
    endpoint: string;
}
export {};
//# sourceMappingURL=interfaces.d.ts.map