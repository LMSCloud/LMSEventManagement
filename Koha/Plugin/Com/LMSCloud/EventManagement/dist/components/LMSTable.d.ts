import { LitElement, nothing } from "lit";
import { Gettext } from "gettext.js";
export default class LMSTable extends LitElement {
    data: never[];
    _isEditable: boolean;
    _isDeletable: boolean;
    _toast: {
        heading: string;
        message: string;
    };
    _i18n: Gettext;
    _notImplementedInBaseMessage: string;
    static styles: import("lit").CSSResult[];
    _init(): Promise<void>;
    _handleEdit(): void;
    _handleSave(): void;
    _handleDelete(): void;
    _renderToast(status: string, result: {
        error: string;
        errors: ErrorEvent;
    }): void;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=LMSTable.d.ts.map