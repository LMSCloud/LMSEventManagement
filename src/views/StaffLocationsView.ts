import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import LMSLocationsModal from "../extensions/LMSLocationsModal";
import LMSLocationsTable from "../extensions/LMSLocationsTable";
import { TranslationHandler, __ } from "../lib/TranslationHandler";
import { Gettext } from "gettext.js";

declare global {
  interface HTMLElementTagNameMap {
    "lms-locations-table": LMSLocationsTable;
    "lms-locations-modal": LMSLocationsModal;
  }
}

@customElement("lms-staff-locations-view")
export default class StaffLocationsView extends LitElement {
  protected i18n: Gettext = {} as Gettext;
  private translationHandler: TranslationHandler = {} as TranslationHandler;

  override connectedCallback() {
    super.connectedCallback();
    this.translationHandler = new TranslationHandler(() =>
      this.requestUpdate()
    );
    this.translationHandler.loadTranslations().then((i18n) => {
      this.i18n = i18n;
    });
  }

  override render() {
    return html`
      <lms-locations-table></lms-locations-table>
      <lms-locations-modal></lms-locations-modal>
    `;
  }
}
