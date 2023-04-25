import { LitElement, PropertyValueMap, TemplateResult } from "lit";
import { Column, TaggedData } from "../sharedDeclarations";
export default class LMSTable extends LitElement {
    data: Column[];
    order: string[];
    private headers;
    protected isEditable: boolean;
    protected isDeletable: boolean;
    private toast;
    private notImplementedInBaseMessage;
    protected emptyTableMessage: TemplateResult<1>;
    private inputConverter;
    static styles: import("lit").CSSResult[];
    handleEdit(e: Event): void;
    handleSave(e: Event): void;
    handleDelete(e: Event): void;
    protected getColumnData(query: Record<string, string | number | boolean | any[]>, data?: TaggedData[]): Generator<(string | TemplateResult<2 | 1>)[], void, unknown>;
    protected renderToast(status: string, result: {
        error: string;
        errors: ErrorEvent;
    }): void;
    private sortByOrder;
    private sortColumns;
    private sortColumnByValue;
    protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    render(): TemplateResult<1>;
}
//# sourceMappingURL=LMSTable.d.ts.map