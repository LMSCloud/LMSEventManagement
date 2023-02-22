import { LitElement, nothing, PropertyValueMap } from "lit";
import { Gettext } from "gettext.js";
export default class LMSTable extends LitElement {
    data: never[];
    order: string[];
    _headers: string[];
    _isEditable: boolean;
    _isDeletable: boolean;
    _toast: {
        heading: string;
        message: string;
    };
    _i18n: Gettext;
    _notImplementedInBaseMessage: string;
    static styles: import("lit").CSSResult[];
    private handleEdit;
    private handleSave;
    private handleDelete;
    renderToast(status: string, result: {
        error: string;
        errors: ErrorEvent;
    }): void;
    private sortByOrder;
    private sortColumns;
    protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=LMSTable.d.ts.map