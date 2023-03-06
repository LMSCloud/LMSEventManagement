import { ModalField } from "./interfaces";
export type InputType = "hidden" | "text" | "search" | "tel" | "url" | "email" | "password" | "datetime" | "date" | "month" | "week" | "time" | "datetime-local" | "number" | "range" | "color" | "checkbox" | "radio" | "file" | "submit" | "image" | "reset" | "button";
export type Handler = ({ e, fields, }: {
    e: Event;
    fields: ModalField[];
}) => Promise<void>;
//# sourceMappingURL=types.d.ts.map