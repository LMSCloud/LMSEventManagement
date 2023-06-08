import { LitElement, html } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { __ } from "../../lib/translate";
import {
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    SortableColumns,
} from "../../sharedDeclarations";
import { utilityStyles } from "../../styles/utilities";
import { tailwindStyles } from "../../tailwind.lit";
import LMSDropdown from "../LMSDropdown";

declare global {
    interface HTMLElementTagNameMap {
        "lms-dropdown": LMSDropdown;
    }
}

@customElement("lms-staff-events-filter")
export default class LMSStaffEventsFilter extends LitElement {
    @property({ type: Array }) sortableColumns: SortableColumns = ["id"];

    @property({ type: Array }) event_types: LMSEventType[] = [];

    @property({ type: Array }) target_groups: LMSTargetGroup[] = [];

    @property({ type: Array }) locations: LMSLocation[] = [];

    @queryAll("lms-dropdown") lmsDropdowns!: NodeListOf<LMSDropdown>;

    @queryAll("input[type=checkbox]") checkboxes!: NodeListOf<HTMLInputElement>;

    static override styles = [tailwindStyles, utilityStyles];

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

    override render() {
        return html`
            <nav
                class="navbar-light sticky-top navbar rounded border bg-white"
                @dropdown-toggle=${this.handleDropdownToggle}
            >
                <div @change=${this.handleChange} class="dropdown-wrapper">
                    <lms-dropdown
                        .label=${__("Sort by")}
                        @change=${this.handleSort}
                    >
                        ${map(
                            this.sortableColumns,
                            (column) => html`
                                <div>
                                    <input
                                        type="radio"
                                        name="_order_by"
                                        id="_order_by_${column}"
                                        value=${column}
                                        ?checked=${column === "id"}
                                    />
                                    <label for="_order_by_${column}">
                                        ${__(column)}
                                    </label>
                                </div>
                            `
                        )}
                    </lms-dropdown>
                    <lms-dropdown .label=${__("Event type")}>
                        ${map(
                            this.event_types,
                            (event_type) => html`
                                <div>
                                    <input
                                        type="checkbox"
                                        name="event_type"
                                        id="event_types_${event_type.id}"
                                        value=${event_type.id}
                                    />
                                    <label for="event_types_${event_type.id}">
                                        ${event_type.name}
                                    </label>
                                </div>
                            `
                        )}
                    </lms-dropdown>
                    <lms-dropdown .label=${__("Target group")}>
                        ${map(
                            this.target_groups,
                            (target_group) => html`
                                <div>
                                    <input
                                        type="checkbox"
                                        name="target_group"
                                        id="target_groups_${target_group.id}"
                                        value=${target_group.id}
                                    />
                                    <label
                                        for="target_groups_${target_group.id}"
                                    >
                                        ${target_group.name}
                                    </label>
                                </div>
                            `
                        )}
                    </lms-dropdown>
                    <lms-dropdown .label=${__("Location")}>
                        ${map(
                            this.locations,
                            (location) => html`
                                <div>
                                    <input
                                        type="checkbox"
                                        name="location"
                                        id="locations_${location.id}"
                                        value=${location.id}
                                    />
                                    <label for="locations_${location.id}">
                                        ${location.name}
                                    </label>
                                </div>
                            `
                        )}
                    </lms-dropdown>
                </div>
                <slot></slot>
            </nav>
        `;
    }
}
