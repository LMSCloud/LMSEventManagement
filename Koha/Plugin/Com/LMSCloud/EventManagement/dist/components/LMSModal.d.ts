import { LitElement, TemplateResult } from "lit";
import { CreateOpts, ModalField } from "../sharedDeclarations";
import LMSSelect from "./Inputs/LMSSelect";
import LMSCheckboxInput from "./Inputs/LMSCheckboxInput";
import LMSPrimitivesInput from "./Inputs/LMSPrimitivesInput";
import LMSMatrix from "./Inputs/LMSMatrix";
import { TranslateDirective } from "../lib/translate";
import { DirectiveResult } from "lit/directive";
declare global {
    interface HTMLElementTagNameMap {
        "lms-select": LMSSelect;
        "lms-checkbox-input": LMSCheckboxInput;
        "lms-primitives-input": LMSPrimitivesInput;
        "lms-matrix": LMSMatrix;
    }
}
export default class LMSModal extends LitElement {
    fields: ModalField[];
    createOpts: CreateOpts;
    editable: boolean;
    protected isOpen: boolean;
    protected alertMessage: string;
    protected modalTitle: string | DirectiveResult<typeof TranslateDirective>;
    static styles: import("lit").CSSResult[];
    private toggleModal;
    private create;
    private dismissAlert;
    firstUpdated(): void;
    render(): TemplateResult<1>;
    protected mediateChange(e: CustomEvent): void;
    private getFieldMarkup;
    initIntersectionObserver(): void;
}
//# sourceMappingURL=LMSModal.d.ts.map