import { LitElement, TemplateResult } from "lit";
import { Gettext } from "gettext.js";
import { CreateOpts, ModalField } from "../interfaces";
export default class LMSModal extends LitElement {
    fields: ModalField[];
    createOpts: CreateOpts;
    editable: boolean;
    isOpen: boolean;
    _alertMessage: string;
    _modalTitle: string;
    _i18n: Gettext | Promise<Gettext>;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    updated(): void;
    private toggleModal;
    private create;
    private dismissAlert;
    render(): TemplateResult<1>;
    private getFieldMarkup;
    private moveOnOverlap;
}
//# sourceMappingURL=LMSModal.d.ts.map