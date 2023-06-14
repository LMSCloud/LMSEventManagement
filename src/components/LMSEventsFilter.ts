import { css, html, LitElement } from "lit";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { requestHandler } from "../lib/RequestHandler";
import { attr__, __ } from "../lib/translate";
import { deepCopy, throttle } from "../lib/utilities";
import { skeletonStyles } from "../styles/skeleton";
import { utilityStyles } from "../styles/utilities";
import { tailwindStyles } from "../tailwind.lit";
import {
    Facets,
    LMSEvent,
    LMSEventType,
    LMSLocation,
    LMSSettingResponse,
    LMSTargetGroup,
} from "../types/common";
import LMSDropdown from "./LMSDropdown";
import LMSSearch from "./LMSSearch";

declare global {
    interface HTMLElementTagNameMap {
        "lms-search": LMSSearch;
        "lms-dropdown": LMSDropdown;
    }
}

@customElement("lms-events-filter")
export default class LMSEventsFilter extends LitElement {
    private shouldFold = window.innerWidth <= 992;

    @property({ type: Array }) events: LMSEvent[] = [];

    @property({ type: String }) facetsStrategy: "preserve" | "update" =
        "preserve";

    @property({ type: Boolean }) isHidden = this.shouldFold;

    @property({ type: Array }) settings: LMSSettingResponse[] = [];

    @state() facets: Partial<Facets> = {};

    @state() event_types: LMSEventType[] = [];

    @state() target_groups: LMSTargetGroup[] = [];

    @state() locations: LMSLocation[] = [];

    @state() activeFilters: Map<string, string | boolean> = new Map();

    @queryAll("input") inputs!: NodeListOf<HTMLInputElement>;

    @queryAll("lms-dropdown") lmsDropdowns!: NodeListOf<LMSDropdown>;

    private inputHandlers: {
        [type: string]: (input: HTMLInputElement) => string | boolean;
    } = {
        checkbox: (input: HTMLInputElement) => {
            if (input.id === "open_registration") {
                return input.checked;
            }

            const { value } = input;
            if (value) {
                return input.checked ? value : false;
            }

            return input.checked ? input.id : false;
        },
        radio: (input: HTMLInputElement) =>
            input.checked ? input.value : false,
        date: (input: HTMLInputElement) => input.value,
        number: (input: HTMLInputElement) => input.value,
        default: (input: HTMLInputElement) => input.value,
    };

    private resetHandlers: {
        [type: string]: (input: HTMLInputElement) => void;
    } = {
        checkbox: (input: HTMLInputElement) => {
            if (input.id === "open_registration") {
                input.checked = true;
                return;
            }
            input.checked = false;
        },
        radio: (input: HTMLInputElement) => {
            input.checked = false;
        },
        date: (input: HTMLInputElement) => {
            input.value = "";
        },
        number: (input: HTMLInputElement) => {
            if (["min_age", "max_age"].includes(input.id)) {
                input.value = "";
                return;
            }
            input.value = input.min;
        },
        default: (input: HTMLInputElement) => {
            input.value = "";
        },
    };

    private _eventsDeepCopy: LMSEvent[] = [];

    private get eventsDeepCopy(): LMSEvent[] {
        return this._eventsDeepCopy;
    }

    private set eventsDeepCopy(value: LMSEvent[]) {
        if (this._eventsDeepCopy.length === 0) {
            this._eventsDeepCopy = value;
        }
    }

    private facetsStrategyManager() {
        switch (this.facetsStrategy) {
            case "preserve":
                return this.eventsDeepCopy;
            case "update":
                return this.events;
            default:
                throw new Error("Invalid facetsStrategy");
        }
    }

    private throttledHandleResize: () => void;

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        utilityStyles,
        css`
            .gap-3 {
                gap: 1rem;
            }

            .nobr {
                white-space: nowrap;
            }
        `,
    ];

    constructor() {
        super();
        this.throttledHandleResize = throttle(
            this.handleResize.bind(this),
            250
        );
    }

    private handleResize() {
        this.shouldFold = window.innerWidth <= 992;
        this.isHidden = this.shouldFold;
        this.requestUpdate();
    }

    override connectedCallback() {
        super.connectedCallback();

        window.addEventListener("resize", this.throttledHandleResize);

        fetch("/api/v1/contrib/eventmanagement/public/settings")
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
            .request("getEventTypesPublic")
            .then((response) => response.json())
            .then(
                (event_types: LMSEventType[]) =>
                    (this.event_types = event_types)
            );

        requestHandler
            .request("getTargetGroupsPublic")
            .then((response) => response.json())
            .then(
                (target_groups: LMSTargetGroup[]) =>
                    (this.target_groups = target_groups)
            );

        requestHandler
            .request("getLocationsPublic")
            .then((response) => response.json())
            .then((locations: LMSLocation[]) => (this.locations = locations));
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("resize", this.throttledHandleResize);
    }

    override willUpdate() {
        this.eventsDeepCopy = deepCopy(this.events);
        const events = this.facetsStrategyManager();
        if (!events.length) return;
        this.facets = {
            eventTypeIds: [...new Set(events.map((event) => event.event_type))],
            targetGroupIds: [
                ...new Set(
                    events.flatMap((event: any) =>
                        event.target_groups.map((target_group: any) =>
                            target_group.selected
                                ? target_group.target_group_id
                                : NaN
                        )
                    )
                ),
            ].filter(Number.isInteger),
            locationIds: [...new Set(events.map((event) => event.location))],
            ...events
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
        this.inputs.forEach((input) => this.resetHandlers[input.type](input));
        this.dispatchEvent(
            new CustomEvent("filter", {
                detail: "",
                composed: true,
                bubbles: true,
            })
        );
    }

    private isAllowedFilter(
        name: string | boolean | undefined,
        value: unknown,
        exclude: string[]
    ) {
        if (!name) return false;
        return !(name && exclude.includes(name.toString()) && value === false);
    }

    private getParamsFromActiveFilters() {
        return [...(this.inputs ?? [])]
            .filter((input) => input.value || input.checked)
            .map((input) => {
                const handler =
                    this.inputHandlers?.[input.type] ||
                    this.inputHandlers.default;
                if (!handler) return [input.name, undefined];
                const value = handler(input);
                return [input.name, value];
            })
            .filter(([name, value]) =>
                this.isAllowedFilter(name, value, [
                    "event_type",
                    "target_group",
                    "location",
                    "_order_by",
                ])
            );
    }

    private handleChange() {
        const query = new URLSearchParams();
        this.getParamsFromActiveFilters().forEach(([name, value]) => {
            if (typeof name === "string" && value !== undefined) {
                return query.append(name, value?.toString());
            }
        });

        this.dispatchEvent(
            new CustomEvent("filter", {
                detail: query.toString(),
                composed: true,
                bubbles: true,
            })
        );
    }

    private handleSearch(e: CustomEvent) {
        const { q } = e.detail;
        const query = new URLSearchParams();
        this.getParamsFromActiveFilters().forEach(([name, value]) => {
            if (typeof name === "string" && value !== undefined) {
                return query.append(name, value?.toString());
            }
        });
        this.dispatchEvent(
            new CustomEvent("search", {
                detail: query.toString() + (q ? `&q=${q}` : ""),
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

    private handleHideToggle() {
        this.isHidden = !this.isHidden;
        this.dispatchEvent(
            new CustomEvent("hide", {
                detail: this.isHidden,
                composed: true,
                bubbles: true,
            })
        );
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
                this.settings instanceof Array
                    ? this.settings.find(
                          (setting) => setting.plugin_key === plugin_key
                      )?.plugin_value
                    : undefined
            )
        );
    }

    override render() {
        return html`
            <div class="mx-8" @change=${this.handleChange}>
                <div
                    class="sticky top-4 z-10 mb-8 rounded-2xl bg-base-100 p-4 shadow-sm"
                >
                    <div
                        class="${classMap({
                            "justify-between": !this.isHidden,
                            "justify-center": this.isHidden,
                            "flex-col": this.shouldFold,
                        })} flex items-center gap-4"
                    >
                        <div
                            class="${classMap({
                                hidden: this.shouldFold,
                            })} flex-none"
                        >
                            <h5
                                class="${classMap({
                                    inline: !this.shouldFold,
                                })} whitespace-nowrap"
                            >
                                ${__("Filter")}
                            </h5>
                        </div>

                        <div
                            class="${classMap({
                                "mb-3": this.shouldFold,
                            })} w-32 flex-auto"
                        >
                            <lms-search
                                @search=${this.handleSearch}
                                .sortableColumns=${["name", "description"]}
                            ></lms-search>
                        </div>

                        <div class="flex-auto">
                            <div
                                class="${classMap({
                                    hidden: !this.shouldFold,
                                    "w-full": this.shouldFold,
                                })}"
                            >
                                <button
                                    type="button"
                                    class="btn-secondary btn-outline btn-sm btn"
                                    @click=${this.handleHideToggle}
                                    aria-label=${this.isHidden
                                        ? attr__("Show filters")
                                        : attr__("Hide filters")}
                                >
                                    ${this.isHidden
                                        ? __("Show filters")
                                        : __("Hide filters")}
                                </button>
                                <button
                                    type="button"
                                    class="btn-secondary btn-outline btn-sm btn"
                                    @click=${this.handleReset}
                                >
                                    ${__("Reset filters")}
                                </button>
                            </div>

                            <div
                                class="dropdowns ${classMap({
                                    flex: !this.shouldFold,
                                    "flex-wrap": !this.shouldFold,
                                    "gap-3": !this.shouldFold,
                                })}"
                            >
                                <lms-dropdown
                                    .isHidden=${this.isHidden}
                                    .shouldFold=${this.shouldFold}
                                    .label=${__("Sort by")}
                                    @toggle=${this.handleDropdownToggle}
                                >
                                    ${map(
                                        [
                                            "start_time",
                                            "end_time",
                                            "event_type",
                                            "location",
                                        ],
                                        (value, index) => html`
                                            <div class="form-control">
                                                <label
                                                    for="_order_by_${value}"
                                                    class="label cursor-pointer"
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
                                    .isHidden=${this.isHidden}
                                    .shouldFold=${this.shouldFold}
                                    .label=${__("Event Type")}
                                    @toggle=${this.handleDropdownToggle}
                                >
                                    ${map(
                                        this.facets.eventTypeIds,
                                        (eventTypeId) => html`
                                            <div class="form-control">
                                                <label
                                                    class="label cursor-pointer"
                                                    for="event_type_${eventTypeId}"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        class="checkbox mr-2"
                                                        name="event_type"
                                                        id="event_type_${eventTypeId}"
                                                        value=${eventTypeId}
                                                    />
                                                    <span class="label-text"
                                                        >${this.event_types.find(
                                                            (event_type) =>
                                                                event_type.id ===
                                                                eventTypeId
                                                        )?.name}</span
                                                    >
                                                </label>
                                            </div>
                                        `
                                    )}
                                </lms-dropdown>

                                <lms-dropdown
                                    .isHidden=${this.isHidden}
                                    .shouldFold=${this.shouldFold}
                                    .label=${__("Target Group")}
                                    @toggle=${this.handleDropdownToggle}
                                >
                                    ${map(
                                        this.facets.targetGroupIds,
                                        (targetGroupId) => html`
                                            <div class="form-control">
                                                <label
                                                    class="label cursor-pointer"
                                                    for="target_group_${targetGroupId}"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        class="checkbox mr-2"
                                                        name="target_group"
                                                        id="target_group_${targetGroupId}"
                                                        value=${targetGroupId}
                                                    />
                                                    <span class="label-text">
                                                        ${this.target_groups.find(
                                                            (target_group) =>
                                                                target_group.id ===
                                                                targetGroupId
                                                        )?.name}
                                                    </span>
                                                </label>
                                            </div>
                                        `
                                    )}
                                </lms-dropdown>

                                <lms-dropdown
                                    .isHidden=${this.isHidden}
                                    .shouldFold=${this.shouldFold}
                                    .label=${__("Age")}
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
                                            class="input-bordered input w-full"
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
                                            class="input-bordered input w-full"
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
                                    .isHidden=${this.isHidden}
                                    .shouldFold=${this.shouldFold}
                                    .label=${__("Registration & Dates")}
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
                                            class="label cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                class="checkbox"
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
                                            class="input-bordered input w-full"
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
                                            class="input-bordered input w-full"
                                            id="end_time"
                                            name="end_time"
                                        /></div
                                ></lms-dropdown>

                                <lms-dropdown
                                    .isHidden=${this.isHidden}
                                    .shouldFold=${this.shouldFold}
                                    .label=${__("Location")}
                                    @toggle=${this.handleDropdownToggle}
                                >
                                    ${map(
                                        this.facets.locationIds,
                                        (locationId) =>
                                            html` <div class="form-control">
                                                <label
                                                    class="label cursor-pointer"
                                                    for="location_${locationId}"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        class="checkbox mr-2"
                                                        name="location"
                                                        id="location_${locationId}"
                                                        value=${locationId}
                                                    />
                                                    <span class="label-text">
                                                        ${this.locations.find(
                                                            (location) =>
                                                                location.id ===
                                                                locationId
                                                        )?.name}
                                                    </span>
                                                </label>
                                            </div>`
                                    )}
                                </lms-dropdown>

                                <lms-dropdown
                                    .isHidden=${this.isHidden}
                                    .shouldFold=${this.shouldFold}
                                    .label=${__("Fee")}
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
                                            class="input-bordered input w-full"
                                            id="fee"
                                            name="fee"
                                            @input=${this.emitChange}
                                        />
                                    </div>
                                </lms-dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <slot></slot>
                </div>
            </div>
        `;
    }
}
