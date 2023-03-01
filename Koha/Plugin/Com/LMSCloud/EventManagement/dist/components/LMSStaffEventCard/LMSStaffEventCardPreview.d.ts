import { LitElement } from "lit";
import LMSCard from "../LMSCard";
import { Column } from "../../interfaces";
import TemplateResultConverter from "../../lib/TemplateResultConverter";
declare global {
    interface HTMLElementTagNameMap {
        "lms-card": LMSCard;
    }
}
export default class LMSStaffEventCardPreview extends LitElement {
    datum: Column;
    title: string;
    text: string;
    constants: {
        FIRST_VALUE: number;
    };
    templateResultConverter: TemplateResultConverter;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCardPreview.d.ts.map