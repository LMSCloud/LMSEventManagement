import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import LMSEventTypesModal from "../extensions/LMSEventTypesModal";
import LMSEventTypesTable from "../extensions/LMSEventTypesTable";

declare global {
  interface HTMLElementTagNameMap {
    "lms-event-types-table": LMSEventTypesTable;
    "lms-event-types-modal": LMSEventTypesModal;
  }
}

@customElement("lms-staff-event-types-view")
export default class StaffEventTypesView extends LitElement {
  override render() {
    return html`
      <lms-event-types-table></lms-event-types-table>
      <lms-event-types-modal></lms-event-types-modal>
    `;
  }
}
