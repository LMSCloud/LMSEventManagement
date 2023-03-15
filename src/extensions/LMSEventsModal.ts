import { customElement, property } from "lit/decorators";
import LMSModal from "../components/LMSModal";
import { CreateOpts, EventType, ModalField } from "../sharedDeclarations";

@customElement("lms-events-modal")
export default class LMSEventsModal extends LMSModal {
  @property({ type: Object }) override createOpts: CreateOpts = {
    method: "POST",
    endpoint: "/api/v1/contrib/eventmanagement/events",
  };

  override connectedCallback() {
    super.connectedCallback();
    this.fields = [
      {
        name: "name",
        type: "text",
        desc: "Name",
        required: true,
      },
      {
        name: "event_type",
        type: "select",
        desc: "Event Type",
        logic: async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/event_types"
          );
          const result = await response.json();
          return result.map((event_type: any) => ({
            id: event_type.id,
            name: event_type.name,
          }));
        },
        handler: async ({ e, value, fields }) => {
          const selectedEventType =
            e && e.target instanceof HTMLSelectElement
              ? parseInt(e.target.value, 10)
              : value && typeof value === "number"
              ? value
              : undefined;

          if (selectedEventType === undefined) {
            return;
          }

          const response = await fetch(
            "/api/v1/contrib/eventmanagement/event_types"
          );
          const result = await response.json();

          const newEventType = result.find(
            (event_type: EventType) => event_type.id === selectedEventType
          );

          Object.entries(newEventType).forEach(([key, value]) => {
            const field = fields.find(
              (field: ModalField) => field.name === key
            );
            if (!field) {
              return;
            }

            if (typeof value === "number") {
              field.value = value.toString();
              return;
            }

            if (typeof value === "object" && value !== null) {
              field.value = value as [];
              return;
            }

            field.value = value as string;
          });
        },
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
      },
      {
        name: "min_age",
        type: "number",
        desc: "Min Age",
        required: true,
      },
      {
        name: "max_age",
        type: "number",
        desc: "Max Age",
        required: true,
      },
      {
        name: "max_participants",
        type: "number",
        desc: "Max Participants",
        required: true,
      },
      {
        name: "start_time",
        type: "datetime-local",
        desc: "Start Time",
        required: true,
      },
      {
        name: "end_time",
        type: "datetime-local",
        desc: "End Time",
        required: true,
      },
      {
        name: "registration_start",
        type: "datetime-local",
        desc: "Registration Start",
        required: true,
      },
      {
        name: "registration_end",
        type: "datetime-local",
        desc: "Registration End",
        required: true,
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
          return result.map((location: any) => ({
            id: location.id,
            name: location.name,
          }));
        },
        required: false,
      },
      {
        name: "image",
        type: "text",
        desc: "Image",
        required: false,
      },
      {
        name: "description",
        type: "text",
        desc: "Description",
        required: false,
      },
      {
        name: "status",
        type: "select",
        desc: "Status",
        logic: async () => {
          return [
            { id: "pending", name: "Pending" },
            { id: "confirmed", name: "Confirmed" },
            { id: "canceled", name: "Canceled" },
            { id: "sold_out", name: "Sold Out" },
          ];
        },
        required: true,
      },
      {
        name: "registration_link",
        type: "text",
        desc: "Registration Link",
        required: false,
      },
      {
        name: "open_registration",
        type: "checkbox",
        desc: "Open Registration",
        required: false,
      },
    ];
  }
}
