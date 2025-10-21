import {
    faCalendar,
    faCreditCard,
    faFilter,
    faVcard,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, html, nothing } from "lit";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";
import { repeat } from "lit/directives/repeat.js";
import { P, match } from "ts-pattern";
import { requestHandler } from "../../lib/RequestHandler/RequestHandler";
import { __, attr__ } from "../../lib/translate";
import { throttle } from "../../lib/utilities";
import { skeletonStyles } from "../../styles/skeleton";
import { utilityStyles } from "../../styles/utilities";
import { tailwindStyles } from "../../tailwind.lit";
import {
    Facets,
    LMSEvent,
    LMSEventType,
    LMSLocation,
    LMSSettingResponse,
    LMSTargetGroup,
} from "../../types/common";
import LMSDropdown from "../LMSDropdown";
import LMSSearch from "../LMSSearch";

declare global {
    interface HTMLElementTagNameMap {
        "lms-search": LMSSearch;
        "lms-dropdown": LMSDropdown;
    }
}

@customElement("lms-events-filter")
export default class LMSEventsFilter extends LitElement {
    private shouldFold = window.matchMedia("(max-width: 1024px)").matches;

    @property({ type: Array }) events?: Array<LMSEvent>;

    @property({ type: Boolean }) shouldUpdateFacets = true;

    @property({ type: Boolean }) filtersExpanded = !this.shouldFold;

    @property({ type: Array }) settings?: Array<LMSSettingResponse>;

    @state() facets?: Partial<Facets>;

    @state() event_types?: Array<LMSEventType>;

    @state() target_groups?: Array<LMSTargetGroup>;

    @state() locations?: Array<LMSLocation>;

    @state() activeFilters: Array<{ label: string; inputId: string; name: string; value: string }> = [];

    @queryAll("input") inputs!: NodeListOf<HTMLInputElement>;

    @queryAll("lms-dropdown") lmsDropdowns!: NodeListOf<LMSDropdown>;

    private resetInputs() {
        for (let i = 0; i < this.inputs.length; i++) {
            const input = this.inputs[i];
            if (!input) {
                return;
            }

            match(input.type)
                .with("checkbox", () => {
                    input.checked =
                        input.id === "open_registration" ? true : false;
                })
                .with("radio", () => {
                    input.checked = false;
                })
                .with("date", () => {
                    input.value = "";
                })
                .with("number", () => {
                    input.value = ["min_age", "max_age"].includes(input.id)
                        ? ""
                        : input.min;
                })
                .otherwise(() => {
                    input.value = "";
                });
        }
    }

    private getActiveFilters() {
        const activeFilters = [];
        for (let i = 0; i < this.inputs.length; i++) {
            const input = this.inputs[i];
            if (!input) {
                return;
            }

            activeFilters.push(
                match(input.type)
                    .with("checkbox", () =>
                        match(input)
                            .with({ id: "open_registration" }, () => [
                                "open_registration",
                                input.checked,
                            ])
                            .with({ value: P.not("") }, () =>
                                input.checked
                                    ? [input.name, input.value]
                                    : undefined
                            )
                            .with({ checked: true }, () => [
                                input.name,
                                input.id,
                            ])
                            .otherwise(() => undefined)
                    )
                    .with("radio", () =>
                        input.checked ? [input.name, input.value] : undefined
                    )
                    .otherwise(() =>
                        input.value ? [input.name, input.value] : undefined
                    )
            );
        }

        return activeFilters.filter(Boolean);
    }

    private throttledHandleResize: () => void;

    static override styles = [tailwindStyles, skeletonStyles, utilityStyles];

    constructor() {
        super();
        this.throttledHandleResize = throttle(
            this.handleResize.bind(this),
            250
        );
    }

    private handleResize() {
        this.shouldFold = window.matchMedia("(max-width: 1024px)").matches;
        this.filtersExpanded = !this.shouldFold;
        this.requestUpdate();
    }

    override connectedCallback() {
        super.connectedCallback();

        window.addEventListener("resize", this.throttledHandleResize);

        requestHandler
            .get({ endpoint: "settingsPublic" })
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
            });

        requestHandler
            .get({ endpoint: "eventTypesPublic" })
            .then((response) => response.json())
            .then(
                (event_types: LMSEventType[]) =>
                    (this.event_types = event_types)
            );

        requestHandler
            .get({ endpoint: "targetGroupsPublic" })
            .then((response) => response.json())
            .then(
                (target_groups: LMSTargetGroup[]) =>
                    (this.target_groups = target_groups)
            );

        requestHandler
            .get({ endpoint: "locationsPublic" })
            .then((response) => response.json())
            .then((locations: LMSLocation[]) => (this.locations = locations));
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("resize", this.throttledHandleResize);
    }

    override updated() {
        // Always use bottom positioning - no left/right alignment
        if (!this.lmsDropdowns) {
            return;
        }

        this.lmsDropdowns.forEach((dropdown) => {
            dropdown.position = ["bottom"];
        });
    }

    override willUpdate() {
        if (!this.events?.length || !this.shouldUpdateFacets) {
            return;
        }

        this.facets = {
            eventTypeIds: [
                ...new Set(this.events.map((event) => event.event_type)),
            ].sort(),
            targetGroupIds: [
                ...new Set(
                    this.events.flatMap((event: any) =>
                        event.target_groups.map((target_group: any) =>
                            target_group.selected
                                ? target_group.target_group_id
                                : NaN
                        )
                    )
                ),
            ]
                .filter(Number.isInteger)
                .sort(),
            locationIds: [
                ...new Set(this.events.map((event) => event.location)),
            ].sort(),
            ...this.events
                .map((event: any) => {
                    const {
                        event_type,
                        location,
                        target_groups,
                        ...rest
                    } = // eslint-disable-line @typescript-eslint/no-unused-vars
                        event;
                    return rest;
                })
                .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        };
    }

    private handleReset() {
        this.resetInputs();

        // Update active filters state
        this.updateActiveFiltersState();

        this.dispatchEvent(
            new CustomEvent("filter", {
                detail: {
                    filters: this.getActiveFilters(),
                },
                composed: true,
                bubbles: true,
            })
        );
    }

    private handleChange() {
        // Update active filters state
        this.updateActiveFiltersState();

        this.dispatchEvent(
            new CustomEvent("filter", {
                detail: {
                    filters: this.getActiveFilters(),
                },
                composed: true,
                bubbles: true,
            })
        );
    }

    private updateActiveFiltersState() {
        this.activeFilters = this.getActiveFilterBadges();
    }

    private handleSearch(e: CustomEvent) {
        e.stopPropagation();
        const { q, search } = e.detail;
        this.dispatchEvent(
            new CustomEvent("search", {
                detail: {
                    filters: this.getActiveFilters(),
                    q,
                    search,
                },
                composed: true,
                bubbles: true,
            })
        );
    }

    private emitChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target) {
            target.dispatchEvent(
                new Event("change", { composed: true, bubbles: true })
            );
        }
    }

    private handleFiltersToggle() {
        this.filtersExpanded = !this.filtersExpanded;
    }

    private getActiveFilterBadges() {
        const badges: Array<{ label: string; inputId: string; name: string; value: string }> = [];

        for (let i = 0; i < this.inputs.length; i++) {
            const input = this.inputs[i];
            if (!input) continue;

            // Skip if not active
            if (input.type === "checkbox" && !input.checked) continue;
            if (input.type === "radio" && !input.checked) continue;
            if ((input.type === "text" || input.type === "date" || input.type === "number") && !input.value) continue;

            // Skip open_registration checkbox (it's a default filter)
            if (input.id === "open_registration") continue;

            // Get human-readable label
            let label = "";
            const inputLabel = input.closest(".form-control")?.querySelector("label")?.textContent?.trim() || input.name;

            if (input.type === "checkbox" || input.type === "radio") {
                // For checkboxes/radios, find the associated text
                const labelText = input.closest("label")?.querySelector(".label-text")?.textContent?.trim();
                label = labelText || inputLabel;
            } else {
                // For text/date/number inputs
                label = `${inputLabel}: ${input.value}`;
            }

            badges.push({
                label,
                inputId: input.id,
                name: input.name,
                value: input.value
            });
        }

        return badges;
    }


    private dismissFilter(inputId: string) {
        const input = this.shadowRoot?.querySelector(`#${inputId}`) as HTMLInputElement;
        if (!input) return;

        if (input.type === "checkbox" || input.type === "radio") {
            input.checked = false;
        } else {
            input.value = "";
        }

        // Trigger change event (which will update state via handleChange)
        input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    }

    private handleDropdownToggle(e: CustomEvent) {
        const { id, open } = e.detail;
        if (open) {
            this.lmsDropdowns.forEach((lmsDropdown) => {
                if (lmsDropdown.uuid !== id) {
                    lmsDropdown.close();
                }
            });
        }
    }

    private getSettingsValueForToggle(plugin_key: string) {
        return Boolean(
            Number(
                Array.isArray(this.settings)
                    ? this.settings.find(
                          (setting) => setting.plugin_key === plugin_key
                      )?.plugin_value
                    : undefined
            )
        );
    }

    private getSortedFilterOptions<T extends { id: number | null; name: string | null }>(
        ids: Array<number | null>,
        items: T[] | undefined
    ) {
        return ids
            .map((id) => ({
                id,
                name: items?.find((item) => item.id === id)?.name ?? "",
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    override render() {
        const filterCount = this.activeFilters.length;

        return html`
            <div @change=${this.handleChange}>
                <div
                    class="sticky top-0 z-10 mb-4 rounded-b-xl bg-base-100 shadow-lg"
                >
                    <!-- Top bar: Search + Filters button (always visible) -->
                    <div class="flex items-center gap-2 p-4">
                        <div class="flex-1">
                            <lms-search
                                @search=${this.handleSearch}
                                .sortableColumns=${["name", "description"]}
                            ></lms-search>
                        </div>
                        <button
                            type="button"
                            class="btn btn-ghost btn-sm gap-1"
                            @click=${this.handleFiltersToggle}
                            aria-label=${this.filtersExpanded
                                ? attr__("Hide filters")
                                : attr__("Show filters")}
                        >
                            ${litFontawesome(faFilter, {
                                className: "w-4 h-4",
                            })}
                            <span class="hidden sm:inline">${__("Filters")}</span>
                            ${filterCount > 0
                                ? html`<span class="badge badge-primary badge-sm"
                                      >${filterCount}</span
                                  >`
                                : nothing}
                        </button>
                    </div>

                    <!-- Expanded filters section -->
                    ${this.filtersExpanded
                        ? html`
                              <div class="border-t px-4 pb-4">
                                  <!-- Active filter badges -->
                                  ${filterCount > 0
                                      ? html`
                                            <div
                                                class="flex flex-wrap items-center gap-2 pt-3 pb-3"
                                            >
                                                ${this.activeFilters.map(
                                                    (badge) => html`
                                                        <div
                                                            class="badge badge-outline gap-1 h-8"
                                                        >
                                                            <span
                                                                >${badge.label}</span
                                                            >
                                                            <button
                                                                type="button"
                                                                class="btn btn-ghost btn-xs p-0 hover:text-error"
                                                                @click=${() =>
                                                                    this.dismissFilter(
                                                                        badge.inputId
                                                                    )}
                                                                aria-label=${attr__(
                                                                    "Remove filter"
                                                                )}
                                                            >
                                                                ${litFontawesome(
                                                                    faXmark,
                                                                    {
                                                                        className:
                                                                            "w-3 h-3",
                                                                    }
                                                                )}
                                                            </button>
                                                        </div>
                                                    `
                                                )}
                                                <button
                                                    type="button"
                                                    class="btn btn-outline btn-error btn-xs h-8"
                                                    @click=${this.handleReset}
                                                >
                                                    ${__("Clear all")}
                                                </button>
                                            </div>
                                        `
                                      : nothing}

                                  <!-- Filter dropdowns -->
                                  <div class="flex flex-col sm:flex-row flex-wrap gap-2 pt-2">
                            <lms-dropdown
                                .label=${__("Sort by")}
                                @toggle=${this.handleDropdownToggle}
                            >
                                ${map(
                                    ["start_time", "event_type", "location"],
                                    (value, index) => html`
                                        <div class="form-control">
                                            <label
                                                for="_order_by_${value}"
                                                class="label cursor-pointer justify-start"
                                            >
                                                <input
                                                    type="radio"
                                                    class="radio mr-2 checked:bg-primary"
                                                    id="_order_by_${value}"
                                                    name="_order_by"
                                                    value=${value}
                                                    ?checked=${index === 0}
                                                />
                                                <span class="label-text">
                                                    ${__(value)}
                                                </span>
                                            </label>
                                        </div>
                                    `
                                )}
                            </lms-dropdown>

                            <lms-dropdown
                                .label=${__("Event Type")}
                                @toggle=${this.handleDropdownToggle}
                            >
                                ${repeat(
                                    this.getSortedFilterOptions(
                                        this.facets?.eventTypeIds ?? [],
                                        this.event_types
                                    ),
                                    (item) => item.id,
                                    (item) => html`
                                        <div class="form-control">
                                            <label
                                                class="label cursor-pointer justify-start"
                                                for="event_type_${item.id}"
                                            >
                                                <input
                                                    type="checkbox"
                                                    class="checkbox mr-2"
                                                    name="event_type"
                                                    id="event_type_${item.id}"
                                                    value=${ifDefined(
                                                        item.id === null
                                                            ? undefined
                                                            : item.id
                                                    )}
                                                />
                                                <span class="label-text"
                                                    >${item.name}</span
                                                >
                                            </label>
                                        </div>
                                    `
                                )}
                            </lms-dropdown>

                            <lms-dropdown
                                .label=${__("Target Group")}
                                @toggle=${this.handleDropdownToggle}
                            >
                                ${repeat(
                                    this.getSortedFilterOptions(
                                        this.facets?.targetGroupIds ?? [],
                                        this.target_groups
                                    ),
                                    (item) => item.id,
                                    (item) => html`
                                        <div class="form-control">
                                            <label
                                                class="label cursor-pointer justify-start"
                                                for="target_group_${item.id}"
                                            >
                                                <input
                                                    type="checkbox"
                                                    class="checkbox mr-2 text-base"
                                                    name="target_group"
                                                    id="target_group_${item.id}"
                                                    value=${ifDefined(
                                                        item.id === null
                                                            ? undefined
                                                            : item.id
                                                    )}
                                                />
                                                <span class="label-text">
                                                    ${item.name}
                                                </span>
                                            </label>
                                        </div>
                                    `
                                )}
                            </lms-dropdown>

                            <lms-dropdown
                                .label=${__("Location")}
                                @toggle=${this.handleDropdownToggle}
                            >
                                ${repeat(
                                    this.getSortedFilterOptions(
                                        this.facets?.locationIds ?? [],
                                        this.locations
                                    ),
                                    (item) => item.id,
                                    (item) =>
                                        html` <div class="form-control">
                                            <label
                                                class="label cursor-pointer justify-start"
                                                for="location_${item.id}"
                                            >
                                                <input
                                                    type="checkbox"
                                                    class="checkbox mr-2"
                                                    name="location"
                                                    id="location_${item.id}"
                                                    value=${ifDefined(
                                                        item.id === null
                                                            ? undefined
                                                            : item.id
                                                    )}
                                                />
                                                <span class="label-text">
                                                    ${item.name}
                                                </span>
                                            </label>
                                        </div>`
                                )}
                            </lms-dropdown>

                            <lms-dropdown
                                .label=${__("Age")}
                                .icon=${litFontawesome(faVcard, {
                                    className: "w-4 h-4 inline-block",
                                })}
                                @toggle=${this.handleDropdownToggle}
                                class=${classMap({
                                    hidden: !this.getSettingsValueForToggle(
                                        "opac_filters_age_enabled"
                                    ),
                                })}
                            >
                                <div class="form-control w-full">
                                    <label for="min_age" class="label"
                                        >${__("Min Age")}</label
                                    >
                                    <input
                                        type="number"
                                        class="input input-bordered input-sm w-full"
                                        id="min_age"
                                        name="min_age"
                                        min="0"
                                        max="120"
                                        value=""
                                        @input=${this.emitChange}
                                    />
                                </div>
                                <div class="form-control w-full">
                                    <label for="max_age" class="label">
                                        ${__("Max Age")}</label
                                    >
                                    <input
                                        type="number"
                                        class="input input-bordered input-sm w-full"
                                        id="max_age"
                                        name="max_age"
                                        min="0"
                                        max="120"
                                        value=""
                                        @input=${this.emitChange}
                                    />
                                </div>
                            </lms-dropdown>

                            <lms-dropdown
                                .label=${__("Registration & Dates")}
                                .icon=${litFontawesome(faCalendar, {
                                    className: "w-4 h-4 inline-block",
                                })}
                                @toggle=${this.handleDropdownToggle}
                                class=${classMap({
                                    hidden: !this.getSettingsValueForToggle(
                                        "opac_filters_registration_and_dates_enabled"
                                    ),
                                })}
                            >
                                <div class="form-control">
                                    <label
                                        for="open_registration"
                                        class="label cursor-pointer justify-start"
                                    >
                                        <input
                                            type="checkbox"
                                            class="checkbox mr-2"
                                            id="open_registration"
                                            name="open_registration"
                                            checked
                                        />
                                        <span class="label-text">
                                            ${__("Open Registration")}
                                        </span>
                                    </label>
                                </div>
                                <div class="form-control w-full">
                                    <label for="start_time" class="label">
                                        <span class="label-text">
                                            ${__("Start Date")}</span
                                        >
                                    </label>
                                    <input
                                        type="date"
                                        class="input input-bordered input-sm w-full"
                                        id="start_time"
                                        name="start_time"
                                    />
                                    <label for="start_time" class="label">
                                        <span class="label-text">
                                            ${__("End Date")}</span
                                        >
                                    </label>
                                    <input
                                        type="date"
                                        class="input input-bordered input-sm w-full"
                                        id="end_time"
                                        name="end_time"
                                    /></div
                            ></lms-dropdown>

                            <lms-dropdown
                                .label=${__("Fee")}
                                .icon=${litFontawesome(faCreditCard, {
                                    className: "w-4 h-4 inline-block",
                                })}
                                @toggle=${this.handleDropdownToggle}
                                class=${classMap({
                                    hidden: !this.getSettingsValueForToggle(
                                        "opac_filters_fee_enabled"
                                    ),
                                })}
                            >
                                <div class="form-control">
                                    <label for="fee">
                                        <span class="label-text">
                                            ${__("Fee")}
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        class="input input-bordered input-sm w-full"
                                        id="fee"
                                        name="fee"
                                        @input=${this.emitChange}
                                    />
                                </div>
                            </lms-dropdown>
                                  </div>
                              </div>
                          `
                        : nothing}
                </div>
                <!-- Slot for the filterable content -->
                <slot></slot>
            </div>
        `;
    }
}
