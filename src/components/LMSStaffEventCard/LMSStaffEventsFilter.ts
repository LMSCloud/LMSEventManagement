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
        <slot></slot>
      </nav>
    `;
  }
}
