import { customElement, property } from "lit/decorators.js";
import LMSModal from "../components/LMSModal";
import { CreateOpts } from "../sharedDeclarations";
import { __ } from "../lib/TranslationHandler";

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
    this.fields = [
      {
        name: "name",
        type: "text",
        desc: __("Name"),
        required: true,
        value: "",
      },
      {
        name: "street",
        type: "text",
        desc: __("Street"),
        required: true,
        value: "",
      },
      {
        name: "number",
        type: "text",
        desc: __("Number"),
        required: false,
        value: "",
      },
      {
        name: "city",
        type: "text",
        desc: __("City"),
        required: false,
        value: "",
      },
      {
        name: "zip",
        type: "text",
        desc: __("Zip"),
        required: false,
        value: "0",
      },
      {
        name: "country",
        type: "text",
        desc: __("Country"),
        required: false,
        value: "",
      },
    ];
  }
}
