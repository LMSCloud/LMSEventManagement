import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import LMSDropdown from "../LMSDropdown";
import {
  EventType,
  LMSLocation,
  SortableColumns,
  TargetGroup,
} from "../../sharedDeclarations";
import { map } from "lit/directives/map.js";
import { __ } from "../../lib/translate";
import { utilityStyles } from "../../styles/utilities";

declare global {
  interface HTMLElementTagNameMap {
    "lms-dropdown": LMSDropdown;
  }
}

@customElement("lms-staff-events-filter")
export default class LMSStaffEventsFilter extends LitElement {
  @property({ type: Array }) sortableColumns: SortableColumns = ["id"];

  @property({ type: Array }) event_types: EventType[] = [];

  @property({ type: Array }) target_groups: TargetGroup[] = [];

  @property({ type: Array }) locations: LMSLocation[] = [];

  static override styles = [bootstrapStyles, utilityStyles];

  private handleSort(e: Event) {
    const target = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent("sort", {
        detail: { _order_by: target.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    this.dispatchEvent(
      new CustomEvent("filter", {
        detail: { [name]: value },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <nav class="navbar navbar-light bg-white border rounded sticky-top">
        <lms-dropdown .label=${__("Sort by")} @change=${this.handleSort}>
          ${map(
            this.sortableColumns,
            (column) => html`
              <div class="dropdown-item">
                <input
                  type="radio"
                  name="_order_by"
                  id="_order_by_${column}"
                  value=${column}
                  ?checked=${column === "id"}
                />
                <label for="_order_by_${column}"> ${__(column)} </label>
              </div>
            `
          )}
        </lms-dropdown>
        <div @change=${this.handleChange}>
          <lms-dropdown .label=${__("Event type")}>
            ${map(
              this.event_types,
              (event_type) => html`
                <div class="dropdown-item">
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
                <div class="dropdown-item">
                  <input
                    type="checkbox"
                    name="target_group"
                    id="target_groups_${target_group.id}"
                    value=${target_group.id}
                  />
                  <label for="target_groups_${target_group.id}">
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
                <div class="dropdown-item">
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
