import LMSModal from "../components/LMSModal";
import { CreateOpts, Field } from "../sharedDeclarations";
import { Gettext } from "gettext.js";
export default class LMSLocationsModal extends LMSModal {
    createOpts: CreateOpts;
    modalFields: (i18n: Gettext) => Field[];
    connectedCallback(): void;
}
//# sourceMappingURL=LMSLocationsModal.d.ts.map