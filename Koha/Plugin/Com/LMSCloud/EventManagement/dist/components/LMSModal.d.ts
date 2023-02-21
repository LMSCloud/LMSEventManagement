import { LitElement, TemplateResult } from "lit";
import { Gettext } from "gettext.js";
import { CreateOpts, Field } from "../interfaces";
export default class LMSModal extends LitElement {
    fields: Field[];
    createOpts: CreateOpts;
    editable: boolean;
    isOpen: boolean;
    _alertMessage: string;
    _modalTitle: string;
    _i18n: Gettext | Promise<Gettext>;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    updated(): void;
    _toggleModal(): void;
    _create(e: Event): Promise<void>;
    _dismissAlert(): void;
    render(): TemplateResult<1>;
    _getFieldMarkup(field: Field): TemplateResult<1 | 2> | undefined;
    _moveOnOverlap(): void;
}
//# sourceMappingURL=LMSModal.d.ts.map