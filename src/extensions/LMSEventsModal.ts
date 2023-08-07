import { PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import { attr__, __ } from "../lib/translate";
import {
    CreateOpts,
    LMSEvent,
    LMSEventTargetGroupFee,
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    UploadedImage,
} from "../types/common";

@customElement("lms-events-modal")
export default class LMSEventsModal extends LMSModal {
    @property({ type: Array }) events: LMSEvent[] = [];

    @property({ type: Array }) event_types: LMSEventType[] = [];

    @property({ type: Array }) target_groups: LMSTargetGroup[] = [];

    @property({ type: Array }) locations: LMSLocation[] = [];

    @property({ type: Array }) images: UploadedImage[] = [];

    @property({ type: Object }) override createOpts: CreateOpts = {
        method: "POST",
        endpoint: "/api/v1/contrib/eventmanagement/events",
    };

    @query('select[name="event_type"]') eventTypeSelect!: HTMLSelectElement;

    private boundUpdateFieldsOnEventTypeChange =
        this.updateFieldsOnEventTypeChange.bind(this);

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
                placeholder: attr__(
                    "Name of the event, e.g. 'Concert' or 'Workshop'."
                ),
                required: true,
            },
            {
                name: "event_type",
                type: "select",
                desc: __("Event Type"),
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
                required: false,
            },
            {
                name: "min_age",
                type: "number",
                desc: __("Min Age"),
                placeholder: attr__(
                    "Minimum age of the target groups, e.g. '18'."
                ),
                required: true,
            },
            {
                name: "max_age",
                type: "number",
                desc: __("Max Age"),
                placeholder: attr__(
                    "Maximum age of the target groups, e.g. '99'."
                ),
                required: true,
            },
            {
                name: "max_participants",
                type: "number",
                desc: __("Max Participants"),
                placeholder: attr__(
                    "Maximum number of participants, e.g. '100'."
                ),
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
                placeholder: attr__(
                    "End time of the event, e.g. '2023-01-01 12:00'."
                ),
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
                placeholder: attr__(
                    "Registration end time, e.g. '2023-01-01 09:00'."
                ),
                required: true,
            },
            {
                name: "location",
                type: "select",
                desc: __("Location"),
                required: false,
            },
            {
                name: "image",
                type: "text",
                desc: __("Image"),
                placeholder: attr__(
                    "Image URL, e.g. 'https://example.com/image.png'."
                ),
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
                required: true,
            },
            {
                name: "registration_link",
                type: "text",
                desc: __("Registration Link"),
                placeholder: attr__(
                    "Registration link, e.g. 'https://example.com'."
                ),
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

        this.renderInputs();
    }

    private renderInputs() {
        this.inputs = this.fields.flatMap((field) =>
            this.composeTaggedInputs(field, [
                ["event_type", this.event_types],
                ["target_groups", this.target_groups],
                ["location", this.locations],
                ["image", this.images],
                [
                    "status",
                    [
                        { id: 1, name: __("pending") },
                        { id: 2, name: __("confirmed") },
                        { id: 3, name: __("canceled") },
                        { id: 4, name: __("sold_out") },
                    ],
                ],
            ])
        );
    }

    private updateFieldsOnEventTypeChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        const { value } = target;

        if (!value) {
            return;
        }

        const newEventType = this.event_types.find(
            (eventType) => eventType.id === parseInt(value)
        );
        if (!newEventType) {
            return;
        }

        // Convert fields into a map for O(1) lookup.
        const fieldsMap = new Map(
            this.fields.map((field) => [field.name, field])
        );

        // You can now access and update fields directly in O(1) time.
        const eventTypeField = fieldsMap.get("event_type");
        if (eventTypeField) {
            eventTypeField.value = newEventType.id;
        }

        for (const [name, value] of Object.entries(newEventType)) {
            const field = fieldsMap.get(name);
            if (field) {
                if (name === "target_groups") {
                    field.value = value.map(
                        ({
                            target_group_id: id,
                            selected,
                            fee,
                        }: LMSEventTargetGroupFee) => ({ id, selected, fee })
                    );

                    continue;
                }

                field.value = value;
            }
        }

        this.renderInputs();
    }

    protected override updated(
        _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
    ): void {
        super.updated(_changedProperties);

        if (this.eventTypeSelect) {
            this.eventTypeSelect.addEventListener(
                "change",
                this.boundUpdateFieldsOnEventTypeChange
            );
        }
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();

        if (this.eventTypeSelect) {
            this.eventTypeSelect.removeEventListener(
                "change",
                this.boundUpdateFieldsOnEventTypeChange
            );
        }
    }
}
