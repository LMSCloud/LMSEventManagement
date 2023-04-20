import { customElement, property, state } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import { CreateOpts, EventType } from "../sharedDeclarations";
import { __ } from "../lib/translate";
import { TranslationController } from "../lib/TranslationController";

@customElement("lms-events-modal")
export default class LMSEventsModal extends LMSModal {
  @property({ type: Object }) override createOpts: CreateOpts = {
    method: "POST",
    endpoint: "/api/v1/contrib/eventmanagement/events",
  };
  @state() private selectedEventTypeId: number | undefined = undefined;

  override async connectedCallback() {
    super.connectedCallback();

    TranslationController.getInstance().loadTranslations(() => {
      console.log("Translations loaded");
    });

    this.hydrate();
  }

  private hydrate() {
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
          return result.map((event_type: any) => ({
            id: event_type.id,
            name: event_type.name,
          }));
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
        desc: __("Target Groups"),
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

  override willUpdate() {
    const { fields } = this;
    const eventTypeField = fields.find((field) => field.name === "event_type");
    if (eventTypeField) {
      const { dbData } = eventTypeField;
      if (dbData) {
        /** We destructure the default event_type out of the dbData array
         *  to set the selectedEventTypeId state variable. */
        const [event_type] = dbData;
        let { id } = event_type;

        /** If the eventTypeField value has changed due to a select element
         *  change event, we use it instead of the default. */
        id = (eventTypeField?.value as string) ?? id;

        const result = async () => {
          const response = await fetch(
            `/api/v1/contrib/eventmanagement/event_types/${id}`
          );

          if (response.ok) {
            return response.json() as unknown as EventType;
          }

          const error = await response.json();
          return error as Error;
        };

        result()
          .then((event_type) => {
            if (event_type instanceof Error) {
              return;
            }

            if (!this.selectedEventTypeId || this.selectedEventTypeId != id) {
              Object.entries(event_type).forEach(([property, value]) => {
                const field = fields.find((field) => field.name === property);
                if (field) {
                  switch (typeof value) {
                    case "number":
                      field.value = value.toString();
                      break;
                    case "boolean":
                      field.value = (value ? 1 : 0).toString();
                      break;
                    case "object":
                      if (value instanceof Array) {
                        field.value = value.map((item) => ({
                          id: item.target_group_id.toString(),
                          selected: (item.selected ? 1 : 0).toString(),
                          fee: item.fee.toString(),
                        }));
                      }
                      break;
                    default:
                      field.value = value;
                  }
                }
              });

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
