import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { Column, LMSSettingResponse } from "../sharedDeclarations";

@customElement("lms-staff-settings-view")
export default class StaffSettingsView extends LitElement {
  @property({ type: Boolean }) hasLoaded = false;

  private isEmpty = false;

  private settings: Column[] = [];

  static override styles = [bootstrapStyles, skeletonStyles];

  override connectedCallback() {
    super.connectedCallback();
    const settings = fetch(`/api/v1/contrib/eventmanagement/settings`);
    settings
      .then((response) => response.json())
      .then((settings) => {
        this.settings = settings.map((setting: LMSSettingResponse) => {
          try {
            return {
              ...setting,
              plugin_value: JSON.parse(setting.plugin_value.toString()),
            };
          } catch {
            return setting;
          }
        });
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
      return html`<h1 class="text-center">${__("No settings found")}!</h1>`;
    }

    return this.settings
      ? html`<lms-settings-table
          .settings=${this.settings}
        ></lms-settings-table>`
      : nothing;
  }
}
