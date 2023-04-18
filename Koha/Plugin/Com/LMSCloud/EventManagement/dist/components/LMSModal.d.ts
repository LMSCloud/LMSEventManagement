import { LitElement, TemplateResult } from "lit";
import { CreateOpts, ModalField } from "../sharedDeclarations";
import LMSSelect from "./Inputs/LMSSelect";
import LMSCheckboxInput from "./Inputs/LMSCheckboxInput";
import LMSPrimitivesInput from "./Inputs/LMSPrimitivesInput";
import LMSMatrix from "./Inputs/LMSMatrix";
import { TranslationHandler } from "../lib/TranslationHandler";
import { Gettext } from "gettext.js";
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
    protected i18n: Gettext;
    protected translationHandler: TranslationHandler;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    private toggleModal;
    private create;
    private dismissAlert;
    firstUpdated(): void;
    render(): TemplateResult<1>;
    protected mediateChange(e: CustomEvent): void;
    private getFieldMarkup;
}
//# sourceMappingURL=LMSModal.d.ts.map