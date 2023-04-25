import { customElement, property } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import { CreateOpts } from "../sharedDeclarations";
import { __ } from "../lib/translate";

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
        required: true,
        value: "",
      },
      {
        name: "min_age",
        type: "number",
        desc: __("Min Age"),
        required: true,
        value: "0",
      },
      {
        name: "max_age",
        type: "number",
        desc: __("Max Age"),
        required: false,
        value: "0",
      },
    ];
  }
}
