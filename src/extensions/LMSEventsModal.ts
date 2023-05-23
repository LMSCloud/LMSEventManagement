import { customElement, property, state } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import {
  CreateOpts,
  LMSEventType,
  LMSLocation,
  LMSTargetGroup,
} from "../sharedDeclarations";
import { __ } from "../lib/translate";

@customElement("lms-events-modal")
export default class LMSEventsModal extends LMSModal {
  @property({ type: Object }) override createOpts: CreateOpts = {
    method: "POST",
    endpoint: "/api/v1/contrib/eventmanagement/events",
  };

  @state() selectedEventTypeId: number | undefined = undefined;

  override async connectedCallback() {
    super.connectedCallback();
    this.hydrate();
  }

  private hydrate() {
    this.modalTitle = __("Create Event");
    this.fields = [
      {
        name: "name",
        type: "text",
        desc: __("Name"),
        required: true,
      },
      {
        name: "event_type",
        type: "select",
        desc: __("Event Type"),
        logic: async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/event_types"
          );
          const result = await response.json();
          return result.map((event_type: LMSEventType) => ({
            id: event_type.id,
            name: event_type.name,
          }));
        },
        required: true,
      },
      {
        name: "target_groups",
        type: "matrix",
        headers: [
          ["target_group", "default"],
          ["selected", "checkbox"],
          ["fee", "number"],
        ],
        desc: __("Target Groups"),
        logic: async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/target_groups"
          );
          const result = await response.json();
          return result.map((target_group: LMSTargetGroup) => ({
            id: target_group.id,
            name: target_group.name,
          }));
        },
        required: false,
      },
      {
        name: "min_age",
        type: "number",
        desc: __("Min Age"),
        required: true,
      },
      {
        name: "max_age",
        type: "number",
        desc: __("Max Age"),
        required: true,
      },
      {
        name: "max_participants",
        type: "number",
        desc: __("Max Participants"),
        required: true,
      },
      {
        name: "start_time",
        type: "datetime-local",
        desc: __("Start Time"),
        required: true,
      },
      {
        name: "end_time",
        type: "datetime-local",
        desc: __("End Time"),
        required: true,
      },
      {
        name: "registration_start",
        type: "datetime-local",
        desc: __("Registration Start"),
        required: true,
      },
      {
        name: "registration_end",
        type: "datetime-local",
        desc: __("Registration End"),
        required: true,
      },
      {
        name: "location",
        type: "select",
        desc: __("Location"),
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
      },
      {
        name: "image",
        type: "text",
        desc: __("Image"),
        required: false,
      },
      {
        name: "description",
        type: "text",
        desc: __("Description"),
        required: false,
      },
      {
        name: "status",
        type: "select",
        desc: __("Status"),
        logic: async () => {
          return [
            { id: "pending", name: __("Pending") },
            { id: "confirmed", name: __("Confirmed") },
            { id: "canceled", name: __("Canceled") },
            { id: "sold_out", name: __("Sold Out") },
          ];
        },
        required: true,
      },
      {
        name: "registration_link",
        type: "text",
        desc: __("Registration Link"),
        required: false,
      },
      {
        name: "open_registration",
        type: "checkbox",
        desc: __("Open Registration"),
        required: false,
      },
    ];
  }

  private async fetchEventType(id: number) {
    return fetch(`/api/v1/contrib/eventmanagement/event_types/${id}`)
      .then((response) => response.json())
      .then((event_type) => event_type as LMSEventType);
  }

  private convertFieldValuesToRequestedType(eventType: LMSEventType) {
    const eventTypeFields = Object.entries(eventType);
    eventTypeFields.forEach(([property, value]) => {
      const field = this.fields.find((field) => field.name === property);
      if (field) {
        switch (typeof value) {
          case "number":
            field.value = value.toString();
            break;
          case "boolean":
            field.value = value ? 1 : 0;
            break;
          case "object":
            if (value instanceof Array) {
              field.value = value.map((item) => ({
                id: item.target_group_id.toString(),
                selected: item.selected ? 1 : 0,
                fee: item.fee.toString(),
              }));
            }
            break;
          default:
            field.value = value;
        }
      }
    });
  }

  override willUpdate() {
    const { fields } = this;
    const eventTypeField = fields.find((field) => field.name === "event_type");
    if (eventTypeField) {
      const { dbData } = eventTypeField;
      if (dbData) {
        /** We destructure the default event_type out of the dbData array
         *  to set the selectedEventTypeId state variable. */
        const [event_type] = dbData;
        if (!event_type) return;

        let { id } = event_type;
        /** If the eventTypeField value has changed due to a select element
         *  change event, we use it instead of the default. */
        id = (eventTypeField?.value as string) ?? id;

        const eventType = this.fetchEventType(parseInt(id, 10));

        eventType
          .then((event_type) => {
            const hasValidNewId =
              !this.selectedEventTypeId || this.selectedEventTypeId != id;
            if (hasValidNewId) {
              this.convertFieldValuesToRequestedType(event_type);
              this.selectedEventTypeId =
                typeof id === "string" ? parseInt(id, 10) : id;
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }
}
