import { customElement, property, state } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import { __, attr__ } from "../lib/translate";
import {
  CreateOpts,
  LMSEventType,
  LMSLocation,
  LMSTargetGroup,
  ModalField,
} from "../sharedDeclarations";
import { PropertyValueMap } from "lit";

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
        placeholder: attr__("Name of the event, e.g. 'Concert' or 'Workshop'."),
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
        placeholder: attr__("Minimum age of the target groups, e.g. '18'."),
        required: true,
      },
      {
        name: "max_age",
        type: "number",
        desc: __("Max Age"),
        placeholder: attr__("Maximum age of the target groups, e.g. '99'."),
        required: true,
      },
      {
        name: "max_participants",
        type: "number",
        desc: __("Max Participants"),
        placeholder: attr__("Maximum number of participants, e.g. '100'."),
        required: true,
      },
      {
        name: "start_time",
        type: "datetime-local",
        desc: __("Start Time"),
        placeholder: attr__(
          "Start time of the event, e.g. '2023-01-01 10:00'."
        ),
        required: true,
      },
      {
        name: "end_time",
        type: "datetime-local",
        desc: __("End Time"),
        placeholder: attr__("End time of the event, e.g. '2023-01-01 12:00'."),
        required: true,
      },
      {
        name: "registration_start",
        type: "datetime-local",
        desc: __("Registration Start"),
        placeholder: attr__(
          "Registration start time, e.g. '2023-01-01 08:00'."
        ),
        required: true,
      },
      {
        name: "registration_end",
        type: "datetime-local",
        desc: __("Registration End"),
        placeholder: attr__("Registration end time, e.g. '2023-01-01 09:00'."),
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
        placeholder: attr__("Image URL, e.g. 'https://example.com/image.png'."),
        required: false,
      },
      {
        name: "description",
        type: "text",
        desc: __("Description"),
        placeholder: attr__(
          "Description of the event, e.g. 'This is a concert.'."
        ),
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
        placeholder: attr__("Registration link, e.g. 'https://example.com'."),
        required: false,
      },
      {
        name: "open_registration",
        type: "checkbox",
        desc: __("Open Registration"),
        required: false,
        value: 1,
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

  override willUpdate(changedProperties: PropertyValueMap<never>) {
    super.willUpdate(changedProperties);

    const eventTypeField = this.findEventTypeField();

    if (!eventTypeField) return;

    const dbDataExists = eventTypeField.dbData && eventTypeField.dbData[0];

    if (!dbDataExists) return;

    const id = this.determineId(eventTypeField);

    if (!changedProperties.has("selectedEventTypeId")) {
      this.fetchAndUpdateEventType(id);
    }
  }

  private findEventTypeField() {
    const { fields } = this;
    return fields.find((field) => field.name === "event_type");
  }

  private determineId(eventTypeField: ModalField) {
    const { dbData } = eventTypeField;
    if (!dbData) return;

    const [{ id: defaultId }] = dbData;
    const selectedId = eventTypeField.value ?? defaultId;
    return parseInt(selectedId.toString(), 10);
  }

  private fetchAndUpdateEventType(id: number | undefined) {
    if (!id) return;

    this.fetchEventType(id)
      .then((event_type) => {
        const isNewId =
          !this.selectedEventTypeId || this.selectedEventTypeId !== id;
        if (isNewId) {
          this.convertFieldValuesToRequestedType(event_type);
          this.selectedEventTypeId = id;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
