import { customElement, property } from "lit/decorators";
import LMSModal from "../components/LMSModal";
import { CreateOpts, Field } from "../interfaces";
import { Gettext } from "gettext.js";

@customElement("lms-event-types-modal")
export default class LMSEventTypesModal extends LMSModal {
  @property({ type: Object }) override createOpts: CreateOpts = {
    method: "POST",
    endpoint: "/api/v1/contrib/eventmanagement/event_types",
  };
  @property({ type: Function, attribute: false }) modalFields = (
    i18n: Gettext
  ): Field[] => [
    {
      name: "name",
      type: "text",
      desc: i18n.gettext("Name"),
      required: true,
    },
    {
      name: "target_group",
      type: "text",
      desc: i18n.gettext("Target Group"),
      required: true,
    },
    {
      name: "max_age",
      type: "number",
      desc: i18n.gettext("Max Age"),
      required: true,
    },
    {
      name: "min_age",
      type: "number",
      desc: i18n.gettext("Min Age"),
      required: true,
    },
    {
      name: "open_registration",
      type: "checkbox",
      desc: i18n.gettext("Open Registration"),
      required: false,
    },
    { name: "id", type: "number", required: true },
    {
      name: "fee",
      type: "number",
      desc: i18n.gettext("Fee"),
      required: false,
      // logic: async () => {
      //   const response = await fetch("/api/v1/libraries");
      //   const result = await response.json();
      //   return result.map((library: any) => ({
      //     value: library.library_id,
      //     name: library.name,
      //   }));
      // },
      attributes: [["step", 0.01]],
    },
    {
      name: "description",
      type: "text",
      desc: i18n.gettext("Description"),
      required: false,
    },
    {
      name: "image",
      type: "text",
      desc: i18n.gettext("Image"),
      required: false,
    },
    {
      name: "location",
      type: "text",
      desc: i18n.gettext("Location"),
      required: false,
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
