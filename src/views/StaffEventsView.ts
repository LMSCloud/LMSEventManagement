import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import LMSEventsTable from "../extensions/LMSEventsTable";

declare global {
  interface HTMLElementTagNameMap {
    "lms-events-table": LMSEventsTable;
  }
}

@customElement("lms-staff-events-view")
export class StaffEventsView extends LitElement {
  static override styles = [bootstrapStyles];

  override render() {
    return html`<lms-events-table></lms-events-table>`;
  }
}
