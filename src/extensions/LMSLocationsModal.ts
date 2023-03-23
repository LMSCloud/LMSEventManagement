import { customElement, property } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import { CreateOpts } from "../sharedDeclarations";
// import { Gettext } from "gettext.js";

@customElement("lms-locations-modal")
export default class LMSLocationsModal extends LMSModal {
  @property({ type: Object }) override createOpts: CreateOpts = {
    method: "POST",
    endpoint: "/api/v1/contrib/eventmanagement/locations",
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
        name: "street",
        type: "text",
        desc: "Street",
        required: true,
        value: "",
      },
      {
        name: "number",
        type: "text",
        desc: "Number",
        required: false,
        value: "",
      },
      {
        name: "city",
        type: "text",
        desc: "City",
        required: false,
        value: "",
      },
      {
        name: "zip",
        type: "text",
        desc: "Zip",
        required: false,
        value: "0",
      },
      {
        name: "country",
        type: "text",
        desc: "Country",
        required: false,
        value: "",
      },
    ];
  }
}
