import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, css, html } from "lit";
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
import LMSDropdown from "../LMSDropdown";
import { throttle } from "../../lib/utilities";

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

  private throttledHandleResize: () => void;

  static override styles = [
    bootstrapStyles,
    utilityStyles,
    css`
      nav > * {
        margin: 0.5rem 0;
      }

      @media (max-width: 576px) {
        .dropdown-wrapper {
          width: 100%;

        }
      }
    `,
  ];

  constructor() {
    super();
    this.throttledHandleResize = throttle(this.handleResize.bind(this), 250);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("resize", this.throttledHandleResize);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.throttledHandleResize);
  }

  private handleResize() {
    const width = window.innerWidth;
    this.lmsDropdowns.forEach((lmsDropdown) => {
      const shouldFold = width < 576;
      lmsDropdown.shouldFold = shouldFold;
      if (shouldFold) {
        lmsDropdown.classList.add("w-100");
        return;
      }

      lmsDropdown.classList.remove("w-100");
    });
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

  private handleDropdownToggle(e: Event) {
    const target = e.target as LMSDropdown;
    this.lmsDropdowns.forEach((lmsDropdown) => {
      if (lmsDropdown !== target) {
        lmsDropdown.isOpen = false;
      }
    });
  }

  override render() {
    return html`
      <nav
        class="navbar navbar-light bg-white border rounded sticky-top"
        @toggle=${this.handleDropdownToggle}
      >
        <div @change=${this.handleChange} class="dropdown-wrapper">
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
