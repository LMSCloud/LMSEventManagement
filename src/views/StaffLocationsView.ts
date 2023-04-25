import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import LMSLocationsModal from "../extensions/LMSLocationsModal";
import LMSLocationsTable from "../extensions/LMSLocationsTable";
import { Column } from "../sharedDeclarations";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";

declare global {
  interface HTMLElementTagNameMap {
    "lms-locations-table": LMSLocationsTable;
    "lms-locations-modal": LMSLocationsModal;
  }
}

@customElement("lms-staff-locations-view")
export default class StaffLocationsView extends LitElement {
  @state() locations: Column[] = [];

  static override styles = [bootstrapStyles, skeletonStyles];

  override connectedCallback() {
    super.connectedCallback();
    const locations = fetch("/api/v1/contrib/eventmanagement/locations");
    locations
      .then((response) => response.json())
      .then((result) => {
        this.locations = result;
      });
  }

  override render() {
    if (!this.locations.length) {
      return html` <h1 class="text-center">${__("No data to display")}.</h1>`;
    }

    return html`
      <lms-locations-table .locations=${this.locations}></lms-locations-table>
      <lms-locations-modal></lms-locations-modal>
    `;
  }
}
