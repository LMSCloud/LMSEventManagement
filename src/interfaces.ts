import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { TemplateResult } from "lit";
import { InputType } from "./types";

export type HandlerCallbackFunction = (args: any) => any;

export enum Status {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Canceled = "Canceled",
  SoldOut = "Sold Out",
}

export type Column = {
  [key: string]: string | number | TemplateResult;
};

export type Image = {
  src: string;
  alt: string;
};

export type Link = {
  href: string;
  text: string;
};

export type LMSEvent = {
  id: number;
  name: string;
  event_type: string;
  location: LMSLocation;
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
};

export type FacetType = "checkbox" | "date" | "range";

export type Facet = {
  type: FacetType;
  name: string;
  value: string;
  checked?: boolean;
};

export type Facets = {
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

export type LMSLocation = {
  id: number;
  street: string;
  number: string;
  city: string;
  zip: string;
  country: string;
  name: string;
};

export type LMSLocationValue = string | number;

export type MenuEntry = {
  name: string;
  icon: IconDefinition;
  url: string;
  method: string;
};

export type BaseField = {
  name: string;
  desc?: string;
  logic?: () => Promise<{ value: string; name: string }[]>;
  required?: boolean;
  value?: string | { [key: string]: string }[];
  entries?: { value: string; name: string }[];
  attributes?: [string, string | number][];
};

export type Field = BaseField & {
  type: InputType;
};

export type SpecialField = BaseField & {
  type: "select" | "info" | "checkbox";
};

export type ModalField = BaseField & {
  type?: InputType | "select" | "info" | "checkbox" | "matrix";
  default?: SelectOption;
  headers?: string[][];
  matrixInputType?: InputType;
  handler?: HandlerCallbackFunction;
};

export type HandlerExecutorArgs = {
  handler: HandlerCallbackFunction;
  event?: Event;
  value?: string | number;
  requestUpdate: boolean;
};

export type CreateOpts = RequestInit & {
  endpoint: string;
};

export type Input = {
  name: string;
  value: string;
};

export type SelectOption = Input;

export type TargetGroup = {
  id: number;
  name: string;
  min_age: number;
  max_age: number;
};

export type TargetGroupFee = {
  id: number;
  target_group_id: number;
  selected: boolean;
  fee: number;
};

export type TargetGroupValue = string | number | boolean;

export type EventType = {
  id: number;
  name: string;
  target_groups: TargetGroupFee[];
  min_age: number;
  max_age: number;
  max_participants: number;
  location: number;
  image: number;
  description: string;
  open_registration: boolean;
};

export type EventTypeValue = string | number | boolean | TargetGroupFee[];
