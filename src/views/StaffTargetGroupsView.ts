import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import LMSTargetGroupsModal from "../extensions/LMSTargetGroupsModal";
import LMSTargetGroupsTable from "../extensions/LMSTargetGroupsTable";
import { Column } from "../sharedDeclarations";

declare global {
  interface HTMLElementTagNameMap {
    "lms-target-groups-table": LMSTargetGroupsTable;
    "lms-target-groups-modal": LMSTargetGroupsModal;
  }
}

@customElement("lms-staff-target-groups-view")
export default class StaffEventTypesView extends LitElement {
  @state() target_groups: Column[] = [];

  async handleCreated() {
    const response = await fetch(
      "/api/v1/contrib/eventmanagement/target_groups"
    );
    this.target_groups = await response.json();
  }

  override connectedCallback() {
    super.connectedCallback();
    const locations = fetch("/api/v1/contrib/eventmanagement/target_groups");
    locations
      .then((response) => response.json())
      .then((result) => {
        this.target_groups = result;
      });
  }

  override render() {
    if (!this.target_groups.length) {
      return html`<div class="skeleton"></div>`;
    }

    return html`
      <lms-target-groups-table
        .target_groups=${this.target_groups}
      ></lms-target-groups-table>
      <lms-target-groups-modal></lms-target-groups-modal>
    `;
  }
}
