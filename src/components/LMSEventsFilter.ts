import { LitElement, css, html } from "lit";
import {
  EventType,
  LMSEvent,
  LMSLocation,
  TargetGroup,
  Facets,
} from "../sharedDeclarations";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";
import { __, attr__ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { utilityStyles } from "../styles/utilities";
import LMSSearch from "./LMSSearch";
import LMSDropdown from "./LMSDropdown";
import { requestHandler } from "../lib/RequestHandler";
import { deepCopy, throttle } from "../lib/utilities";

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
  @state() facets: Partial<Facets> = {};
  @state() event_types: EventType[] = [];
  @state() target_groups: TargetGroup[] = [];
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

      return input.checked ? input.id : false;
    },
    radio: (input: HTMLInputElement) => (input.checked ? input.value : false),
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
    bootstrapStyles,
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
    this.throttledHandleResize = throttle(this.handleResize.bind(this), 250);
  }

  private handleResize() {
    this.shouldFold = window.innerWidth <= 992;
    this.isHidden = this.shouldFold;
    this.requestUpdate();
  }

  override connectedCallback() {
    super.connectedCallback();

    window.addEventListener("resize", this.throttledHandleResize);

    requestHandler
      .request("getEventTypesPublic")
      .then((response) => response.json())
      .then((event_types: EventType[]) => (this.event_types = event_types));

    requestHandler
      .request("getTargetGroupsPublic")
      .then((response) => response.json())
      .then(
        (target_groups: TargetGroup[]) => (this.target_groups = target_groups)
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
          events.flatMap((event) =>
            event.target_groups.map((target_group) =>
              target_group.selected ? target_group.target_group_id : NaN
            )
          )
        ),
      ].filter(Number.isInteger),
      locationIds: [...new Set(events.map((event) => event.location))],
      ...events
        .map((event) => {
          const { event_type, location, target_groups, ...rest } = event; // eslint-disable-line @typescript-eslint/no-unused-vars
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
          this.inputHandlers?.[input.type] || this.inputHandlers.default;
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
    const { detail } = e;
    const query = new URLSearchParams();
    this.getParamsFromActiveFilters().forEach(([name, value]) => {
      if (typeof name === "string" && value !== undefined) {
        return query.append(name, value?.toString());
      }
    });
    if (detail) {
      const q = [
        { name: { "-like": `%${detail}%` } },
        { description: { "-like": `%${detail}%` } },
      ];
      query.append("q", JSON.stringify(q));
    } else {
      query.append("q", JSON.stringify({}));
    }
    this.dispatchEvent(
      new CustomEvent("search", {
        detail: query.toString(),
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
      <div class="card" @change=${this.handleChange}>
        <div
          class="card-header container-fluid ${classMap({
            "justify-content-between": !this.isHidden,
            "justify-content-center": this.isHidden,
            "flex-column": this.shouldFold,
          })} sticky-top bg-white"
        >
          <div class="row">
            <div
              class="col-1 ${classMap({
                "d-none": this.shouldFold,
              })}"
            >
              <h5
                class="nobr ${classMap({
                  "d-inline": !this.shouldFold,
                })}"
              >
                ${__("Filter")}
              </h5>
            </div>

            <div
              class=${classMap({
                "col-3": !this.shouldFold,
                "mb-3": this.shouldFold,
                "col-12": this.shouldFold,
              })}
            >
              <lms-search @search=${this.handleSearch}></lms-search>
            </div>

            <div
              class=${classMap({
                col: !this.shouldFold,
                "col-12": this.shouldFold,
              })}
            >
              <div
                class="btn-group ${classMap({
                  "d-none": !this.shouldFold,
                  "w-100": this.shouldFold,
                })}"
              >
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click=${this.handleHideToggle}
                  aria-label=${this.isHidden
                    ? attr__("Show filters")
                    : attr__("Hide filters")}
                >
                  ${this.isHidden ? __("Show filters") : __("Hide filters")}
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click=${this.handleReset}
                >
                  ${__("Reset filters")}
                </button>
              </div>

              <div
                class="dropdowns ${classMap({
                  "d-flex": !this.shouldFold,
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
                    ["start_time", "end_time", "event_type", "location"],
                    (value, index) => html`
                      <div class="dropdown-item">
                        <input
                          type="radio"
                          id="_order_by_${value}"
                          name="_order_by"
                          value=${value}
                          ?checked=${index === 0}
                        />
                        <label for="_order_by_${value}">${__(value)}</label>
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
                      <div class="form-group form-check dropdown-item">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          name="event_type"
                          id=${eventTypeId}
                        />
                        <label class="form-check-label" for=${eventTypeId}
                          >${this.event_types.find(
                            (event_type) =>
                              event_type.id === parseInt(eventTypeId, 10)
                          )?.name}</label
                        >
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
                      <div class="form-group form-check dropdown-item">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          name="target_group"
                          id=${targetGroupId}
                        />
                        <label class="form-check-label" for=${targetGroupId}
                          >${this.target_groups.find(
                            (target_group) => target_group.id === targetGroupId
                          )?.name}</label
                        >
                      </div>
                    `
                  )}
                </lms-dropdown>

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .label=${__("Age")}
                  @toggle=${this.handleDropdownToggle}
                >
                  <div class="form-group dropdown-item">
                    <label for="min_age">${__("Min Age")}</label>
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      id="min_age"
                      name="min_age"
                      min="0"
                      max="120"
                      value=""
                      @input=${this.emitChange}
                    />
                    <label for="max_age">${__("Max Age")}</label>
                    <input
                      type="number"
                      class="form-control form-control-sm"
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
                >
                  <div class="form-check dropdown-item">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="open_registration"
                      name="open_registration"
                      checked
                    />
                    <label for="open_registration"
                      >${__("Open Registration")}</label
                    >
                  </div>
                  <div class="form-group dropdown-item">
                    <label for="start_time">${__("Start Date")}</label>
                    <input
                      type="date"
                      class="form-control form-control-sm"
                      id="start_time"
                      name="start_time"
                    />
                    <label for="end_time">${__("End Date")}</label>
                    <input
                      type="date"
                      class="form-control form-control-sm"
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
                      html` <div class="form-group form-check dropdown-item">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          name="location"
                          id=${locationId}
                        />
                        <label class="form-check-label" for=${locationId}
                          >${this.locations.find(
                            (location) =>
                              location.id === parseInt(locationId, 10)
                          )?.name}</label
                        >
                      </div>`
                  )}
                </lms-dropdown>

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .label=${__("Fee")}
                  @toggle=${this.handleDropdownToggle}
                >
                  <div class="form-group dropdown-item">
                    <label for="fee">${__("Fee")}</label>
                    <input
                      type="number"
                      class="form-control form-control-sm"
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
        <div class="card-body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
