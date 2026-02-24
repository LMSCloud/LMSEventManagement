import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { __ } from "../lib/translate";
import { tailwindStyles } from "../tailwind.lit";
import { LMSSettingResponse } from "../types/common";

type ToastState = {
    heading: unknown;
    message: unknown;
};

type SettingSection = {
    id: string;
    title: unknown;
    description: unknown;
    settings: LMSSettingResponse[];
};

const CHECKBOX_KEYS = new Set([
    "opac_filters_age_enabled",
    "opac_filters_registration_and_dates_enabled",
    "opac_filters_fee_enabled",
    "opac_hide_pending_events",
]);

@customElement("lms-settings-table")
export default class LMSSettingsTable extends LitElement {
    @property({ type: Array }) settings: LMSSettingResponse[] = [];

    @state() private draftValues: Record<string, string | boolean> = {};

    @state() private savingBySetting: Record<string, boolean> = {};

    @state() private activeSectionId = "";

    @state() private toast: ToastState = { heading: "", message: "" };

    private sectionObserver: IntersectionObserver | null = null;

    static override styles = [
        tailwindStyles,
        css`
            .settings-shell {
                width: 100%;
                padding: 1rem;
            }

            .settings-layout {
                display: grid;
                gap: 1.25rem;
            }

            .settings-sidebar {
                display: none;
            }

            .settings-sections {
                display: grid;
                gap: 1.25rem;
            }

            .settings-section {
                border-radius: 1rem;
                border: 1px solid rgb(226 232 240);
                background: rgb(248 250 252 / 0.45);
                padding: 1rem;
            }

            .settings-section__header {
                margin-bottom: 0.9rem;
            }

            .settings-section__title {
                font-size: 1.1rem;
                font-weight: 700;
                line-height: 1.2;
            }

            .settings-section__description {
                margin-top: 0.25rem;
                font-size: 0.85rem;
                color: rgb(71 85 105);
            }

            .settings-section__grid {
                display: grid;
                gap: 1rem;
            }

            .setting-card {
                border-radius: 0.9rem;
                border: 1px solid rgb(226 232 240);
                background: rgb(255 255 255);
                box-shadow: 0 6px 20px -20px rgb(15 23 42 / 0.65);
            }

            .setting-card__inner {
                padding: 0.95rem 1rem;
                display: grid;
                gap: 0.65rem;
            }

            .setting-card__header {
                display: grid;
                gap: 0.15rem;
            }

            .setting-card__name {
                font-size: 0.95rem;
                font-weight: 700;
                line-height: 1.2;
            }

            .setting-card__description {
                font-size: 0.85rem;
                color: rgb(71 85 105);
                line-height: 1.3;
            }

            .setting-card__checkbox {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }

            .setting-card__actions {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            @media (min-width: 1100px) {
                .settings-shell {
                    padding: 1rem 1.5rem 2rem;
                }

                .settings-layout {
                    grid-template-columns: 17rem minmax(0, 1fr);
                    align-items: start;
                }

                .settings-sidebar {
                    display: block;
                    position: sticky;
                    top: 1rem;
                    max-height: calc(100vh - 2rem);
                    overflow: auto;
                    border-radius: 1rem;
                    border: 1px solid rgb(226 232 240);
                    background: linear-gradient(180deg, rgb(255 255 255) 0%, rgb(248 250 252) 100%);
                    padding: 0.75rem;
                    box-shadow: 0 8px 24px -18px rgb(15 23 42 / 0.45);
                }
            }

            @media (max-width: 640px) {
                .settings-shell {
                    padding: 0.75rem;
                }
            }
        `,
    ];

    override willUpdate(changedProperties: Map<string, unknown>) {
        if (!changedProperties.has("settings")) {
            return;
        }

        this.draftValues = this.visibleSettings.reduce<Record<string, string | boolean>>((acc, setting) => {
            const key = setting.plugin_key;
            const value = setting.plugin_value;

            if (this.isCheckboxSetting(key, value)) {
                acc[key] = this.toBool(value);
                return acc;
            }

            acc[key] = value == null ? "" : String(value);
            return acc;
        }, {});
    }

    override updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has("settings")) {
            this.initSectionObserver();
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.sectionObserver?.disconnect();
        this.sectionObserver = null;
    }

    private get visibleSettings() {
        return this.settings.filter(
            ({ plugin_key }) =>
                ![
                    "__ENABLED__",
                    "__INSTALLED__",
                    "__INSTALLED_VERSION__",
                    "last_upgraded",
                    "__CURRENT_MIGRATION__",
                ].includes(plugin_key) && !plugin_key.startsWith("widget_")
        );
    }

    private toBool(value: unknown) {
        return value === true || value === 1 || value === "1";
    }

    private isCheckboxSetting(key: string, value: unknown) {
        if (CHECKBOX_KEYS.has(key)) {
            return true;
        }

        return typeof value === "boolean";
    }

    private getSectionIdForSetting(settingKey: string) {
        if (settingKey.startsWith("opac_filters_")) {
            return "filters";
        }

        if (settingKey.startsWith("opac_hide_")) {
            return "visibility";
        }

        return "general";
    }

    private get sections(): SettingSection[] {
        const sectionDefs = [
            {
                id: "filters",
                title: __("OPAC Filters"),
                description: __("Control which filters are shown in the OPAC event list."),
            },
            {
                id: "visibility",
                title: __("Visibility"),
                description: __("Control event visibility behavior in OPAC views."),
            },
            {
                id: "general",
                title: __("General"),
                description: __("Other event management settings."),
            },
        ];

        const settingsBySection = this.visibleSettings.reduce<Record<string, LMSSettingResponse[]>>((acc, setting) => {
            const sectionId = this.getSectionIdForSetting(setting.plugin_key);
            acc[sectionId] = [...(acc[sectionId] ?? []), setting];
            return acc;
        }, {});

        return sectionDefs.map((section) => ({
            ...section,
            settings: settingsBySection[section.id] ?? [],
        }));
    }

    private scrollToSection(sectionId: string) {
        const section = this.renderRoot.querySelector<HTMLElement>(`#section-${sectionId}`);
        if (!section) {
            return;
        }

        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    private initSectionObserver() {
        this.sectionObserver?.disconnect();
        this.sectionObserver = null;

        const sections = this.renderRoot.querySelectorAll<HTMLElement>(".settings-section[id]");
        if (!sections.length) {
            this.activeSectionId = "";
            return;
        }

        const firstSection = sections.item(0);
        this.activeSectionId = firstSection ? firstSection.id.replace("section-", "") : "";

        this.sectionObserver = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                const current = visibleSections[0];
                if (!current || !(current.target instanceof HTMLElement)) {
                    return;
                }

                const sectionId = current.target.id.replace("section-", "");
                if (!sectionId) {
                    return;
                }

                this.activeSectionId = sectionId;
            },
            {
                root: null,
                threshold: [0.2, 0.5, 0.8],
                rootMargin: "-15% 0px -60% 0px",
            }
        );

        sections.forEach((section) => this.sectionObserver?.observe(section));
    }

    private setSaving(settingKey: string, isSaving: boolean) {
        this.savingBySetting = {
            ...this.savingBySetting,
            [settingKey]: isSaving,
        };
    }

    private renderToast(statusText: string, error: unknown) {
        this.toast = {
            heading: statusText || __("Error"),
            message: JSON.stringify(error),
        };

        window.setTimeout(() => {
            this.toast = { heading: "", message: "" };
        }, 4000);
    }

    private dispatchUpdated(setting: string) {
        this.dispatchEvent(new CustomEvent("updated", { detail: setting }));
    }

    private handleTextLikeInput(setting: LMSSettingResponse, e: Event) {
        const target = e.target as HTMLInputElement;
        this.draftValues = {
            ...this.draftValues,
            [setting.plugin_key]: target.value,
        };
    }

    private handleCheckboxInput(setting: LMSSettingResponse, e: Event) {
        const target = e.target as HTMLInputElement;
        this.draftValues = {
            ...this.draftValues,
            [setting.plugin_key]: target.checked,
        };
    }

    private resetDraft(setting: LMSSettingResponse) {
        const key = setting.plugin_key;
        const value = this.isCheckboxSetting(key, setting.plugin_value)
            ? this.toBool(setting.plugin_value)
            : String(setting.plugin_value ?? "");

        this.draftValues = {
            ...this.draftValues,
            [key]: value,
        };
    }

    private hasDraftChanged(setting: LMSSettingResponse) {
        const key = setting.plugin_key;
        const draft = this.draftValues[key];

        if (this.isCheckboxSetting(key, setting.plugin_value)) {
            return Boolean(draft) !== this.toBool(setting.plugin_value);
        }

        return String(draft ?? "") !== String(setting.plugin_value ?? "");
    }

    private coerceValueForSave(setting: LMSSettingResponse, draft: string | boolean | undefined) {
        if (this.isCheckboxSetting(setting.plugin_key, setting.plugin_value)) {
            return Boolean(draft) ? 1 : 0;
        }

        if (typeof setting.plugin_value === "number") {
            const parsed = Number(draft);
            return Number.isNaN(parsed) ? 0 : parsed;
        }

        return String(draft ?? "");
    }

    private async saveSetting(setting: LMSSettingResponse) {
        const key = setting.plugin_key;
        const draft = this.draftValues[key];

        this.setSaving(key, true);

        const response = await requestHandler.put({
            endpoint: "settings",
            path: [key],
            requestInit: {
                body: JSON.stringify({
                    plugin_value: this.coerceValueForSave(setting, draft),
                }),
            },
        });

        this.setSaving(key, false);

        if (response.status < 200 || response.status > 299) {
            this.renderToast(response.statusText, await response.json());
            return;
        }

        this.dispatchUpdated(key);
    }

    private renderSettingInput(setting: LMSSettingResponse) {
        const key = setting.plugin_key;
        const isCheckbox = this.isCheckboxSetting(key, setting.plugin_value);

        if (isCheckbox) {
            const enabled = Boolean(this.draftValues[key]);
            return html`
                <div class="setting-card__checkbox">
                    <span class="text-sm font-medium">${__("Enabled")} - ${enabled ? __("On") : __("Off")}</span>
                    <input
                        class="toggle toggle-primary"
                        type="checkbox"
                        name=${key}
                        .checked=${enabled}
                        @change=${(e: Event) => this.handleCheckboxInput(setting, e)}
                    />
                </div>
            `;
        }

        return html`
            <input
                class="input input-bordered w-full"
                type=${typeof setting.plugin_value === "number" ? "text" : "text"}
                inputmode=${typeof setting.plugin_value === "number" ? "numeric" : "text"}
                pattern=${typeof setting.plugin_value === "number" ? "[0-9]*" : ".*"}
                name=${key}
                .value=${String(this.draftValues[key] ?? "")}
                @input=${(e: Event) => this.handleTextLikeInput(setting, e)}
            />
        `;
    }

    private renderActions(setting: LMSSettingResponse) {
        const key = setting.plugin_key;
        const isSaving = Boolean(this.savingBySetting[key]);
        const hasChanges = this.hasDraftChanged(setting);

        return html`
            <div class="setting-card__actions">
                <button class="btn btn-primary btn-sm" ?disabled=${isSaving || !hasChanges} @click=${() => this.saveSetting(setting)}>
                    ${__("Save")}
                </button>
                <button class="btn btn-ghost btn-sm" ?disabled=${isSaving || !hasChanges} @click=${() => this.resetDraft(setting)}>
                    ${__("Abort")}
                </button>
            </div>
        `;
    }

    private renderSidebar() {
        const sections = this.sections.filter((section) => section.settings.length > 0);

        return html`
            <aside class="settings-sidebar">
                <nav class="menu w-full gap-1">
                    ${repeat(
                        sections,
                        (section) => section.id,
                        (section) => html`
                            <li>
                                <button
                                    class=${classMap({
                                        btn: true,
                                        "btn-ghost": section.id !== this.activeSectionId,
                                        "btn-active": section.id === this.activeSectionId,
                                        "justify-between": true,
                                    })}
                                    @click=${() => this.scrollToSection(section.id)}
                                >
                                    <span>${section.title}</span>
                                    <span class="badge badge-sm">${section.settings.length}</span>
                                </button>
                            </li>
                        `
                    )}
                </nav>
            </aside>
        `;
    }

    override render() {
        const sections = this.sections.filter((section) => section.settings.length > 0);

        return html`
            <div class="settings-shell">
                <div class="settings-layout">
                    ${this.renderSidebar()}
                    <div class="settings-sections">
                        ${repeat(
                            sections,
                            (section) => section.id,
                            (section) => html`
                                <section class="settings-section" id=${`section-${section.id}`}>
                                    <header class="settings-section__header">
                                        <h2 class="settings-section__title">${section.title}</h2>
                                        <p class="settings-section__description">${section.description}</p>
                                    </header>
                                    <div class="settings-section__grid">
                                        ${repeat(
                                            section.settings,
                                            (setting) => setting.plugin_key,
                                            (setting) => html`
                                                <article class="setting-card">
                                                    <div class="setting-card__inner">
                                                        <header class="setting-card__header">
                                                            <h3 class="setting-card__name">${__(setting.plugin_key)}</h3>
                                                        </header>
                                                        ${this.renderSettingInput(setting)} ${this.renderActions(setting)}
                                                    </div>
                                                </article>
                                            `
                                        )}
                                    </div>
                                </section>
                            `
                        )}
                    </div>
                </div>
            </div>
            ${this.toast.heading && this.toast.message
                ? html`<lms-toast .heading=${this.toast.heading} .message=${this.toast.message}></lms-toast>`
                : null}
        `;
    }
}
