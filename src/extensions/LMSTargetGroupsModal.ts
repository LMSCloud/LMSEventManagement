import { customElement, property } from "lit/decorators";
import LMSModal from "../components/LMSModal";
import { CreateOpts, Field } from "../sharedDeclarations";
import { Gettext } from "gettext.js";

@customElement("lms-target-groups-modal")
export default class LMSTargetGroupsModal extends LMSModal {
  @property({ type: Object }) override createOpts: CreateOpts = {
    method: "POST",
    endpoint: "/api/v1/contrib/eventmanagement/target_groups",
  };
  @property({ type: Function, attribute: false }) modalFields = (
    i18n: Gettext
  ): Field[] => [
    {
      name: "name",
      type: "text",
      desc: i18n.gettext("Name"),
      required: true,
      value: "",
    },
    {
      name: "min_age",
      type: "number",
      desc: i18n.gettext("Min Age"),
      required: true,
      value: "0",
    },
    {
      name: "max_age",
      type: "number",
      desc: i18n.gettext("Max Age"),
      required: false,
      value: "0",
    },
  ];

  override connectedCallback() {
    super.connectedCallback();

    if (this._i18n instanceof Promise) {
      this.fields = [];
      this._i18n.then((i18n) => {
        this.fields = this.modalFields(i18n);
      });
      return;
    }

    this.fields = this.modalFields(this._i18n);
  }
}
