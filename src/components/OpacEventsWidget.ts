import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
    @property({ type: String, attribute: "page-url" }) pageUrl: string = "";

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
            /*
             * Design tokens — override any of these from the host page
             * (e.g. via OPACUserCSS) to restyle the widget without
             * piercing the shadow DOM.
             *
             * Defaults pull from Koha's Bootstrap CSS variables so the
             * widget blends in with the surrounding OPAC theme. 22.11
             * ships Bootstrap 4 without CSS variables, so the var()
             * fallbacks below are what actually applies there; 25.11
             * ships Bootstrap 5 and customises the same hex values via
             * SCSS, so --bs-* resolves to the matching theme tokens.
             */
            --widget-bg-color: var(--bs-body-bg, transparent);
            --widget-border-color: var(--bs-border-color, #ddd);
            --widget-border-width: 1px;
            --widget-border-radius: var(--bs-border-radius, 3px);
            --widget-padding: 1rem;
            --widget-spacing: 1rem;
            --widget-spacing-sm: 0.5rem;
            --widget-spacing-xs: 0.25rem;
            --widget-spacing-lg: 2rem;

            /*
             * Heading defaults mirror Koha's h2: $h2-font-size = 1.4rem,
             * $headings-font-weight = 600, $headings-line-height = 1.2,
             * $headings-color = $gray-550 (#727272). Bootstrap 5.3 also
             * exposes --bs-heading-color at runtime, which Koha picks up
             * when present.
             */
            --header-font-size: 1.4rem;
            --header-font-weight: 600;
            --header-line-height: 1.2;
            --header-text-color: var(
                --bs-heading-color,
                var(--bs-body-color, #727272)
            );

            --accent-color: var(--bs-link-color, #0074ad);
            --accent-color-hover: var(--bs-link-hover-color, #005580);

            --text-color: var(--bs-body-color, inherit);
            --text-color-muted: var(--bs-secondary-color, #727272);
            --text-color-on-accent: #fff;

            --event-bg-color: var(--bs-tertiary-bg, #f3f3f3);
            --event-bg-color-hover: var(--bs-secondary-bg, #dddddd);
            --event-border-color: var(--accent-color);
            --event-border-width: 2px;
            --event-padding: 0.75rem;
            --event-min-width-horizontal: 250px;

            --input-padding: 0.5rem;
            --input-font-size: 0.9rem;
            --input-border-radius: var(--widget-border-radius);

            /*
             * Koha's --bs-primary is Bootstrap's blue; the green "action"
             * colour is applied via .btn-primary overrides in SCSS rather
             * than exposed as a CSS variable. We hardcode #548300 to
             * match and let admins override via OPACUserCSS for custom
             * brands.
             */
            --button-bg-color: #548300;
            --button-bg-color-hover: #436900;
            --button-text-color: var(--text-color-on-accent);
            --button-padding-y: 0.5rem;
            --button-padding-x: 1.25rem;
            --button-font-weight: 500;
            --button-border-radius: var(--widget-border-radius);

            --error-color: var(--bs-danger, #d32f2f);
            --spinner-size: 32px;
            --spinner-border-width: 2px;
            --spinner-bg-color: var(--bs-secondary-bg, #f3f3f3);

            --transition-duration: 0.15s;

            display: block;
            color: var(--text-color);
            font-family: inherit;
            line-height: inherit;
        }

        .widget-container {
            background: var(--widget-bg-color);
            padding: var(--widget-padding);
        }

        .widget-header {
            margin: 0 0 var(--widget-spacing);
            padding-bottom: var(--widget-spacing-sm);
            border-bottom: var(--widget-border-width) solid
                var(--widget-border-color);
            font-family: inherit;
            font-size: var(--header-font-size);
            font-weight: var(--header-font-weight);
            line-height: var(--header-line-height);
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
            border-left: var(--event-border-width) solid
                var(--event-border-color);
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
            border-top: var(--widget-border-width) solid
                var(--widget-border-color);
            text-align: center;
        }

        .all-events-button {
            display: inline-block;
            background: var(--button-bg-color);
            color: var(--button-text-color);
            padding: var(--button-padding-y) var(--button-padding-x);
            text-decoration: none;
            font-weight: var(--button-font-weight);
            border: none;
            border-radius: var(--button-border-radius);
            transition: background var(--transition-duration);
        }

        .all-events-button:hover {
            background: var(--button-bg-color-hover);
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

    override updated(
        changedProperties: Map<string | number | symbol, unknown>,
    ) {
        super.updated(changedProperties);
        // Reload events when selectedLocation changes
        if (changedProperties.has("selectedLocation") && this.config.enabled) {
            this.loadEvents();
        }
    }

    private async loadConfig() {
        try {
            const response = await requestHandler.get({
                endpoint: "settingsPublic",
            });
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
                displayMode:
                    widgetSettings.display_mode || this.config.displayMode,
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
            const response = await requestHandler.get({
                endpoint: "locationsPublic",
            });
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

            // Use server-side sorting for consistency
            params.append("_order_by", "start_time");

            // Calculate time range if using period mode
            if (this.config.displayMode === "period") {
                const now = new Date();
                const endDate = new Date(
                    now.getTime() +
                        this.config.timePeriod * 24 * 60 * 60 * 1000,
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

            // Keep events that haven't ended yet (includes currently-running ones).
            const now = new Date();
            events = events.filter(
                (e: EventData) => new Date(e.end_time) > now,
            );

            // Filter by location if selected by user
            if (this.selectedLocation) {
                events = events.filter(
                    (e: EventData) => e.location === this.selectedLocation,
                );
            }

            // Handle different display modes
            if (this.config.displayMode === "manual") {
                // Show only selected events
                if (this.config.selectedEvents.length > 0) {
                    events = events.filter((e: EventData) =>
                        this.config.selectedEvents.includes(e.id),
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
        if (!this.pageUrl) return "";
        return `${this.pageUrl}#event-${eventId}`;
    }

    private getAllEventsUrl(): string {
        return this.pageUrl;
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
                    <h2 class="widget-header">${this.config.title}</h2>

                    ${this.locations.length > 0
                        ? html`
                              <div class="location-filter">
                                  <select
                                      @change=${(e: Event) => {
                                          const target =
                                              e.target as HTMLSelectElement;
                                          this.selectedLocation = target.value
                                              ? Number(target.value)
                                              : null;
                                      }}
                                  >
                                      <option value="">
                                          ${__("All Locations")}
                                      </option>
                                      ${this.locations.map(
                                          (location) => html`
                                              <option
                                                  value="${location.id}"
                                                  ?selected=${this
                                                      .selectedLocation ===
                                                  location.id}
                                              >
                                                  ${location.name}
                                              </option>
                                          `,
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
                <h2 class="widget-header">${this.config.title}</h2>

                ${this.locations.length > 0
                    ? html`
                          <div class="location-filter">
                              <select
                                  @change=${(e: Event) => {
                                      const target =
                                          e.target as HTMLSelectElement;
                                      this.selectedLocation = target.value
                                          ? Number(target.value)
                                          : null;
                                  }}
                              >
                                  <option value="">
                                      ${__("All Locations")}
                                  </option>
                                  ${this.locations.map(
                                      (location) => html`
                                          <option
                                              value="${location.id}"
                                              ?selected=${this
                                                  .selectedLocation ===
                                              location.id}
                                          >
                                              ${location.name}
                                          </option>
                                      `,
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
                                            ${this.formatDateTime(
                                                event.start_time,
                                            )}
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
                        `,
                    )}
                </ul>
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
}
