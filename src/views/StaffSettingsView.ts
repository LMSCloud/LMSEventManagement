import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../components/styles/skeleton";

@customElement("lms-staff-settings-view")
export default class StaffSettingsView extends LitElement {
  static override styles = [bootstrapStyles, skeletonStyles];

  override render() {
    return html`<h1 class="text-center">${__("Not implemented")}!</h1>`;
  }
}
