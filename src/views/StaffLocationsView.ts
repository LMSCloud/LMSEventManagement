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

  async fetchUpdate() {
    const response = await fetch("/api/v1/contrib/eventmanagement/locations");
    this.locations = await response.json();
  }

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
      <lms-locations-table
        .locations=${this.locations}
        @updated=${this.fetchUpdate}
        @deleted=${this.fetchUpdate}
      ></lms-locations-table>
      <lms-locations-modal @created=${this.fetchUpdate}></lms-locations-modal>
    `;
  }
}
