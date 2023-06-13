import { customElement, property } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import { attr__, __ } from "../lib/translate";
import { CreateOpts } from "../sharedDeclarations";

@customElement("lms-locations-modal")
export default class LMSLocationsModal extends LMSModal {
    @property({ type: Object }) override createOpts: CreateOpts = {
        method: "POST",
        endpoint: "/api/v1/contrib/eventmanagement/locations",
    };

    override connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    private hydrate() {
        this.modalTitle = __("Create Location");
        this.fields = [
            {
                name: "name",
                type: "text",
                desc: __("Name"),
                placeholder: attr__(
                    "Name of the location, e.g. 'World Trade Center' or 'Room 101'."
                ),
                required: true,
                value: "",
            },
            {
                name: "street",
                type: "text",
                desc: __("Street"),
                placeholder: attr__(
                    "Street name and number, e.g. 'Main Street'."
                ),
                required: false,
                value: "",
            },
            {
                name: "number",
                type: "text",
                desc: __("Number"),
                placeholder: attr__("Street number, e.g. '42'."),
                required: false,
                value: "",
            },
            {
                name: "city",
                type: "text",
                desc: __("City"),
                placeholder: attr__("City, e.g. 'New York'."),
                required: false,
                value: "",
            },
            {
                name: "zip",
                type: "text",
                desc: __("Zip"),
                placeholder: attr__("Zip code, e.g. '10007'."),
                required: false,
                value: "",
            },
            {
                name: "country",
                type: "text",
                desc: __("Country"),
                placeholder: attr__("Country, e.g. 'USA'."),
                required: false,
                value: "",
            },
        ];
    }
}
