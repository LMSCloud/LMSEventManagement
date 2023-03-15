import { customElement, property } from "lit/decorators";
import LMSModal from "../components/LMSModal";
import { CreateOpts, LMSLocation } from "../sharedDeclarations";

@customElement("lms-event-types-modal")
export default class LMSEventTypesModal extends LMSModal {
  @property({ type: Object }) override createOpts: CreateOpts = {
    method: "POST",
    endpoint: "/api/v1/contrib/eventmanagement/event_types",
  };

  override connectedCallback() {
    super.connectedCallback();
    this.fields = [
      {
        name: "name",
        type: "text",
        desc: "Name",
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
        desc: "Target Groups",
        logic: async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/target_groups"
          );
          const result = await response.json();
          return result.map((target_group: any) => ({
            id: target_group.id,
            name: target_group.name,
          }));
        },
        required: false,
        value: [],
      },
      {
        name: "min_age",
        type: "number",
        desc: "Min Age",
        required: true,
        value: "0",
      },
      {
        name: "max_age",
        type: "number",
        desc: "Max Age",
        required: true,
        value: "0",
      },
      {
        name: "max_participants",
        type: "number",
        desc: "Max Participants",
        required: true,
        value: "0",
      },
      {
        name: "location",
        type: "select",
        desc: "Location",
        logic: async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/locations"
          );
          const result = await response.json();
          return result.map((location: LMSLocation) => ({
            id: location.id,
            name: location.name,
          }));
        },
        required: false,
        value: [],
      },
      {
        name: "image",
        type: "text",
        desc: "Image",
        required: false,
        value: "0",
      },
      {
        name: "description",
        type: "text",
        desc: "Description",
        required: false,
        value: "",
      },
      {
        name: "open_registration",
        type: "checkbox",
        desc: "Open Registration",
        required: false,
        value: "0",
      },
    ];
  }
}
