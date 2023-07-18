import {
    faBullseye,
    faClock,
    faMapMarker,
    faSort,
    faTag,
    faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement } from "lit";
import {
    customElement,
    property,
    query,
    queryAll,
    state,
} from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { normalizeForInput } from "../../lib/converters/datetimeConverters";
import { __ } from "../../lib/translate";
import { utilityStyles } from "../../styles/utilities";
import { tailwindStyles } from "../../tailwind.lit";
import {
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    SortableColumns,
} from "../../types/common";
import LMSDataNavbar from "../LMSDataNavbar";
import LMSDropdown from "../LMSDropdown";

declare global {
    interface HTMLElementTagNameMap {
        "lms-dropdown": LMSDropdown;
        "lms-data-navbar": LMSDataNavbar;
    }
}

@customElement("lms-staff-events-filter")
export default class LMSStaffEventsFilter extends LitElement {
    @property({ type: Array }) sortableColumns: SortableColumns = ["id"];

    @property({ type: Array }) event_types: LMSEventType[] = [];

    @property({ type: Array }) target_groups: LMSTargetGroup[] = [];

    @property({ type: Array }) locations: LMSLocation[] = [];

    @property({ type: Object }) start_time: string | undefined;

    @state() isXs = window.matchMedia("(max-width: 640px)").matches;

    @queryAll("lms-dropdown") lmsDropdowns!: NodeListOf<LMSDropdown>;

    @queryAll("input[type=checkbox]") checkboxes!: NodeListOf<HTMLInputElement>;

    @query("#start_time") startTimeInput!: HTMLInputElement;

    private boundHandleResize = this.handleResize.bind(this);

    static override styles = [tailwindStyles, utilityStyles];

    private handleResize() {
        this.isXs = window.matchMedia("(max-width: 640px)").matches;
    }

    override connectedCallback() {
        super.connectedCallback();
        window.addEventListener("resize", this.boundHandleResize);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("resize", this.boundHandleResize);
    }

    private handleSort(e: Event) {
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        this.dispatchEvent(
            new CustomEvent("sort", {
                detail: { _order_by: target.value },
                bubbles: true,
                composed: true,
            })
        );
    }

    private handleChange() {
        this.dispatchEvent(
            new CustomEvent("filter", {
                detail: {
                    filters: this.checkboxes,
                },
                bubbles: true,
                composed: true,
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

    private handleStartTimeChange(e: CustomEvent) {
        const target = e.target as HTMLInputElement;
        if (target.id === "start_time_now") {
            this.startTimeInput.value = normalizeForInput(
                new Date().toString(),
                "datetime-local"
            );
        }
        this.dispatchEvent(
            new CustomEvent("start-time-change", {
                detail: {
                    start_time: this.startTimeInput.value,
                },
                bubbles: true,
                composed: true,
            })
        );
    }

    private handleReset() {
        this.dispatchEvent(
            new CustomEvent("reset", {
                bubbles: true,
                composed: true,
            })
        );
    }

    override render() {
        return html`
            <lms-data-navbar @dropdown-toggle=${this.handleDropdownToggle}>
                <div
                    @change=${this.handleChange}
                    class="dropdown-wrapper flex flex-wrap items-center gap-3 sm:flex-nowrap"
                    slot="navbar-start"
                >
                    <lms-dropdown
                        .label=${__("Sort by")}
                        .icon=${litFontawesome(faSort, {
                            className: "h-4 w-4 inline-block",
                        })}
                        @change=${this.handleSort}
                    >
                        ${map(
                            this.sortableColumns,
                            (column) => html`
                                <div class="form-control">
                                    <label
                                        for="_order_by_${column}"
                                        class="label cursor-pointer justify-start"
                                    >
                                        <input
                                            type="radio"
                                            class="radio mr-2 checked:bg-primary"
                                            name="_order_by"
                                            id="_order_by_${column}"
                                            value=${column}
                                            ?checked=${column === "id"}
                                        />
                                        <span class="label-text"
                                            >${__(column)}</span
                                        >
                                    </label>
                                </div>
                            `
                        )}
                    </lms-dropdown>
                    <lms-dropdown
                        .label=${__("Event type")}
                        .icon=${litFontawesome(faTag, {
                            className: "h-4 w-4 inline-block",
                        })}
                    >
                        ${map(
                            this.event_types,
                            (event_type) => html`
                                <div class="form-control ">
                                    <label
                                        for="event_types_${event_type.id}"
                                        class="label cursor-pointer justify-start"
                                    >
                                        <input
                                            type="checkbox"
                                            class="checkbox mr-2"
                                            name="event_type"
                                            id="event_types_${event_type.id}"
                                            value=${event_type.id}
                                        />
                                        <span class="label-text">
                                            ${event_type.name}</span
                                        >
                                    </label>
                                </div>
                            `
                        )}
                    </lms-dropdown>
                    <lms-dropdown
                        .label=${__("Target group")}
                        .icon=${litFontawesome(faBullseye, {
                            className: "h-4 w-4 inline-block",
                        })}
                    >
                        ${map(
                            this.target_groups,
                            (target_group) => html`
                                <div class="form-control ">
                                    <label
                                        for="target_groups_${target_group.id}"
                                        class="label cursor-pointer justify-start"
                                    >
                                        <input
                                            type="checkbox"
                                            class="checkbox mr-2"
                                            name="target_group"
                                            id="target_groups_${target_group.id}"
                                            value=${target_group.id}
                                        />
                                        <span class="label-text">
                                            ${target_group.name}
                                        </span>
                                    </label>
                                </div>
                            `
                        )}
                    </lms-dropdown>
                    <lms-dropdown
                        .label=${__("Location")}
                        .icon=${litFontawesome(faMapMarker, {
                            className: "h-4 w-4 inline-block",
                        })}
                    >
                        ${map(
                            this.locations,
                            (location) => html`
                                <div class="form-control">
                                    <label
                                        for="locations_${location.id}"
                                        class="label cursor-pointer justify-start"
                                    >
                                        <input
                                            type="checkbox"
                                            class="checkbox mr-2"
                                            name="location"
                                            id="locations_${location.id}"
                                            value=${location.id}
                                        />
                                        <span class="label-text">
                                            ${location.name}
                                        </span>
                                    </label>
                                </div>
                            `
                        )}
                    </lms-dropdown>

                    <lms-dropdown
                        .label=${__("Show events from")}
                        .icon=${litFontawesome(faClock, {
                            className: "h-4 w-4 inline-block",
                        })}
                        .position=${this.isXs ? ["end", "bottom"] : []}
                    >
                        <div class="join">
                            <button
                                class="btn-primary join-item btn"
                                id="start_time_now"
                                @click=${this.handleStartTimeChange}
                            >
                                ${__("Now on")}
                            </button>
                            <button
                                class="join-item btn"
                                @click=${this.handleStartTimeChange}
                            >
                                ${__("Custom date")}
                            </button>
                            <div class="form-control join-item">
                                <input
                                    type="datetime-local"
                                    class="input-bordered input"
                                    value=${this.start_time}
                                    name="start_time"
                                    id="start_time"
                                />
                            </div>
                        </div>
                    </lms-dropdown>

                    <button
                        class="btn-secondary btn-outline btn"
                        @click=${this.handleReset}
                    >
                        ${this.isXs
                            ? litFontawesome(faUndo, {
                                  className: "h-4 w-4 inline-block",
                              })
                            : __("Reset Filters")}
                    </button>
                </div>
                <div slot="navbar-center">
                    <slot name="navbar-center"></slot>
                </div>
                <div slot="navbar-end">
                    <slot name="navbar-end"></slot>
                </div>
            </lms-data-navbar>
        `;
    }
}
