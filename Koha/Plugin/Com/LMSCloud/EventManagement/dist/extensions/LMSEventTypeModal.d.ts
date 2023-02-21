import LMSModal from "../components/LMSModal";
import { CreateOpts, Field } from "../interfaces";
import { Gettext } from "gettext.js";
export default class LMSEventTypeModal extends LMSModal {
    createOpts: CreateOpts;
    modalFields: (i18n: Gettext) => Field[];
    connectedCallback(): void;
}
//# sourceMappingURL=LMSEventTypeModal.d.ts.map