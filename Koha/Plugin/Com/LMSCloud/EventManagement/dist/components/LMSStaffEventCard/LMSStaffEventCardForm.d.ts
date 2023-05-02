import { LitElement } from "lit";
import { Column } from "../../sharedDeclarations";
export default class LMSStaffEventCardForm extends LitElement {
    datum: Column;
    _toast: {
        heading: string;
        message: string;
    };
    collapsibles: NodeListOf<HTMLElement>;
    static styles: import("lit").CSSResult[];
    private handleEdit;
    private processTargetGroupElements;
    private processDatetimeLocalElements;
    private processOpenRegistrationElement;
    private handleSave;
    private handleDelete;
    private toggleCollapse;
    private collapseAll;
    private expandAll;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSStaffEventCardForm.d.ts.map