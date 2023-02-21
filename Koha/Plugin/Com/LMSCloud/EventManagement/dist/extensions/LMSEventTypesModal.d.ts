import LMSModal from "../components/LMSModal";
import { CreateOpts, Field } from "../interfaces";
import { Gettext } from "gettext.js";
export default class LMSEventTypesModal extends LMSModal {
    createOpts: CreateOpts;
    modalFields: (i18n: Gettext) => Field[];
    connectedCallback(): void;
}
//# sourceMappingURL=LMSEventTypesModal.d.ts.map