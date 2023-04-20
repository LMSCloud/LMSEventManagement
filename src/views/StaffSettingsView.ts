import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { TranslationController } from "../lib/TranslationController";
import { __ } from "../lib/translate";

@customElement("lms-staff-settings-view")
export default class StaffSettingsView extends LitElement {
  static override styles = [bootstrapStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    TranslationController.getInstance().loadTranslations(() => {
      console.log("Translations loaded");
    });
  }

  override render() {
    return html`<h1 class="text-center">${__("Not implemented")}!</h1>`;
  }
}
