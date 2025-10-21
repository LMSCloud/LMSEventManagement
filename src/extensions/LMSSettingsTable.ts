import { customElement, property } from "lit/decorators.js";
import LMSTable from "../components/LMSTable";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { LMSSettingResponse } from "../types/common";

type WithChangedPropertyNames<T> = {
    [P in keyof T as P extends "plugin_key"
        ? "id"
        : P extends "plugin_value"
        ? "value"
        : P]: P extends "plugin_value"
            ? T extends { plugin_key: infer K; plugin_value: infer V }
                ? [K, V]
                : never
            : T[P];
};

@customElement("lms-settings-table")
export default class LMSSettingsTable extends LMSTable {
    @property({ type: Array }) settings: LMSSettingResponse[] = [];

    override async handleSave(e: Event) {
        const target = e.target as HTMLElement;

        let parent = target.parentElement;
        while (parent && parent.tagName !== "TR") {
            parent = parent.parentElement;
        }

        let key,
            inputs = undefined;
        if (parent) {
            key = parent.firstElementChild?.textContent?.trim();
            inputs = parent.querySelectorAll("input");
        }

        if (!key || !inputs) {
            return;
        }

        let valueToStore: string | number = "";
        Array.from(inputs).forEach((input) => {
            if (input.name !== key) {
                return;
            }

            valueToStore = input.type === "checkbox" ? (input.checked ? 1 : 0) : input.value;
        });

        const response = await requestHandler.put({
            endpoint: "settings",
            path: [key.toString()],
            requestInit: {
                body: JSON.stringify({
                    plugin_value: valueToStore,
                }),
            },
        });
        if (response.status >= 200 && response.status <= 299) {
            inputs.forEach((input) => {
                input.disabled = true;
            });
            this.toggleEdit(
                new CustomEvent("click", {
                    detail: target.closest("td")?.querySelector(".btn-edit"),
                })
            );
            this.dispatchEvent(new CustomEvent("updated", { detail: key }));
            return;
        }

        if (response.status >= 400) {
            const error = await response.json();
            this.renderToast(response.statusText, error);
        }
    }

    constructor() {
        super();
        this.order = ["id", "value"];
        this.isEditable = true;
        this.isDeletable = false;
        this.hasControls = false;
    }

    override connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    private hydrate() {
        this.data = this.settings
            .filter(
                ({ plugin_key }) =>
                    ![
                        "__ENABLED__",
                        "__INSTALLED__",
                        "__INSTALLED_VERSION__",
                        "last_upgraded",
                        "__CURRENT_MIGRATION__",
                    ].includes(plugin_key) &&
                    !plugin_key.startsWith("widget_")
            )
            .map((setting) => {
                const { plugin_key, plugin_value } = setting;
                // Store the value as [plugin_key, plugin_value] tuple
                // so InputConverter can determine the right input type
                const settingData: WithChangedPropertyNames<LMSSettingResponse> = {
                    id: plugin_key,
                    value: [plugin_key, plugin_value],
                };
                return {
                    ...Object.fromEntries(this.getColumnData(settingData)),
                };
            });
    }

    override updated(changedProperties: Map<string, never>) {
        super.updated(changedProperties);
        if (changedProperties.has("settings")) {
            this.hydrate();
        }
    }
}
