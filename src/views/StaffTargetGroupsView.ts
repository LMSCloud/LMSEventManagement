import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import LMSTargetGroupsModal from "../extensions/LMSTargetGroupsModal";
import LMSTargetGroupsTable from "../extensions/LMSTargetGroupsTable";
import { TargetGroup } from "../sharedDeclarations";
import { __ } from "../lib/translate";
import { TranslationController } from "../lib/TranslationController";

declare global {
  interface HTMLElementTagNameMap {
    "lms-target-groups-table": LMSTargetGroupsTable;
    "lms-target-groups-modal": LMSTargetGroupsModal;
  }
}

@customElement("lms-staff-target-groups-view")
export default class StaffEventTypesView extends LitElement {
  @property({ type: Array }) data: TargetGroup[] = [];

  async handleCreated() {
    const response = await fetch(
      "/api/v1/contrib/eventmanagement/target_groups"
    );
    this.data = await response.json();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    TranslationController.getInstance().loadTranslations(() => {
      console.log("Translations loaded");
    });
  }

  override render() {
    return html`
      <lms-target-groups-table></lms-target-groups-table>
      <lms-target-groups-modal></lms-target-groups-modal>
    `;
  }
}
