import { customElement } from "lit/decorators";
import LMSTable from "../components/LMSTable";

@customElement("lms-event-types-table")
export default class LMSEventTypesTable extends LMSTable {
  override connectedCallback() {
    super.connectedCallback();
    this.order = [
      "id",
      "name",
      "target_group",
      "max_age",
      "min_age",
      "open_registration",
      "max_participants",
      "fee",
      "description",
      "image",
      "location",
    ];
    const events = fetch("/api/v1/contrib/eventmanagement/event_types");
    events
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        }

        throw new Error("Something went wrong");
      })
      .then((result) => {
        this.data = result;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
