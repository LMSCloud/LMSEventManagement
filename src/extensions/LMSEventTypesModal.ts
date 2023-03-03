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
      name: "target_groups",
      type: "matrix",
      headers: [["target_group", "default"], ["selected", "checkbox"], ["fee", "number"]],
      desc: i18n.gettext("Target Groups"),
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
