import { LitElement } from "lit";
import { Column } from "../../interfaces";
import { Gettext } from "gettext.js";
export default class LMSStaffEventCardForm extends LitElement {
    datum: Column;
    _toast: {
        heading: string;
        message: string;
    };
    _i18n: Gettext;
    _mediumEditor: {};
    static styles: import("lit").CSSResult[];
    private handleSave;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCardForm.d.ts.map