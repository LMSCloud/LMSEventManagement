import { TemplateResult } from "lit";
import { DirectiveResult } from "lit/directive";
import { TranslateDirective } from "./lib/translate";

export type InputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export type SpecialFieldType = "select" | "info" | "checkbox";

export enum Status {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Canceled = "Canceled",
  SoldOut = "Sold Out",
}

export type HandlerCallbackFunction = ({
  e,
  value,
  fields,
}: {
  e?: Event;
  value?: string | number;
  fields: ModalField[];
}) => Promise<void>;

type ColumnValue = string | number | TemplateResult;

export type Column = {
  [key: string]: ColumnValue;
};

export type TaggedColumn = Column & {
  uuid: string;
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

export type LMSEvent = {
  id: number;
  name: string;
  event_type: string;
  target_groups: TargetGroupState[];
  min_age: string;
  max_age: string;
  max_participants: number;
  start_time: string;
  end_time: string;
  registration_start: string;
  registration_end: string;
  location: string;
  image: string;
  description: string;
  status: Status;
  registration_link: string;
};

export type Input = {
  name: string;
  value: string;
};

type TranslatedString = DirectiveResult<typeof TranslateDirective>;

export type SelectOption = {
  id: string | number;
  name: string | TranslatedString;
};

export type BaseField = {
  name: string;
  desc?: string | TranslatedString;
  logic?: () => Promise<SelectOption[]>;
} & Partial<{
  required: boolean;
  value: string | { [key: string]: string }[];
  dbData: SelectOption[];
  attributes: [string, string | number][];
}>;

export type Field = BaseField & {
  type: InputType;
};

export type SpecialField = BaseField & {
  type: SpecialFieldType;
};

type FieldType = {
  headers?: string[][];
  matrixInputType?: InputType;
};

export type ModalField = BaseField & {
  type?: InputType | SpecialFieldType | "matrix";
  handler?: HandlerCallbackFunction;
} & FieldType;

export type CreateOpts = Omit<RequestInit, "endpoint"> & {
  endpoint: string;
};

export type TargetGroup = {
  id: number;
  name: string;
  min_age: number;
  max_age: number;
};

export type TargetGroupState = {
  target_group_id: number;
  selected: boolean;
  fee: number;
};

export type TargetGroupFee = TargetGroupState & {
  id: number;
};

export type EventType = {
  id: number;
  name: string;
  target_groups: TargetGroupFee[];
  min_age: number;
  max_age: number;
  max_participants: number;
  location: number;
  image: string;
  description: string;
  open_registration: boolean;
};

type StringRecord = Record<string, string>;

export type URIComponents = {
  path?: string;
  query?: boolean;
  params?: StringRecord;
  fragment?: string;
};

export type MatrixGroup = {
  [key in InputType]?: string;
};

export type TaggedData = [
  "target_groups" | "location" | "event_type",
  unknown[]
];

export type Facets = {
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

export type SortableColumns = string[] & { 0: "id" };
