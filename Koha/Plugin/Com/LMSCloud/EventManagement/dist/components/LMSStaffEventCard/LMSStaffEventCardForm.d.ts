import { LitElement } from "lit";
import { Column } from "../../sharedDeclarations";
export default class LMSStaffEventCardForm extends LitElement {
    datum: Column;
    _toast: {
        heading: string;
        message: string;
    };
    static styles: import("lit").CSSResult[];
    private handleEdit;
    private handleSave;
    private handleDelete;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCardForm.d.ts.map