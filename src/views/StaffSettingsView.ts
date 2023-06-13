import { html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { __ } from "../lib/translate";
import { Column, LMSSettingResponse } from "../sharedDeclarations";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-staff-settings-view")
export default class StaffSettingsView extends LitElement {
    @property({ type: Boolean }) hasLoaded = false;

    private isEmpty = false;

    private settings: Column[] = [];

    static override styles = [tailwindStyles, skeletonStyles];

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
                            plugin_value: JSON.parse(
                                setting.plugin_value.toString()
                            ),
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
            return html` <div class="mx-8">
                <div class="skeleton skeleton-table"></div>
            </div>`;
        }

        if (this.hasLoaded && this.isEmpty) {
            return html`<h1 class="text-center">
                ${__("No settings found")}!
            </h1>`;
        }

        return this.settings
            ? html`<lms-settings-table
                  .settings=${this.settings}
              ></lms-settings-table>`
            : nothing;
    }
}
