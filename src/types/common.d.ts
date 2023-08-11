import { TemplateResult } from "lit";
import { DirectiveResult } from "lit/directive";
import { TranslateDirective } from "../lib/translate";

/* Utility types */

export type Column = Record<string, ColumnValue>;

type ColumnValue = string | number | TemplateResult;

export type ComprehensiveInputType = InputType | SpecialFieldType | "matrix";

export type CreateOpts = Omit<RequestInit, "endpoint"> & {
    endpoint: string;
};

export type Facets = {
    description: string;
    end_time: Date;
    eventTypeIds: Array<number | null>;
    id: number;
    image: string;
    locationIds: Array<number | null>;
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
    targetGroupIds: Array<number | null>;
};

export type Image = {
    src: string;
    alt: string;
};

export type Input = {
    name: string;
    value: string;
};

export type InputElement =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;

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
    | "info"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "select"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";

export type InputTypeValue =
    | string
    | number
    | boolean
    | Array<unknown>
    | Record<string, unknown>
    | null;

export type KohaAPIError = Record<"message" | "path", string>;

export type MatrixGroup = {
    id: string;
    [key: string]: string | number | boolean;
};

export type ModalField = {
    name: string;
    type: ComprehensiveInputType;
    desc: string | TranslatedString;
    placeholder?: string | TranslatedString;
    required?: boolean;
    value?:
        | string
        | number
        | boolean
        | Array<unknown>
        | Record<string, unknown>;
    headers?: Array<Array<string>>;
};

export type SelectOption = {
    id: string | number;
    name: string | TranslatedString;
};

export type SortableColumns = Array<string> & { 0: "id" };

export type SpecialFieldType = "checkbox" | "info" | "select";

type StringRecord = Record<string, string>;

export type TaggedColumn = Column & {
    uuid: string;
};

export type TaggedData = [
    "target_groups" | "location" | "event_type" | "image" | "status",
    Array<unknown>
];

export type Toast = {
    heading: string | TemplateResult;
    message: string | TemplateResult;
};

export type TranslatedString = DirectiveResult<typeof TranslateDirective>;

export type UploadedImage = {
    image: string;
    metadata: {
        dtcreated: string;
        id: number;
        permanent: number;
        dir: string;
        public: number;
        filename: string;
        uploadcategorycode: string;
        owner: number;
        hashvalue: string;
        filesize: number;
    };
};

export type URIComponents = {
    path?: string;
    query?: boolean;
    params?: StringRecord;
    fragment?: string;
};

/* Data: These interfaces represent the schema of the underlying database */
export type LMSSettingResponse = {
    plugin_key:
        | "__ENABLED__"
        | "__INSTALLED__"
        | "__INSTALLED_VERSION__"
        | "opac_filters_age_enabled"
        | "opac_filters_registration_and_dates_enabled"
        | "opac_filters_fee_enabled";
    plugin_value:
        | string
        | number
        | boolean
        | Array<unknown>
        | Record<string, unknown>;
};

export type LMSSettingObj = Record<
    | "opac_filters_age_enabled"
    | "opac_filters_registration_and_dates_enabled"
    | "opac_filters_fee_enabled",
    string | number | boolean | Array<unknown> | Record<string, unknown>
>;

export interface LMSTargetGroup {
    id: number;
    name: string | null;
    min_age: number | null;
    max_age: number | null;
}

export interface LMSLocation {
    id: number;
    name: string | null;
    street: string | null;
    number: string | null;
    city: string | null;
    zip: string | null;
    country: string | null;
    link: string | null;
}

export interface LMSEventType {
    id: number;
    name: string | null;
    min_age: number | null;
    max_age: number | null;
    max_participants: number | null;
    location: number | null;
    image: string | null;
    description: string | null;
    open_registration: number | null;
}

export interface LMSEventTypeTargetGroupFee extends LMSEvent {
    target_groups: Array<
        Omit<LMSEventTypeTargetGroupFee, "id"> & { target_group_id: number }
    >;
}

export interface LMSEvent {
    id: number;
    name: string | null;
    event_type: number | null;
    min_age: number | null;
    max_age: number | null;
    max_participants: number | null;
    start_time: Date | null;
    end_time: Date | null;
    registration_start: Date | null;
    registration_end: Date | null;
    location: number | null;
    image: string | null;
    description: string | null;
    status: "pending" | "confirmed" | "canceled" | "sold_out" | null;
    registration_link: string | null;
    open_registration: boolean | null;
}

export interface LMSEventTargetGroupState extends LMSEvent {
    target_groups: Array<Omit<LMSEventTargetGroupFee, "id" | "event_id">>;
}

export interface LMSEventTargetGroupFee extends LMSEvent {
    target_groups: Array<
        Omit<LMSEventTargetGroupFee, "id" | "target_group_id"> & { id: number }
    >;
}

export interface LMSEventComprehensive
    extends Omit<LMSEvent, "location" | "event_type"> {
    target_groups: Array<Omit<LMSEventTargetGroupFee, "id"> & { id: number }>;
    location: LMSLocation;
    event_type: LMSEventType;
}

export interface LMSEventTargetGroupFee {
    id: number;
    event_id: number | null;
    target_group_id: number | null;
    selected: boolean | null;
    fee: number | null;
}

export type LMSEventTargetGroupFeeReduced = Pick<
    LMSEventTargetGroupFee,
    "id" | "selected" | "fee"
>;
export interface LMSEventTypeTargetGroupFee {
    id: number;
    event_type_id: number | null;
    target_group_id: number | null;
    selected: boolean | null;
    fee: number | null;
}
