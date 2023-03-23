import { LitElement, PropertyValueMap } from "lit";
import { Column } from "../sharedDeclarations";
export default class LMSTable extends LitElement {
    data: Column[];
    order: string[];
    private headers;
    protected isEditable: boolean;
    protected isDeletable: boolean;
    private toast;
    private notImplementedInBaseMessage;
    protected emptyTableMessage: import("lit").TemplateResult<1>;
    static styles: import("lit").CSSResult[];
    handleEdit(e: Event): void;
    handleSave(e: Event): void;
    handleDelete(e: Event): void;
    renderToast(status: string, result: {
        error: string;
        errors: ErrorEvent;
    }): void;
    private sortByOrder;
    private sortColumns;
    private sortColumnByValue;
    protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSTable.d.ts.map