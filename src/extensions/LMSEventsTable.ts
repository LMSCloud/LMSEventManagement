import { customElement } from "lit/decorators";
import LMSTable from "../components/LMSTable";

@customElement("lms-events-table")
export default class LMSEventsTable extends LMSTable {
  override connectedCallback() {
    super.connectedCallback();
    const events = fetch("/api/v1/contrib/eventmanagement/events");
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
