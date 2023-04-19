import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import LMSEventTypesModal from "../extensions/LMSEventTypesModal";
import LMSEventTypesTable from "../extensions/LMSEventTypesTable";
import { TranslationHandler, __ } from "../lib/TranslationHandler";
import { Gettext } from "gettext.js";

declare global {
  interface HTMLElementTagNameMap {
    "lms-event-types-table": LMSEventTypesTable;
    "lms-event-types-modal": LMSEventTypesModal;
  }
}

@customElement("lms-staff-event-types-view")
export default class StaffEventTypesView extends LitElement {
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
      <lms-event-types-table></lms-event-types-table>
      <lms-event-types-modal></lms-event-types-modal>
    `;
  }
}
