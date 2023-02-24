import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import LMSStaffEventCardsDeck from "../components/LMSStaffEventCardDeck";
import LMSEventsModal from "../extensions/LMSEventsModal";

declare global {
  interface HTMLElementTagNameMap {
    "lms-staff-event-card-deck": LMSStaffEventCardsDeck;
    "lms-events-modal": LMSEventsModal;
  }
}

@customElement("lms-staff-events-view")
export default class StaffEventsView extends LitElement {
  override render() {
    return html` <lms-staff-event-card-deck>
      </lms-staff-event-card-deck>
      <lms-events-modal></lms-events-modal>`;
  }
}
