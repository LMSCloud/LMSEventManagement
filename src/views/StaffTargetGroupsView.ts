import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import LMSTargetGroupsModal from "../extensions/LMSTargetGroupsModal";
import LMSTargetGroupsTable from "../extensions/LMSTargetGroupsTable";
import { TargetGroup } from "../sharedDeclarations";
import { TranslationHandler, __ } from "../lib/TranslationHandler";
import { Gettext } from "gettext.js";

declare global {
  interface HTMLElementTagNameMap {
    "lms-target-groups-table": LMSTargetGroupsTable;
    "lms-target-groups-modal": LMSTargetGroupsModal;
  }
}

@customElement("lms-staff-target-groups-view")
export default class StaffEventTypesView extends LitElement {
  @property({ type: Array }) data: TargetGroup[] = [];
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

  async handleCreated() {
    const response = await fetch(
      "/api/v1/contrib/eventmanagement/target_groups"
    );
    this.data = await response.json();
  }

  override render() {
    return html`
      <lms-target-groups-table></lms-target-groups-table>
      <lms-target-groups-modal></lms-target-groups-modal>
    `;
  }
}
