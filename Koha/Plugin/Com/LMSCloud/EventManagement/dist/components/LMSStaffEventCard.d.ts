import { LitElement } from "lit";
import { Column } from "../interfaces";
import { Gettext } from "gettext.js";
export default class LMSStaffEventCard extends LitElement {
    datum: Column;
    _toast: {
        heading: string;
        message: string;
    };
    _i18n: Gettext;
    static styles: import("lit").CSSResult[];
    private handleSave;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCard.d.ts.map