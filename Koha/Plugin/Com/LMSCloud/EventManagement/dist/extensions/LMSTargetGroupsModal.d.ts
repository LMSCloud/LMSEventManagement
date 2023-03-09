import LMSModal from "../components/LMSModal";
import { CreateOpts, Field } from "../sharedDeclarations";
import { Gettext } from "gettext.js";
export default class LMSTargetGroupsModal extends LMSModal {
    createOpts: CreateOpts;
    modalFields: (i18n: Gettext) => Field[];
    connectedCallback(): void;
}
//# sourceMappingURL=LMSTargetGroupsModal.d.ts.map