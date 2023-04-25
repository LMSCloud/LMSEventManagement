import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import LMSEventTypesModal from "../extensions/LMSEventTypesModal";
import LMSEventTypesTable from "../extensions/LMSEventTypesTable";
import { Column } from "../sharedDeclarations";

declare global {
  interface HTMLElementTagNameMap {
    "lms-event-types-table": LMSEventTypesTable;
    "lms-event-types-modal": LMSEventTypesModal;
  }
}

@customElement("lms-staff-event-types-view")
export default class StaffEventTypesView extends LitElement {
  @state() event_types: Column[] = [];
  private target_groups: Column[] = [];
  private locations: Column[] = [];

  override connectedCallback() {
    super.connectedCallback();
    Promise.all([
      fetch("/api/v1/contrib/eventmanagement/target_groups"),
      fetch("/api/v1/contrib/eventmanagement/locations"),
      fetch("/api/v1/contrib/eventmanagement/event_types"),
    ])
      .then((results) => Promise.all(results.map((result) => result.json())))
      .then(([target_groups, locations, event_types]) => {
        this.target_groups = target_groups;
        this.locations = locations;
        this.event_types = event_types;
      });
  }

  hasData() {
    return [this.target_groups, this.locations, this.event_types].every(
      (data) => data.length > 0
    );
  }

  override render() {
    if (!this.hasData()) {
      return html`<div class="skeleton"></div>`;
    }

    return html`
      <lms-event-types-table
        .target_groups=${this.target_groups}
        .locations=${this.locations}
        .event_types=${this.event_types}
      ></lms-event-types-table>
      <lms-event-types-modal></lms-event-types-modal>
    `;
  }
}
