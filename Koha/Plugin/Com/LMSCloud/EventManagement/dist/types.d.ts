import { ModalField } from "./interfaces";
export type InputType = "hidden" | "text" | "search" | "tel" | "url" | "email" | "password" | "datetime" | "date" | "month" | "week" | "time" | "datetime-local" | "number" | "range" | "color" | "checkbox" | "radio" | "file" | "submit" | "image" | "reset" | "button";
export type HandlerCallbackFunction = ({ e, value, fields, }: {
    e?: Event;
    value?: string | number;
    fields: ModalField[];
}) => Promise<void>;
//# sourceMappingURL=types.d.ts.map