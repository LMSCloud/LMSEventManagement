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
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { utilityStyles } from "../styles/utilities";
import LMSSearch from "./LMSSearch";
import LMSDropdown from "./LMSDropdown";

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
  @state() activeFilters: [string, string | boolean][] = [];
  @queryAll("input") inputs: NodeListOf<HTMLInputElement> | undefined;
  @queryAll("lms-dropdown") lmsDropdowns!: NodeListOf<LMSDropdown>;

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
    utilityStyles,
    css`
      .gap-3 {
        gap: 1rem;
      }
    `,
  ];

  private throttle = (callback: () => void, delay: number) => {
    let previousCall = new Date().getTime();
    return function () {
      const time = new Date().getTime();
      if (time - previousCall >= delay) {
        previousCall = time;
        callback();
      }
    };
  };

  constructor() {
    super();

    window.addEventListener(
      "resize",
      this.throttle(() => {
        this.shouldFold = window.innerWidth <= 992;
        this.isHidden = this.shouldFold;
        this.requestUpdate();
      }, 250)
    );
  }

  override connectedCallback() {
    super.connectedCallback();

    const event_types = async () => {
      const response = await fetch(
        "/api/v1/contrib/eventmanagement/public/event_types"
      );
      return response.json();
    };
    event_types().then(
      (event_types: EventType[]) => (this.event_types = event_types)
    );
    const target_groups = async () => {
      const response = await fetch(
        "/api/v1/contrib/eventmanagement/public/target_groups"
      );
      return response.json();
    };
    target_groups().then(
      (target_groups: TargetGroup[]) => (this.target_groups = target_groups)
    );

    const locations = async () => {
      const response = await fetch(
        "/api/v1/contrib/eventmanagement/public/locations"
      );
      return response.json();
    };
    locations().then(
      (locations: LMSLocation[]) => (this.locations = locations)
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("resize", () => {});
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

  private deepCopy<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") return obj as T;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (Array.isArray(obj))
      return obj.map((item) => this.deepCopy(item)) as unknown as T;

    const newObj = Object.create(Object.getPrototypeOf(obj)) as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        (newObj as Record<string, unknown>)[key] = this.deepCopy(
          (obj as Record<string, unknown>)[key]
        );
      }
    }

    return newObj;
  }

  private _eventsDeepCopy: LMSEvent[] = [];

  private get eventsDeepCopy(): LMSEvent[] {
    return this._eventsDeepCopy;
  }

  private set eventsDeepCopy(value: LMSEvent[]) {
    if (this._eventsDeepCopy.length === 0) {
      this._eventsDeepCopy = value;
    }
  }

  override willUpdate() {
    this.eventsDeepCopy = this.deepCopy(this.events);
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
          const { event_type, location, target_groups, ...rest } = event;
          return rest;
        })
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    };
  }

  private handleReset() {
    const inputs = this.shadowRoot?.querySelectorAll("input");
    inputs?.forEach((input) => {
      switch (input.type) {
        case "checkbox":
          if (input.id === "open_registration") {
            input.checked = true;
            break;
          }
          input.checked = false;
          break;
        case "date":
          input.value = "";
          break;
        case "number":
          if (["min_age", "max_age"].includes(input.id)) {
            input.value = "";
            break;
          }
          input.value = input.min;
          break;
        default:
          break;
      }
    });

    this.dispatchEvent(
      new CustomEvent("filter", {
        detail: "",
        composed: true,
        bubbles: true,
      })
    );
  }

  private handleChange() {
    const inputHandlers = new Map<
      string,
      (input: HTMLInputElement) => string | boolean | undefined
    >([
      [
        "checkbox",
        (input) =>
          input.id === "open_registration"
            ? input.checked
            : input.checked
            ? input.id
            : false,
      ],
      ["date", (input) => input.value],
      ["number", (input) => input.value],
      ["default", (input) => input.value],
    ]);

    const params = [...(this.inputs ?? [])]
      .filter((input) => input.value || input.checked)
      .map((input) => {
        const handler =
          inputHandlers.get(input.type) || inputHandlers.get("default");
        if (!handler) return [input.name, undefined];
        const value = handler(input);
        return [input.name, value];
      })
      .filter(
        ([name, value]) =>
          !(
            name &&
            ["event_type", "target_group", "location"].includes(
              name.toString()
            ) &&
            value === false
          )
      );

    const query = new URLSearchParams();
    params.forEach(([name, value]) => {
      if (typeof name === "string" && value !== undefined) {
        this.activeFilters.push([name, value]);
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
    this.dispatchEvent(
      new CustomEvent("search", {
        detail,
        composed: true,
        bubbles: true,
      })
    );
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

  protected urlSearchParamsToQueryParam(searchParams: URLSearchParams) {
    const queryParams = {};
    searchParams.forEach((value, key) => {
      const keys = key.split(".");
      let currentParam: Record<string, unknown> = queryParams;
      keys.forEach((k, i) => {
        if (!currentParam[k]) {
          currentParam[k] = i === keys.length - 1 ? value : {};
        }
        currentParam = currentParam[k] as Record<string, unknown>;
      });
    });
    return `q=${JSON.stringify(queryParams)}`;
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
            <div class="col-auto">
              <h5
                class=${classMap({
                  "d-inline": !this.shouldFold,
                  "d-none": this.shouldFold,
                  "mr-3": !this.shouldFold,
                })}
              >
                ${__("Filter")}
              </h5>
            </div>

            <div class="col-auto">
              <lms-search
                @search=${this.handleSearch}
                class=${classMap({
                  "mr-3": !this.shouldFold,
                  "mb-3": this.shouldFold,
                })}
              ></lms-search>
            </div>

            <div class="col-auto">
              <div
                class="btn-group ${classMap({
                  "d-none": !this.shouldFold,
                })}"
              >
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click=${this.handleHideToggle}
                  aria-label=${this.isHidden
                    ? __("Show filters")
                    : __("Hide filters")}
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
                  .structure=${{
                    type: "uniform",
                    ids: this.facets.eventTypeIds,
                    group: "event_type",
                    inputType: "checkbox",
                    classes: ["form-check-input"],
                    fields: {
                      ...this.event_types.reduce(
                        (acc, event_type: EventType) => {
                          acc[event_type.id] = {
                            value: event_type.name,
                          };
                          return acc;
                        },
                        {} as Record<number, { value: string }>
                      ),
                    },
                  }}
                  .label=${__("Event Type")}
                  @toggle=${this.handleDropdownToggle}
                ></lms-dropdown>

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .structure=${{
                    type: "uniform",
                    ids: this.facets.targetGroupIds,
                    group: "target_group",
                    inputType: "checkbox",
                    classes: ["form-check-input"],
                    fields: {
                      ...this.target_groups.reduce(
                        (acc, target_group: TargetGroup) => {
                          acc[target_group.id] = {
                            value: target_group.name,
                          };
                          return acc;
                        },
                        {} as Record<number, { value: string }>
                      ),
                    },
                  }}
                  .label=${__("Target Group")}
                  @toggle=${this.handleDropdownToggle}
                ></lms-dropdown>

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .structure=${{
                    type: "varying",
                    fields: {
                      min_age: {
                        label: __("Min Age"),
                        type: "number",
                        classes: ["form-control", "form-control-sm"],
                        additionalProperties: {
                          min: 0,
                          max: 120,
                        },
                      },
                      max_age: {
                        label: __("Max Age"),
                        type: "number",
                        classes: ["form-control", "form-control-sm"],
                        additionalProperties: {
                          min: 0,
                          max: 120,
                        },
                      },
                    },
                  }}
                  .label=${__("Age")}
                  @toggle=${this.handleDropdownToggle}
                ></lms-dropdown>

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .structure=${{
                    type: "varying",
                    fields: {
                      open_registration: {
                        type: "checkbox",
                        classes: ["form-check-input"],
                        value: true,
                        label: __("Open Registration"),
                        name: "open_registration",
                      },
                      start_time: {
                        type: "date",
                        classes: ["form-control", "form-control-sm"],
                        value: "",
                        label: __("Start Date"),
                        name: "start_time",
                      },
                      end_time: {
                        type: "date",
                        classes: ["form-control", "form-control-sm"],
                        value: "",
                        label: __("End Date"),
                        name: "end_time",
                      },
                    },
                  }}
                  .label=${__("Registration & Dates")}
                  @toggle=${this.handleDropdownToggle}
                ></lms-dropdown>

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .structure=${{
                    type: "uniform",
                    ids: this.facets.locationIds,
                    group: "location",
                    inputType: "checkbox",
                    classes: ["form-check-input"],
                    fields: {
                      ...this.locations.reduce((acc, location: LMSLocation) => {
                        acc[location.id] = {
                          value: location.name,
                        };
                        return acc;
                      }, {} as Record<number, { value: string }>),
                    },
                  }}
                  .label=${__("Location")}
                  @toggle=${this.handleDropdownToggle}
                ></lms-dropdown>

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .structure=${{
                    type: "varying",
                    fields: {
                      fee: {
                        type: "number",
                        classes: ["form-control", "form-control-sm"],
                        value: "",
                        label: __("Fee"),
                        name: "fee",
                        additionalProperties: {
                          min: 0,
                          max: 4294967295,
                        },
                      },
                    },
                  }}
                  .label=${__("Fee")}
                  @toggle=${this.handleDropdownToggle}
                ></lms-dropdown>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="active-filters ">
              ${map(
                this.activeFilters,
                ([name, value]) => html` <span class="badge badge-primary"
                  >${typeof value === "boolean"
                    ? __(name)
                    : parseInt(value, 10) !== Number.NaN
                    ? __(name) + ": " + __(value)
                    : __(value)}&nbsp;<button
                    type="button"
                    class="close"
                    aria-label="Close"
                  >
                    <span aria-hidden="true" class="text-light">&times;</span>
                  </button></span
                >`
              )}
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
