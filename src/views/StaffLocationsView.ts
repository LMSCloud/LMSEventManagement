import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import LMSLocationsModal from "../extensions/LMSLocationsModal";
import LMSLocationsTable from "../extensions/LMSLocationsTable";
import { __ } from "../lib/translate";
import { TranslationController } from "../lib/TranslationController";

declare global {
  interface HTMLElementTagNameMap {
    "lms-locations-table": LMSLocationsTable;
    "lms-locations-modal": LMSLocationsModal;
  }
}

@customElement("lms-staff-locations-view")
export default class StaffLocationsView extends LitElement {
  override connectedCallback(): void {
    super.connectedCallback();
    TranslationController.getInstance().loadTranslations(() => {
      console.log("Translations loaded");
    });
  }

  override render() {
    return html`
      <lms-locations-table></lms-locations-table>
      <lms-locations-modal></lms-locations-modal>
    `;
  }
}
