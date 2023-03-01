import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { TemplateResult } from "lit";
import { InputType } from "./types";
declare enum Status {
    Pending = "Pending",
    Confirmed = "Confirmed",
    Canceled = "Canceled",
    SoldOut = "Sold Out"
}
export interface Column {
    [key: string]: string | number | TemplateResult;
}
export interface Image {
    src: string;
    alt: string;
}
export interface Link {
    href: string;
    text: string;
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
interface BaseField {
    name: string;
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
    attributes?: [string, string | number][];
}
export interface Field extends BaseField {
    type: InputType;
}
export interface SpecialField extends BaseField {
    type: "select" | "info" | "checkbox";
}
export interface ModalField extends BaseField {
    type?: InputType | "select" | "info" | "checkbox";
    default?: SelectOption;
}
export interface CreateOpts extends RequestInit {
    endpoint: string;
}
export interface SelectOption {
    value: string;
    name: string;
}
export interface TargetGroup {
    id: number;
    name: string;
    min_age: number;
    max_age: number;
}
export {};
//# sourceMappingURL=interfaces.d.ts.map