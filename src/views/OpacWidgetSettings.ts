import { html, LitElement, nothing, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { match } from "ts-pattern";
import LMSToast from "../components/LMSToast";
import OpacEventsWidget from "../components/OpacEventsWidget";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { __, attr__ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";

declare global {
    interface HTMLElementTagNameMap {
        "lms-opac-events-widget": OpacEventsWidget;
    }
}

interface WidgetSettings {
    widget_enabled: number; // 1 or 0
    widget_auto_inject: number; // 1 or 0
    widget_title: string;
    widget_display_mode: string; // "count" | "period" | "manual"
    widget_layout: string; // "vertical" | "horizontal"
    widget_event_count: string;
    widget_time_period: string;
    widget_selected_events: string; // JSON array of event IDs
    widget_all_events_text: string;
}

@customElement("lms-opac-widget-settings")
export default class OpacWidgetSettings extends LitElement {
    @state() state: "initial" | "pending" | "success" | "error" | "saving" =
        "initial";

    @state() private settings: WidgetSettings = {
        widget_enabled: 0,
        widget_auto_inject: 1,
        widget_title: "",
        widget_display_mode: "count",
        widget_layout: "vertical",
        widget_event_count: "5",
        widget_time_period: "14",
        widget_selected_events: "[]",
        widget_all_events_text: "",
    };

    @state() private availableEvents: Array<{ id: number; name: string; start_time: string }> = [];

    static override styles = [tailwindStyles, skeletonStyles];

    override async connectedCallback() {
        super.connectedCallback();
        await this.loadSettings();
        await this.loadEvents();
        this.cleanupSelectedEvents();
    }

    private async loadSettings() {
        try {
            const response = await requestHandler.get({ endpoint: "settings" });
            const allSettings = await response.json();

            // Extract widget settings from all settings
            const widgetSettings = allSettings.filter((s: any) =>
                s.plugin_key.startsWith("widget_")
            );

            widgetSettings.forEach((setting: any) => {
                const key = setting.plugin_key as keyof WidgetSettings;
                const value = setting.plugin_value;

                // Type-safe assignment
                if (key === 'widget_enabled' || key === 'widget_auto_inject') {
                    this.settings[key] = typeof value === 'number' ? value : 0;
                } else if (key === 'widget_selected_events') {
                    // Backend returns this as an array, we need it as JSON string
                    this.settings[key] = Array.isArray(value)
                        ? JSON.stringify(value)
                        : (value || '[]');
                } else {
                    // Handle null/undefined and empty strings properly
                    if (value === null || value === undefined) {
                        this.settings[key] = '';
                    } else {
                        const stringValue = value.toString();
                        this.settings[key] = stringValue === '""' ? '' : stringValue;
                    }
                }
            });

            this.state = "success";
        } catch (error) {
            this.state = "error";
            console.error(error);
        }
    }

    private async loadEvents() {
        try {
            const response = await requestHandler.get({ endpoint: "events" });
            const events = await response.json();
            // Get upcoming events only
            const now = new Date();
            this.availableEvents = events
                .filter((e: any) => new Date(e.start_time) > now)
                .sort((a: any, b: any) =>
                    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                );
        } catch (error) {
            console.error("Failed to load events:", error);
        }
    }

    private cleanupSelectedEvents() {
        // Guard: don't cleanup if events haven't loaded yet
        if (!this.availableEvents || this.availableEvents.length === 0) {
            return;
        }

        // Parse selected events, defaulting to empty array if null or invalid
        const selectedIds = JSON.parse(this.settings.widget_selected_events) || [];
        if (!Array.isArray(selectedIds)) {
            return;
        }

        // Remove any selected event IDs that are no longer in the upcoming events list
        const availableIds = this.availableEvents.map((e) => e.id);
        const cleanedIds = selectedIds.filter((id: number) => availableIds.includes(id));

        // Only update if something changed
        if (cleanedIds.length !== selectedIds.length) {
            this.settings.widget_selected_events = JSON.stringify(cleanedIds);
            this.requestUpdate();
        }
    }

    private handleEventSelection(e: Event) {
        const checkbox = e.target as HTMLInputElement;
        const eventId = parseInt(checkbox.value);
        const selectedIds = JSON.parse(this.settings.widget_selected_events);

        if (checkbox.checked) {
            selectedIds.push(eventId);
        } else {
            const index = selectedIds.indexOf(eventId);
            if (index > -1) selectedIds.splice(index, 1);
        }

        this.settings.widget_selected_events = JSON.stringify(selectedIds);
        this.requestUpdate();
    }

    private async handleSave(e: Event) {
        e.preventDefault();
        this.state = "saving";

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            // Build complete settings object from form + state
            const updatedSettings: Partial<WidgetSettings> = {
                widget_enabled: formData.has("widget_enabled") ? 1 : 0,
                widget_auto_inject: formData.has("widget_auto_inject") ? 1 : 0,
                widget_title: (formData.get("widget_title") as string) || "",
                widget_display_mode: (formData.get("widget_display_mode") as string) || "count",
                widget_layout: (formData.get("widget_layout") as string) || "vertical",
                widget_event_count: (formData.get("widget_event_count") as string) || this.settings.widget_event_count,
                widget_time_period: (formData.get("widget_time_period") as string) || this.settings.widget_time_period,
                widget_selected_events: (formData.get("widget_selected_events") as string) || this.settings.widget_selected_events,
                widget_all_events_text: (formData.get("widget_all_events_text") as string) || "",
            };

            // Save each setting
            for (const [key, value] of Object.entries(updatedSettings)) {
                await requestHandler.put({
                    endpoint: "settings",
                    path: [key],
                    requestInit: {
                        body: JSON.stringify({ plugin_value: value }),
                    },
                });
            }

            // Reload settings to reflect saved changes
            await this.loadSettings();

            this.state = "success";
            this.renderToast(html`${__("Settings saved successfully")}`, "success");
        } catch (error) {
            this.state = "error";
            this.renderToast(html`${__("Failed to save settings")}`, "error");
            console.error(error);
        }
    }

    private renderToast(
        message: string | TemplateResult,
        type: "success" | "error"
    ) {
        const lmsToast = document.createElement("lms-toast") as LMSToast;
        lmsToast.heading = type === "success" ? "Success" : "Error";
        lmsToast.message = message;
        lmsToast.type = type;
        this.renderRoot.appendChild(lmsToast);
    }

    override render() {
        return match(this.state)
            .with(
                "initial",
                "pending",
                () =>
                    html` <div class="mx-8">
                        <div class="skeleton skeleton-form"></div>
                    </div>`
            )
            .with("saving", () => html`
                <div class="mx-8">
                    <div class="text-center p-4">
                        ${__("Saving settings...")}
                    </div>
                </div>
            `)
            .with(
                "success",
                "error",
                () => html`
                    <div class="mx-8 my-4">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <!-- Configuration Form -->
                            <div class="card bg-white shadow-lg">
                                <div class="card-body">
                                    <h2 class="card-title text-2xl mb-4">
                                        ${__("OPAC Events Widget Configuration")}
                                    </h2>
                                    <form @submit=${this.handleSave} class="space-y-6">
                            <!-- Enable Widget -->
                            <div class="form-control">
                                <label class="label cursor-pointer justify-start">
                                    <input
                                        type="checkbox"
                                        name="widget_enabled"
                                        value="1"
                                        ?checked=${this.settings
                                            .widget_enabled === 1}
                                        class="checkbox checkbox-primary"
                                    />
                                    <span class="label-text ml-2"
                                        >${__("Enable widget on OPAC homepage")}</span
                                    >
                                </label>
                            </div>

                            <!-- Auto-inject Widget -->
                            <div class="form-control">
                                <label class="label cursor-pointer justify-start">
                                    <input
                                        type="checkbox"
                                        name="widget_auto_inject"
                                        value="1"
                                        ?checked=${this.settings
                                            .widget_auto_inject === 1}
                                        @change=${(e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            this.settings.widget_auto_inject = target.checked
                                                ? 1
                                                : 0;
                                        }}
                                        class="checkbox checkbox-primary"
                                    />
                                    <span class="label-text ml-2"
                                        >${__("Automatically inject widget on OPAC main page")}</span
                                    >
                                </label>
                                <label class="label">
                                    <span class="label-text-alt">
                                        ${__("If disabled, manual embedding instructions will be shown")}
                                    </span>
                                </label>
                            </div>

                            <!-- Manual Embedding Instructions -->
                            ${this.settings.widget_auto_inject !== 1
                                ? html`
                                      <div class="alert alert-info">
                                          <div>
                                              <h3 class="font-bold">
                                                  ${__("Manual Widget Embedding")}
                                              </h3>
                                              <p class="text-sm mt-2">
                                                  ${__("Add the following HTML code to your OPACMainUserBlock or OPACUserJS system preference:")}
                                              </p>
                                              <pre class="bg-base-200 p-3 rounded mt-2 text-sm overflow-x-auto"><code>&lt;lms-opac-events-widget&gt;&lt;/lms-opac-events-widget&gt;</code></pre>
                                          </div>
                                      </div>
                                  `
                                : nothing}

                            <!-- Widget Title -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">${__("Widget Title")}</span>
                                </label>
                                <input
                                    type="text"
                                    name="widget_title"
                                    value=${this.settings.widget_title}
                                    placeholder=${attr__("e.g., Upcoming Events")}
                                    class="input input-bordered w-full"
                                />
                                <label class="label">
                                    <span class="label-text-alt">
                                        ${__("The heading text displayed at the top of the widget")}
                                    </span>
                                </label>
                            </div>

                            <!-- Display Mode -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">${__("Display Mode")}</span>
                                </label>
                                <select
                                    name="widget_display_mode"
                                    class="select select-bordered w-full"
                                    @change=${(e: Event) => {
                                        const target = e.target as HTMLSelectElement;
                                        this.settings.widget_display_mode = target.value;
                                        this.requestUpdate();
                                    }}
                                >
                                    <option
                                        value="count"
                                        ?selected=${this.settings
                                            .widget_display_mode === "count"}
                                    >
                                        ${__("Show next X events")}
                                    </option>
                                    <option
                                        value="period"
                                        ?selected=${this.settings
                                            .widget_display_mode === "period"}
                                    >
                                        ${__("Show events in time period")}
                                    </option>
                                    <option
                                        value="manual"
                                        ?selected=${this.settings
                                            .widget_display_mode === "manual"}
                                    >
                                        ${__("Manually select events")}
                                    </option>
                                </select>
                            </div>

                            <!-- Event Count (when display mode is count) -->
                            ${this.settings.widget_display_mode === "count"
                                ? html`
                                      <div class="form-control">
                                          <label class="label">
                                              <span class="label-text">${__("Number of Events")}</span>
                                          </label>
                                          <input
                                              type="number"
                                              name="widget_event_count"
                                              value=${this.settings
                                                  .widget_event_count}
                                              min="1"
                                              max="20"
                                              class="input input-bordered w-full"
                                          />
                                          <label class="label">
                                              <span class="label-text-alt">
                                                  ${__("How many upcoming events to display (1-20)")}
                                              </span>
                                          </label>
                                      </div>
                                  `
                                : nothing}

                            <!-- Time Period (when display mode is period) -->
                            ${this.settings.widget_display_mode === "period"
                                ? html`
                                      <div class="form-control">
                                          <label class="label">
                                              <span class="label-text">${__("Time Period (days)")}</span>
                                          </label>
                                          <select
                                              name="widget_time_period"
                                              class="select select-bordered w-full"
                                          >
                                              <option
                                                  value="7"
                                                  ?selected=${this.settings
                                                      .widget_time_period === "7"}
                                              >
                                                  ${__("Current/Next 7 days")}
                                              </option>
                                              <option
                                                  value="14"
                                                  ?selected=${this.settings
                                                      .widget_time_period === "14"}
                                              >
                                                  ${__("Next 14 days")}
                                              </option>
                                              <option
                                                  value="30"
                                                  ?selected=${this.settings
                                                      .widget_time_period === "30"}
                                              >
                                                  ${__("Next 30 days")}
                                              </option>
                                          </select>
                                      </div>
                                  `
                                : nothing}

                            <!-- Manual Event Selection (when display mode is manual) -->
                            ${this.settings.widget_display_mode === "manual"
                                ? html`
                                      <div class="form-control">
                                          <label class="label">
                                              <span class="label-text">${__("Select Events")}</span>
                                          </label>
                                          <input
                                              type="hidden"
                                              name="widget_selected_events"
                                              value=${this.settings.widget_selected_events}
                                          />
                                          <div class="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                                              ${this.availableEvents.length === 0
                                                  ? html`
                                                        <p class="text-sm text-gray-500">
                                                            ${__("No upcoming events available")}
                                                        </p>
                                                    `
                                                  : this.availableEvents.map((event) => {
                                                        const selectedIds = JSON.parse(
                                                            this.settings.widget_selected_events
                                                        );
                                                        const isChecked = selectedIds.includes(
                                                            event.id
                                                        );
                                                        return html`
                                                            <label class="label cursor-pointer justify-start">
                                                                <input
                                                                    type="checkbox"
                                                                    class="checkbox checkbox-primary mr-2"
                                                                    value=${event.id.toString()}
                                                                    ?checked=${isChecked}
                                                                    @change=${this.handleEventSelection}
                                                                />
                                                                <div class="flex flex-col">
                                                                    <span class="label-text font-medium">
                                                                        ${event.name}
                                                                    </span>
                                                                    <span class="label-text-alt text-xs">
                                                                        ${new Date(
                                                                            event.start_time
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </label>
                                                        `;
                                                    })}
                                          </div>
                                          <label class="label">
                                              <span class="label-text-alt">
                                                  ${__("Select which events to display in the widget")}
                                              </span>
                                          </label>
                                      </div>
                                  `
                                : nothing}

                            <!-- Layout -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">${__("Widget Layout")}</span>
                                </label>
                                <select
                                    name="widget_layout"
                                    class="select select-bordered w-full"
                                >
                                    <option
                                        value="vertical"
                                        ?selected=${this.settings.widget_layout === "vertical"}
                                    >
                                        ${__("Vertical List")}
                                    </option>
                                    <option
                                        value="horizontal"
                                        ?selected=${this.settings.widget_layout === "horizontal"}
                                    >
                                        ${__("Horizontal Scrollable List")}
                                    </option>
                                </select>
                                <label class="label">
                                    <span class="label-text-alt">
                                        ${__("Choose the layout style for the widget")}
                                    </span>
                                </label>
                            </div>

                            <!-- All Events Button Text -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">${__('"All Events" Button Text')}</span>
                                </label>
                                <input
                                    type="text"
                                    name="widget_all_events_text"
                                    value=${this.settings.widget_all_events_text}
                                    placeholder=${attr__("e.g., Alle Veranstaltungen")}
                                    class="input input-bordered w-full"
                                />
                                <label class="label">
                                    <span class="label-text-alt">
                                        ${__("Text for the button at the bottom of the widget")}
                                    </span>
                                </label>
                            </div>

                            <!-- Submit Button -->
                            <div class="form-control mt-6">
                                <button
                                    type="submit"
                                    class="btn btn-primary"
                                    ?disabled=${this.state === "saving"}
                                >
                                    ${this.state === "saving"
                                        ? __("Saving...")
                                        : __("Save Settings")}
                                </button>
                            </div>
                        </form>
                                </div>
                            </div>

                            <!-- Live Preview -->
                            <div class="card bg-white shadow-lg">
                                <div class="card-body">
                                    <h2 class="card-title text-2xl mb-4">
                                        ${__("Preview")}
                                    </h2>
                                    <div class="alert alert-info mb-4">
                                        <span class="text-sm">
                                            ${__("This preview shows how the widget will appear on the OPAC. Use the location filter in the widget to preview different locations.")}
                                        </span>
                                    </div>

                                    <lms-opac-events-widget></lms-opac-events-widget>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            )
            .exhaustive();
    }
}
