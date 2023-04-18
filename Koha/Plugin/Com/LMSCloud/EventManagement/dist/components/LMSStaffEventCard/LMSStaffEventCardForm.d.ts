import { LitElement } from "lit";
import { Column } from "../../sharedDeclarations";
import { Gettext } from "gettext.js";
export default class LMSStaffEventCardForm extends LitElement {
    datum: Column;
    _toast: {
        heading: string;
        message: string;
    };
    _i18n: Gettext;
    protected i18n: Gettext;
    private translationHandler;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    private handleEdit;
    private handleSave;
    private handleDelete;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCardForm.d.ts.map