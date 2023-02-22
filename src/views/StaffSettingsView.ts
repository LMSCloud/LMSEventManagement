import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("lms-staff-settings-view")
export default class StaffSettingsView extends LitElement {

  static override styles = [bootstrapStyles]

  override render() {
    return html`<h1 class="text-center">Not implemented!</h1>`;
  }
}
