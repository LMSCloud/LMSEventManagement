import { customElement, property } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import { attr__, __ } from "../lib/translate";
import { CreateOpts, LMSLocation, LMSTargetGroup } from "../sharedDeclarations";

@customElement("lms-event-types-modal")
export default class LMSEventTypesModal extends LMSModal {
    @property({ type: Object }) override createOpts: CreateOpts = {
        method: "POST",
        endpoint: "/api/v1/contrib/eventmanagement/event_types",
    };

    override connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    private hydrate() {
        this.modalTitle = __("Create Event Type");
        this.fields = [
            {
                name: "name",
                type: "text",
                desc: __("Name"),
                placeholder: attr__(
                    "Name of the event type, e.g. 'Workshop' or 'Lecture'."
                ),
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
                value: [],
            },
            {
                name: "min_age",
                type: "number",
                desc: __("Min Age"),
                placeholder: attr__(
                    "Minimum age of the target groups, e.g. '18'."
                ),
                required: true,
                value: "",
            },
            {
                name: "max_age",
                type: "number",
                desc: __("Max Age"),
                placeholder: attr__(
                    "Maximum age of the target groups, e.g. '99'."
                ),
                required: true,
                value: "",
            },
            {
                name: "max_participants",
                type: "number",
                desc: __("Max Participants"),
                placeholder: attr__(
                    "Maximum number of participants, e.g. '20'."
                ),
                required: true,
                value: "",
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
                value: [],
            },
            {
                name: "image",
                type: "text",
                desc: __("Image"),
                placeholder: attr__("Image URL"),
                required: false,
                value: "",
            },
            {
                name: "description",
                type: "text",
                desc: __("Description"),
                placeholder: attr__(
                    "Description of the event type, e.g. 'This is a workshop.'"
                ),
                required: false,
                value: "",
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
}
