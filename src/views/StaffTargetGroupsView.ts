import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import LMSTargetGroupsModal from "../extensions/LMSTargetGroupsModal";
import LMSTargetGroupsTable from "../extensions/LMSTargetGroupsTable";
import { Column } from "../sharedDeclarations";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";

declare global {
  interface HTMLElementTagNameMap {
    "lms-target-groups-table": LMSTargetGroupsTable;
    "lms-target-groups-modal": LMSTargetGroupsModal;
  }
}

@customElement("lms-staff-target-groups-view")
export default class StaffEventTypesView extends LitElement {
  @state() hasLoaded = false;
  private isEmpty = false;
  private target_groups: Column[] = [];

  static override styles = [bootstrapStyles, skeletonStyles];

  async fetchUpdate() {
    const response = await fetch(
      "/api/v1/contrib/eventmanagement/target_groups"
    );
    this.target_groups = await response.json();
    this.requestUpdate();
  }

  override connectedCallback() {
    super.connectedCallback();
    const locations = fetch("/api/v1/contrib/eventmanagement/target_groups");
    locations
      .then((response) => response.json())
      .then((result) => {
        this.target_groups = result;
      })
      .then(() => {
        this.isEmpty = !this.target_groups.length;
        this.hasLoaded = true;
      });
  }

  override render() {
    if (!this.hasLoaded) {
      return html` <div class="container-fluid mx-0">
        <div class="skeleton skeleton-table"></div>
      </div>`;
    }

    if (this.hasLoaded && this.isEmpty) {
      return html` <h1 class="text-center">${__("No data to display")}.</h1>`;
    }

    return html`
      <lms-target-groups-table
        .target_groups=${this.target_groups}
        @updated=${this.fetchUpdate}
        @deleted=${this.fetchUpdate}
      ></lms-target-groups-table>
      <lms-target-groups-modal
        @created=${this.fetchUpdate}
      ></lms-target-groups-modal>
    `;
  }
}
