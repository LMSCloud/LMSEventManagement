import { customElement, property } from "lit/decorators.js";
import LMSTable from "../components/LMSTable/LMSTable";
import { Input, LMSSettingResponse } from "../types/common";

type WithChangedPropertyNames<T> = {
    [P in keyof T as P extends "plugin_key"
        ? "setting"
        : P extends "plugin_value"
        ? "value"
        : P]: T[P];
};

type ModifiedLMSSettingResponse = WithChangedPropertyNames<LMSSettingResponse>;

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

        const response = await fetch(
            `/api/v1/contrib/eventmanagement/settings/${key}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    ...Array.from(inputs).reduce(
                        (acc: { [key: string]: string }, input: Input) => {
                            acc[input.name] = input.value;
                            return acc;
                        },
                        {}
                    ),
                }),
            }
        );

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
        this.order = ["setting", "value"];
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
                    ].includes(plugin_key)
            )
            .map((setting) => {
                const { plugin_key, plugin_value } = setting;
                const settingData: ModifiedLMSSettingResponse = {
                    setting: plugin_key,
                    value: plugin_value,
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
