import { TemplateResult } from "lit";
import { TaggedData, InputType, TargetGroupFee } from "../sharedDeclarations";
type InputTypeValue = string | number | boolean | TargetGroupFee[];
type TemplateQuery = {
    name: string;
    value: InputType | InputTypeValue;
    data?: TaggedData[];
};
export declare class TemplateResultConverter {
    private _templateResult;
    constructor(templateResult: unknown);
    set templateResult(templateResult: unknown);
    getRenderString(data?: unknown): string;
    getRenderValues(data?: unknown): unknown[];
}
export declare function convertToFormat(string: string, format: string, locale: string): string;
export declare class InputConverter {
    private conversionMap;
    constructor();
    private toggleCollapse;
    private needsData;
    getInputTemplate({ name, value, data, }: TemplateQuery): TemplateResult;
    private findDataByName;
    private renderValue;
    private renderError;
}
export {};
//# sourceMappingURL=converters.d.ts.map