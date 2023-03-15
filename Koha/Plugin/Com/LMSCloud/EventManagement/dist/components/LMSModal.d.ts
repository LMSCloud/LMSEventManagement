import { LitElement, TemplateResult } from "lit";
import { CreateOpts, ModalField } from "../sharedDeclarations";
import LMSSelect from "./Inputs/LMSSelect";
import LMSCheckboxInput from "./Inputs/LMSCheckboxInput";
import LMSPrimitivesInput from "./Inputs/LMSPrimitivesInput";
import LMSMatrix from "./Inputs/LMSMatrix";
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
    protected modalTitle: string;
    static styles: import("lit").CSSResult[];
    /** What's the best place to fetch data asynchronously before a render in a LitElement */
    private toggleModal;
    private create;
    private dismissAlert;
    firstUpdated(): void;
    render(): TemplateResult<1>;
    private getFieldMarkup;
}
//# sourceMappingURL=LMSModal.d.ts.map