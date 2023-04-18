import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationHandler, __ } from "../lib/TranslationHandler";
import { Gettext } from "gettext.js";

@customElement("lms-staff-settings-view")
export default class StaffSettingsView extends LitElement {
  protected i18n: Gettext = {} as Gettext;
  private translationHandler: TranslationHandler = {} as TranslationHandler;

  static override styles = [bootstrapStyles]

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
    return html`<h1 class="text-center">${__("Not implemented")}!</h1>`;
  }
}
