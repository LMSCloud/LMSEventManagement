import { customElement, property } from "lit/decorators";
import LMSModal from "../components/LMSModal";
import { CreateOpts, ModalField, TargetGroup } from "../sharedDeclarations";
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
    {
      name: "name",
      type: "text",
      desc: i18n.gettext("Name"),
      required: true,
      value: "",
    },
    {
      name: "target_groups",
      type: "matrix",
      headers: [
        ["target_group", "default"],
        ["selected", "checkbox"],
        ["fee", "number"],
      ],
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
      handler: async ({ e, fields }) => {
        if (!e) {
          return;
        }
        const target = e.target as HTMLInputElement;

        const selectedTargetGroups = Array.from(
          target.closest("table")?.querySelectorAll("input:checked") || []
        ).map((input) => input.parentElement?.previousElementSibling?.id);

        const response = await fetch(
          "/api/v1/contrib/eventmanagement/target_groups"
        );
        const result = await response.json();

        const newTargetGroups: TargetGroup[] = result.filter(
          (target_group: TargetGroup) =>
            selectedTargetGroups.includes(target_group.id.toString())
        );

        const [minAgeField, maxAgeField] = fields.filter(
          ({ name }: { name: string }) => ["min_age", "max_age"].includes(name)
        );
        if (minAgeField)
          minAgeField.value = Math.min(
            ...newTargetGroups.map(({ min_age }) => min_age)
          ).toString();
        if (maxAgeField)
          maxAgeField.value = Math.max(
            ...newTargetGroups.map(({ max_age }) => max_age)
          ).toString();
      },
      required: false,
      value: [],
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
      required: true,
      value: "0",
    },
    {
      name: "max_participants",
      type: "number",
      desc: i18n.gettext("Max Participants"),
      required: true,
      value: "0",
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
      value: [],
    },
    {
      name: "image",
      type: "text",
      desc: i18n.gettext("Image"),
      required: false,
      value: "0",
    },
    {
      name: "description",
      type: "text",
      desc: i18n.gettext("Description"),
      required: false,
      value: "",
    },
    {
      name: "open_registration",
      type: "checkbox",
      desc: i18n.gettext("Open Registration"),
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
