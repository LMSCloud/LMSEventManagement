import { customElement, property } from "lit/decorators";
import LMSModal from "../components/LMSModal";
import { CreateOpts, Field } from "../sharedDeclarations";
import { Gettext } from "gettext.js";

@customElement("lms-locations-modal")
export default class LMSLocationsModal extends LMSModal {
  @property({ type: Object }) override createOpts: CreateOpts = {
    method: "POST",
    endpoint: "/api/v1/contrib/eventmanagement/locations",
  };
  @property({ type: Function, attribute: false }) modalFields = (
    i18n: Gettext
  ): Field[] => [
    {
      name: "name",
      type: "text",
      desc: i18n.gettext("Name"),
      required: true,
      value: "",
    },
    {
      name: "street",
      type: "text",
      desc: i18n.gettext("Street"),
      required: true,
      value: "",
    },
    {
      name: "number",
      type: "text",
      desc: i18n.gettext("Number"),
      required: false,
      value: "",
    },
    {
      name: "city",
      type: "text",
      desc: i18n.gettext("City"),
      required: false,
      value: "",
    },
    {
      name: "zip",
      type: "number",
      desc: i18n.gettext("Zip"),
      required: false,
      value: "0",
    },
    {
      name: "country",
      type: "text",
      desc: i18n.gettext("Country"),
      required: false,
      value: "",
    },
  ];

  override connectedCallback() {
    super.connectedCallback();

    if (this._i18n instanceof Promise) {
      this.fields = [];
      this._i18n.then((i18n) => {
        this.fields = this.modalFields(i18n);
      });
      return;
    }

    this.fields = this.modalFields(this._i18n);
  }
}
