import { customElement, property } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import { attr__, __ } from "../lib/translate";
import {
    CreateOpts,
    LMSEvent,
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

        this.inputs = this.fields.flatMap((field) => {
            return Array.from(
                this.getColumnData({ name: field.name, value: field }, [
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
        });
    }
}
