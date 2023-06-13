import { customElement, property } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import { attr__, __ } from "../lib/translate";
import { CreateOpts } from "../sharedDeclarations";

@customElement("lms-target-groups-modal")
export default class LMSTargetGroupsModal extends LMSModal {
    @property({ type: Object }) override createOpts: CreateOpts = {
        method: "POST",
        endpoint: "/api/v1/contrib/eventmanagement/target_groups",
    };

    override connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    private hydrate() {
        this.modalTitle = __("Create Target Group");
        this.fields = [
            {
                name: "name",
                type: "text",
                desc: __("Name"),
                placeholder: attr__(
                    "Name of the target group, e.g. 'Children' or 'Adults'."
                ),
                required: true,
                value: "",
            },
            {
                name: "min_age",
                type: "number",
                desc: __("Min Age"),
                placeholder: attr__(
                    "Minimum age of the target group, e.g. '18'."
                ),
                required: true,
                value: "",
            },
            {
                name: "max_age",
                type: "number",
                desc: __("Max Age"),
                placeholder: attr__(
                    "Maximum age of the target group, e.g. '99'."
                ),
                required: false,
                value: "",
            },
        ];
    }
}
