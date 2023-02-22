import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import LMSTargetGroupsModal from "../extensions/LMSTargetGroupsModal";
import LMSTargetGroupsTable from "../extensions/LMSTargetGroupsTable";

declare global {
  interface HTMLElementTagNameMap {
    "lms-target-groups-table": LMSTargetGroupsTable;
    "lms-target-groups-modal": LMSTargetGroupsModal;
  }
}

@customElement("lms-staff-target-groups-view")
export default class StaffEventTypesView extends LitElement {
  override render() {
    return html`
      <lms-target-groups-table></lms-target-groups-table>
      <lms-target-groups-modal></lms-target-groups-modal>
    `;
  }
}
