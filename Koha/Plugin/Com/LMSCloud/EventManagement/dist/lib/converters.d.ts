export declare class TemplateResultConverter {
    private _templateResult;
    constructor(templateResult: unknown);
    set templateResult(templateResult: unknown);
    getRenderString(data?: unknown): string;
    getRenderValues(data?: unknown): unknown[];
}
export declare function convertToFormat(string: string, format: string, locale: string): string;
//# sourceMappingURL=converters.d.ts.map