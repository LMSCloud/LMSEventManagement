import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import LMSLocationsModal from "../extensions/LMSLocationsModal";
import LMSLocationsTable from "../extensions/LMSLocationsTable";
import { Column } from "../sharedDeclarations";

declare global {
  interface HTMLElementTagNameMap {
    "lms-locations-table": LMSLocationsTable;
    "lms-locations-modal": LMSLocationsModal;
  }
}

@customElement("lms-staff-locations-view")
export default class StaffLocationsView extends LitElement {
  @state() locations: Column[] = [];

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
      return html`<div class="skeleton"></div>`;
    }

    return html`
      <lms-locations-table .locations=${this.locations}></lms-locations-table>
      <lms-locations-modal></lms-locations-modal>
    `;
  }
}
