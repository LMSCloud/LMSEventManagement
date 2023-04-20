import { TemplateResult } from "lit";
import { DirectiveResult } from "lit/directive";
import { TranslateDirective } from "./lib/translate";

export type InputType =
  | "hidden"
  | "text"
  | "search"
  | "tel"
  | "url"
  | "email"
  | "password"
  | "datetime"
  | "date"
  | "month"
  | "week"
  | "time"
  | "datetime-local"
  | "number"
  | "range"
  | "color"
  | "checkbox"
  | "radio"
  | "file"
  | "submit"
  | "image"
  | "reset"
  | "button";

export type HandlerCallbackFunction = ({
  e,
  value,
  fields,
}: {
  e?: Event;
  value?: string | number;
  fields: ModalField[];
}) => Promise<void>;

export enum Status {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Canceled = "Canceled",
  SoldOut = "Sold Out",
}

export type Column = {
  [key: string]: string | number | TemplateResult;
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

export type SelectOption = {
  id: string | number;
  name: string | DirectiveResult<typeof TranslateDirective>;
};

export type BaseField = {
  name: string;
  desc?: string | DirectiveResult<typeof TranslateDirective>;
  logic?: () => Promise<{ id: string | number; name: string | DirectiveResult<typeof TranslateDirective> }[]>;
  required?: boolean;
  value?: string | { [key: string]: string }[];
  dbData?: { id: string | number; name: string | DirectiveResult<typeof TranslateDirective> }[];
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
  headers?: string[][];
  matrixInputType?: InputType;
  handler?: HandlerCallbackFunction;
};

export type CreateOpts = RequestInit & {
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

export type TargetGroupFee = {
  id: number;
  target_group_id: number;
  selected: boolean;
  fee: number;
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

export type URIComponents = {
  path?: string;
  query?: boolean;
  params?: Record<string, string>;
  fragment?: string;
};

export type MatrixGroup = {
  [key: string]: string;
};
