import { customElement } from "lit/decorators";
import LMSTable from "../components/LMSTable";

@customElement("lms-locations-table")
export default class LMSLocationsTable extends LMSTable {
  override connectedCallback() {
    super.connectedCallback();
    this.order = [
      "id",
      "name",
      "street",
      "number",
      "city",
      "state",
      "zip",
      "country",
    ];
    const events = fetch("/api/v1/contrib/eventmanagement/locations");
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
