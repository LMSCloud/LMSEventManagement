import { LitElement, TemplateResult } from "lit";
import { ModalField } from "../../sharedDeclarations";
export default class LMSMatrix extends LitElement {
    field: ModalField;
    value: {
        [key: string]: string;
    }[];
    hasResolvedEntries: boolean;
    private group;
    private hasTransformedField;
    static styles: import("lit").CSSResult[];
    performUpdate(): void;
    render(): TemplateResult<1>;
    private getMatrixInputMarkup;
    private handleMatrixInput;
}
//# sourceMappingURL=LMSMatrix.d.ts.map