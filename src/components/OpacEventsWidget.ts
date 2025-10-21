import { html, LitElement, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { __ } from "../lib/translate";

interface EventData {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    location?: number;
    location_name?: string;
    description?: string;
    image_id?: number;
}

@customElement("lms-opac-events-widget")
export default class OpacEventsWidget extends LitElement {
    @state() private events: EventData[] = [];
    @state() private loading = true;
    @state() private error = false;
    @state() private locations: Array<{ id: number; name: string }> = [];
    @state() private selectedLocation: number | null = null;
    @state() private config = {
        enabled: false,
        title: __("Upcoming Events"),
        displayMode: "count",
        layout: "vertical",
        eventCount: 5,
        timePeriod: 14,
        selectedEvents: [] as number[],
        allEventsText: __("All Events"),
    };

    static override styles = css`
        :host {
            /* Design Tokens */
            --widget-bg-color: #fff;
            --widget-border-color: #ddd;
            --widget-border-width: 1px;
            --widget-border-radius: 4px;
            --widget-padding: 1rem;
            --widget-spacing: 1rem;
            --widget-spacing-sm: 0.5rem;
            --widget-spacing-xs: 0.25rem;
            --widget-spacing-lg: 2rem;

            --header-font-size: 1.25rem;
            --header-font-weight: 600;
            --header-text-color: #333;

            --accent-color: #0076b6;
            --accent-color-hover: #005a8c;
            --accent-color-light: #e3f2fd;

            --text-color: inherit;
            --text-color-muted: #666;
            --text-color-on-accent: #fff;

            --event-bg-color: #fafafa;
            --event-bg-color-hover: #f0f0f0;
            --event-border-color: var(--accent-color);
            --event-border-width: 2px;
            --event-padding: 0.75rem;
            --event-min-width-horizontal: 250px;

            --input-padding: 0.5rem;
            --input-font-size: 0.9rem;
            --input-border-radius: var(--widget-border-radius);

            --button-padding-y: 0.5rem;
            --button-padding-x: 1.25rem;
            --button-font-weight: 500;

            --error-color: #d32f2f;
            --spinner-size: 32px;
            --spinner-border-width: 2px;
            --spinner-bg-color: #f3f3f3;

            --transition-duration: 0.15s;

            display: block;
            font-family: inherit;
        }

        .widget-container {
            background: var(--widget-bg-color);
            border: var(--widget-border-width) solid var(--widget-border-color);
            padding: var(--widget-padding);
        }

        .widget-header {
            font-size: var(--header-font-size);
            font-weight: var(--header-font-weight);
            margin-bottom: var(--widget-spacing);
            padding-bottom: var(--widget-spacing-sm);
            border-bottom: var(--widget-border-width) solid var(--widget-border-color);
            color: var(--header-text-color);
        }

        .location-filter {
            margin-bottom: var(--widget-spacing);
        }

        .location-filter select {
            width: 100%;
            padding: var(--input-padding);
            border: var(--widget-border-width) solid var(--widget-border-color);
            border-radius: var(--input-border-radius);
            font-size: var(--input-font-size);
            background: var(--widget-bg-color);
        }

        .events-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .events-list.horizontal {
            display: flex;
            overflow-x: auto;
            gap: var(--widget-spacing);
            padding-bottom: var(--widget-spacing-sm);
            -webkit-overflow-scrolling: touch;
        }

        .event-item {
            padding: var(--event-padding);
            margin-bottom: var(--widget-spacing-sm);
            border-left: var(--event-border-width) solid var(--event-border-color);
            background: var(--event-bg-color);
            transition: background var(--transition-duration);
            cursor: pointer;
        }

        .events-list.horizontal .event-item {
            min-width: var(--event-min-width-horizontal);
            margin-bottom: 0;
            flex-shrink: 0;
        }

        .event-item:hover {
            background: var(--event-bg-color-hover);
        }

        .event-link {
            text-decoration: none;
            color: var(--text-color);
            display: block;
        }

        .event-name {
            font-weight: var(--header-font-weight);
            color: var(--accent-color);
            margin-bottom: var(--widget-spacing-xs);
            font-size: 0.95rem;
        }

        .event-details {
            font-size: 0.85rem;
            color: var(--text-color-muted);
            display: flex;
            flex-direction: column;
            gap: var(--widget-spacing-xs);
        }

        .event-time,
        .event-location {
            display: block;
        }

        .widget-footer {
            margin-top: var(--widget-spacing);
            padding-top: var(--event-padding);
            border-top: var(--widget-border-width) solid var(--widget-border-color);
            text-align: center;
        }

        .all-events-button {
            display: inline-block;
            background: var(--accent-color);
            color: var(--text-color-on-accent);
            padding: var(--button-padding-y) var(--button-padding-x);
            text-decoration: none;
            font-weight: var(--button-font-weight);
            transition: background var(--transition-duration);
            border: none;
        }

        .all-events-button:hover {
            background: var(--accent-color-hover);
        }

        .loading,
        .error,
        .no-events {
            padding: var(--widget-spacing-lg);
            text-align: center;
            color: var(--text-color-muted);
        }

        .error {
            color: var(--error-color);
        }

        .loading-spinner {
            border: var(--spinner-border-width) solid var(--spinner-bg-color);
            border-top: var(--spinner-border-width) solid var(--accent-color);
            border-radius: 50%;
            width: var(--spinner-size);
            height: var(--spinner-size);
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `;

    override async connectedCallback() {
        super.connectedCallback();
        await this.loadConfig();
        await this.loadLocations();
        if (this.config.enabled) {
            await this.loadEvents();
        }
    }

    override updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        // Reload events when selectedLocation changes
        if (changedProperties.has("selectedLocation") && this.config.enabled) {
            this.loadEvents();
        }
    }

    private async loadConfig() {
        try {
            const response = await requestHandler.get({ endpoint: "settingsPublic" });
            const allSettings = await response.json();

            const widgetSettings = allSettings.reduce((acc: any, s: any) => {
                if (s.plugin_key.startsWith("widget_")) {
                    const key = s.plugin_key.replace("widget_", "");
                    acc[key] = s.plugin_value;
                }
                return acc;
            }, {});

            this.config = {
                enabled: widgetSettings.enabled === 1,
                title: widgetSettings.title || this.config.title,
                displayMode: widgetSettings.display_mode || this.config.displayMode,
                layout: widgetSettings.layout || this.config.layout,
                eventCount: parseInt(widgetSettings.event_count || "5", 10),
                timePeriod: parseInt(widgetSettings.time_period || "14", 10),
                selectedEvents: widgetSettings.selected_events
                    ? JSON.parse(widgetSettings.selected_events)
                    : [],
                allEventsText:
                    widgetSettings.all_events_text || this.config.allEventsText,
            };
        } catch (error) {
            console.error("Failed to load widget config:", error);
            this.config.enabled = false;
        }
    }

    private async loadLocations() {
        try {
            const response = await requestHandler.get({ endpoint: "locationsPublic" });
            const locations = await response.json();
            this.locations = locations.map((l: any) => ({
                id: l.id,
                name: l.name,
            }));
        } catch (error) {
            console.error("Failed to load locations:", error);
        }
    }

    private async loadEvents() {
        this.loading = true;
        this.error = false;

        try {
            // Build query parameters
            const params = new URLSearchParams();

            // Calculate time range if using period mode
            if (this.config.displayMode === "period") {
                const now = new Date();
                const endDate = new Date(
                    now.getTime() + this.config.timePeriod * 24 * 60 * 60 * 1000
                );
                params.append("start_time", now.toISOString());
                params.append("end_time", endDate.toISOString());
            }

            // Fetch events from public API
            const response = await requestHandler.get({
                endpoint: "eventsPublic",
                query: params.toString(),
            });
            let events = await response.json();

            // Filter only future events
            const now = new Date();
            events = events.filter(
                (e: EventData) => new Date(e.start_time) > now
            );

            // Filter by location if selected by user
            if (this.selectedLocation) {
                events = events.filter((e: EventData) =>
                    e.location === this.selectedLocation
                );
            }

            // Sort by start time
            events.sort(
                (a: EventData, b: EventData) =>
                    new Date(a.start_time).getTime() -
                    new Date(b.start_time).getTime()
            );

            // Handle different display modes
            if (this.config.displayMode === "manual") {
                // Show only selected events
                if (this.config.selectedEvents.length > 0) {
                    events = events.filter((e: EventData) =>
                        this.config.selectedEvents.includes(e.id)
                    );
                } else {
                    events = [];
                }
            } else if (this.config.displayMode === "count") {
                // Limit to count
                events = events.slice(0, this.config.eventCount);
            }

            this.events = events;
            this.loading = false;
        } catch (error) {
            console.error("Failed to load events:", error);
            this.error = true;
            this.loading = false;
        }
    }

    private formatDateTime(dateTimeString: string): string {
        const date = new Date(dateTimeString);
        const options: Intl.DateTimeFormatOptions = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return date.toLocaleDateString(undefined, options);
    }

    private getEventUrl(eventId: number): string {
        // Link to the events page - the SPA will handle showing the event
        // You could potentially add a hash or query param to auto-open the event details
        return `/cgi-bin/koha/opac-page.pl?code=lmscloud-eventmanagement#event-${eventId}`;
    }

    private getAllEventsUrl(): string {
        // Link to the main events OPAC page
        return "/cgi-bin/koha/opac-page.pl?code=lmscloud-eventmanagement";
    }

    override render() {
        if (!this.config.enabled) {
            return html``;
        }

        if (this.loading) {
            return html`
                <div class="widget-container">
                    <div class="loading">
                        <div class="loading-spinner"></div>
                        <p>${__("Loading events...")}</p>
                    </div>
                </div>
            `;
        }

        if (this.error) {
            return html`
                <div class="widget-container">
                    <div class="error">
                        ${__("Failed to load events. Please try again later.")}
                    </div>
                </div>
            `;
        }

        if (this.events.length === 0) {
            return html`
                <div class="widget-container">
                    <div class="widget-header">${this.config.title}</div>

                    ${this.locations.length > 0
                        ? html`
                            <div class="location-filter">
                                <select
                                    @change=${(e: Event) => {
                                        const target = e.target as HTMLSelectElement;
                                        this.selectedLocation = target.value ? Number(target.value) : null;
                                    }}
                                >
                                    <option value="">${__("All Locations")}</option>
                                    ${this.locations.map(
                                        (location) => html`
                                            <option
                                                value="${location.id}"
                                                ?selected=${this.selectedLocation === location.id}
                                            >
                                                ${location.name}
                                            </option>
                                        `
                                    )}
                                </select>
                            </div>
                        `
                        : nothing}

                    <div class="no-events">
                        ${__("No upcoming events at this time.")}
                    </div>
                    <div class="widget-footer">
                        <a
                            href="${this.getAllEventsUrl()}"
                            class="all-events-button"
                        >
                            ${this.config.allEventsText}
                        </a>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="widget-container">
                <div class="widget-header">${this.config.title}</div>

                ${this.locations.length > 0
                    ? html`
                        <div class="location-filter">
                            <select
                                @change=${(e: Event) => {
                                    const target = e.target as HTMLSelectElement;
                                    this.selectedLocation = target.value ? Number(target.value) : null;
                                }}
                            >
                                <option value="">${__("All Locations")}</option>
                                ${this.locations.map(
                                    (location) => html`
                                        <option
                                            value="${location.id}"
                                            ?selected=${this.selectedLocation === location.id}
                                        >
                                            ${location.name}
                                        </option>
                                    `
                                )}
                            </select>
                        </div>
                    `
                    : nothing}

                <ul
                    class="${classMap({
                        "events-list": true,
                        horizontal: this.config.layout === "horizontal",
                    })}"
                >
                    ${this.events.map(
                        (event) => html`
                            <li class="event-item">
                                <a
                                    href="${this.getEventUrl(event.id)}"
                                    class="event-link"
                                >
                                    <div class="event-name">${event.name}</div>
                                    <div class="event-details">
                                        <span class="event-time">
                                            ${this.formatDateTime(event.start_time)}
                                        </span>
                                        ${event.location_name
                                            ? html`
                                                  <span class="event-location">
                                                      ${event.location_name}
                                                  </span>
                                              `
                                            : nothing}
                                    </div>
                                </a>
                            </li>
                        `
                    )}
                </ul>
                <div class="widget-footer">
                    <a href="${this.getAllEventsUrl()}" class="all-events-button">
                        ${this.config.allEventsText}
                    </a>
                </div>
            </div>
        `;
    }
}
