import { customElement } from "lit/decorators";
import LMSTable from "../components/LMSTable";

@customElement("lms-target-groups-table")
export default class LMSEventTypesTable extends LMSTable {
  override connectedCallback() {
    super.connectedCallback();
    this.order = ["id", "name", "min_age", "max_age"];
    const events = fetch("/api/v1/contrib/eventmanagement/target_groups");
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
