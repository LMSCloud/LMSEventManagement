import LMSModal from "../components/LMSModal";
import { CreateOpts, ModalField } from "../sharedDeclarations";
import { Gettext } from "gettext.js";
export default class LMSEventsModal extends LMSModal {
    createOpts: CreateOpts;
    modalFields: (i18n: Gettext) => ModalField[];
    connectedCallback(): void;
}
//# sourceMappingURL=LMSEventsModal.d.ts.map