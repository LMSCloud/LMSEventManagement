import { Column } from "../../sharedDeclarations";
import { LitElement } from "lit";
export default class LMSStaffEventCardForm extends LitElement {
    datum: Column;
    _toast: {
        heading: string;
        message: string;
    };
    collapsibles: NodeListOf<HTMLElement>;
    inputs: NodeListOf<HTMLInputElement>;
    static styles: import("lit").CSSResult[];
    private toggleEdit;
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