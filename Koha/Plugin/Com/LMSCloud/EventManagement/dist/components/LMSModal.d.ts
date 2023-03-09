import { LitElement, TemplateResult, nothing } from "lit";
import { Gettext } from "gettext.js";
import { CreateOpts, HandlerCallbackFunction, ModalField } from "../interfaces";
import LMSSelect from "./Inputs/LMSSelect";
import LMSCheckboxInput from "./Inputs/LMSCheckboxInput";
import LMSPrimitivesInput from "./Inputs/LMSPrimitivesInput";
import LMSMatrix from "./Inputs/LMSMatrix";
type HandlerExecutorArgs = {
    handler: HandlerCallbackFunction;
    event?: Event;
    value?: string | number;
    requestUpdate: boolean;
};
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
    isOpen: boolean;
    _alertMessage: string;
    _modalTitle: string;
    _i18n: Gettext | Promise<Gettext>;
    hasResolvedEntries: boolean;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    updated(): void;
    private toggleModal;
    private create;
    private dismissAlert;
    render(): typeof nothing | TemplateResult<1>;
    executeHandler({ handler, event, value, requestUpdate, }: HandlerExecutorArgs): void;
    private getFieldMarkup;
}
export {};
//# sourceMappingURL=LMSModal.d.ts.map