import { LitElement, TemplateResult } from "lit";
import { MatrixGroup, ModalField } from "../../sharedDeclarations";
type InputHandlerArgs = {
    e: Event;
    id: string | number;
    header: string[];
};
export default class LMSMatrix extends LitElement {
    field: ModalField;
    value: MatrixGroup[];
    static styles: import("lit").CSSResult[];
    render(): TemplateResult<1>;
    handleInput({ e, id, header }: InputHandlerArgs): void;
    private getMatrixInputMarkup;
}
export {};
//# sourceMappingURL=LMSMatrix.d.ts.map