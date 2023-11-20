import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { match } from "ts-pattern";
import LMSSettingsTable from "../extensions/LMSSettingsTable";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import { Column, LMSSettingResponse } from "../types/common";

declare global {
    interface HTMLElementTagNameMap {
        "lms-settings-table": LMSSettingsTable;
    }
}

@customElement("lms-staff-settings-view")
export default class StaffSettingsView extends LitElement {
    @state() state: "initial" | "pending" | "success" | "no-content" | "error" =
        "initial";

    private settings: Column[] = [];

    static override styles = [tailwindStyles, skeletonStyles];

    override connectedCallback() {
        super.connectedCallback();
        requestHandler
            .get({ endpoint: "settings" })
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
                this.state = "success";
            })
            .catch((error) => {
                this.state = "error";
                console.error(error);
            });
    }

    private fetchUpdate() {
        requestHandler
            .get({ endpoint: "settings" })
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
                this.requestUpdate();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    override render() {
        return match(this.state)
            .with(
                "initial",
                "pending",
                () =>
                    html` <div class="mx-8">
                        <div class="skeleton skeleton-table"></div>
                    </div>`
            )
            .with(
                "no-content",
                () =>
                    html`<h1 class="text-center">
                        ${__("No settings found")}!
                    </h1>`
            )
            .with(
                "success",
                () =>
                    html`<lms-settings-table
                        @updated=${this.fetchUpdate}
                        .settings=${this.settings}
                    ></lms-settings-table>`
            )
            .with("error", () => html`<h1 class="text-center">Error</h1>`)
            .exhaustive();
    }
}
