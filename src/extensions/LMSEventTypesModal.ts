import { customElement, property } from "lit/decorators";
import LMSModal from "../components/LMSModal";
import { CreateOpts, ModalField } from "../interfaces";
import { Gettext } from "gettext.js";

@customElement("lms-event-types-modal")
export default class LMSEventTypesModal extends LMSModal {
  @property({ type: Object }) override createOpts: CreateOpts = {
    method: "POST",
    endpoint: "/api/v1/contrib/eventmanagement/event_types",
  };
  @property({ type: Function, attribute: false }) modalFields = (
    i18n: Gettext
  ): ModalField[] => [
    { name: "id", type: "number", required: true },
    {
      name: "name",
      type: "text",
      desc: i18n.gettext("Name"),
      required: true,
    },
    {
      name: "target_group",
      type: "select",
      desc: i18n.gettext("Target Group"),
      logic: async () => {
        const response = await fetch(
          "/api/v1/contrib/eventmanagement/target_groups"
        );
        const result = await response.json();
        return result.map((target_group: any) => ({
          value: target_group.id,
          name: target_group.name,
        }));
      },
      required: true,
    },
    {
      name: "min_age",
      type: "number",
      desc: i18n.gettext("Min Age"),
      required: true,
    },
    {
      name: "max_age",
      type: "number",
      desc: i18n.gettext("Max Age"),
      required: true,
    },
    {
      name: "max_participants",
      type: "number",
      desc: i18n.gettext("Max Participants"),
      required: true,
    },
    {
      name: "fees",
      type: "matrix",
      headers: ["target_group", "fee"],
      desc: i18n.gettext("Fees"),
      logic: async () => {
        const response = await fetch(
          "/api/v1/contrib/eventmanagement/target_groups"
        );
        const result = await response.json();
        return result.map((target_group: any) => ({
          value: target_group.id,
          name: target_group.name,
        }));
      },
      required: false,
      attributes: [["step", 0.01]],
    },
    {
      name: "location",
      type: "select",
      desc: i18n.gettext("Location"),
      logic: async () => {
        const response = await fetch(
          "/api/v1/contrib/eventmanagement/locations"
        );
        const result = await response.json();
        return result.map((location: any) => ({
          value: location.id,
          name: location.name,
        }));
      },
      required: false,
    },
    {
      name: "image",
      type: "text",
      desc: i18n.gettext("Image"),
      required: false,
    },
    {
      name: "description",
      type: "text",
      desc: i18n.gettext("Description"),
      required: false,
    },
    {
      name: "open_registration",
      type: "checkbox",
      desc: i18n.gettext("Open Registration"),
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
