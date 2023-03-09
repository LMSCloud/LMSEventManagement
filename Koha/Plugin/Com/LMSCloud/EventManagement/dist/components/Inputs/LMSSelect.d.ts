import { LitElement, nothing } from "lit";
import { ModalField } from "../../interfaces";
import LMSModal from "../LMSModal";
export default class LMSSelect extends LitElement {
    field: ModalField;
    outerScope: LMSModal;
    hasResolvedEntries: boolean;
    static styles: import("lit").CSSResult[];
    render(): typeof nothing | import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSSelect.d.ts.map