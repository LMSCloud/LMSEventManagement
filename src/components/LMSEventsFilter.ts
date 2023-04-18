import { LitElement, html } from "lit";
import {
  EventType,
  LMSEvent,
  LMSLocation,
  TargetGroup,
} from "../sharedDeclarations";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";
import { TranslationHandler, __ } from "../lib/TranslationHandler";
import { Gettext } from "gettext.js";

type Facets = {
  eventTypeIds: string[];
  targetGroupIds: number[];
  locationIds: string[];
  description: string;
  end_time: Date;
  id: number;
  image: string;
  max_age: number;
  max_participants: number;
  min_age: number;
  name: string;
  open_registration: boolean;
  registration_end: Date;
  registration_link: string;
  registration_start: Date;
  start_time: Date;
  status: "pending" | "confirmed" | "canceled" | "sold_out";
};

@customElement("lms-events-filter")
export default class LMSEventsFilter extends LitElement {
  @property({ type: Array }) events: LMSEvent[] = [];
  @property({ type: String }) facetsStrategy: "preserve" | "update" =
    "preserve";
  @property({ type: Boolean }) isHidden = false;
  @state() facets: Partial<Facets> = {};
  @state() event_types: EventType[] = [];
  @state() target_groups: TargetGroup[] = [];
  @state() locations: LMSLocation[] = [];
  @queryAll("input") inputs: NodeListOf<HTMLInputElement> | undefined;
  protected i18n: Gettext = {} as Gettext;
  private translationHandler: TranslationHandler = {} as TranslationHandler;

  static override styles = [bootstrapStyles];

  override connectedCallback() {
    super.connectedCallback();

    this.translationHandler = new TranslationHandler(() =>
      this.requestUpdate()
    );
    this.translationHandler.loadTranslations().then((i18n) => {
      this.i18n = i18n;
    });

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

  handleReset() {
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

    /** This basically works. Feels a bit ugly, though. */
    this.dispatchEvent(
      new CustomEvent("filter", {
        detail: "",
        composed: true,
        bubbles: true,
      })
    );
  }

  handleChange() {
    const inputHandlers = new Map<
      string,
      (input: HTMLInputElement) => string | boolean | undefined
    >([
      [
        "checkbox",
        (input) => {
          if (input.id === "open_registration") {
            return input.checked;
          }
          if (input.checked) {
            return input.id;
          }
          return false;
        },
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

    /** TODO: This could be shortened */
    const query = new URLSearchParams();
    params.forEach(([name, value]) => {
      if (typeof name === "string" && value !== undefined) {
        query.append(name, value?.toString());
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

  emitChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target) {
      target.dispatchEvent(
        new Event("change", { composed: true, bubbles: true })
      );
    }
  }

  handleHideToggle() {
    this.isHidden = !this.isHidden;
    this.dispatchEvent(
      new CustomEvent("hide", {
        detail: this.isHidden,
        composed: true,
        bubbles: true,
      })
    );
  }

  urlSearchParamsToQueryParam(searchParams: URLSearchParams) {
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
          class="card-header d-flex ${classMap({
            "justify-content-between": !this.isHidden,
            "justify-content-center": this.isHidden,
          })} sticky-top bg-white"
        >
          <h5
            class="card-title ${classMap({
              "d-inline": !this.isHidden,
              "d-none": this.isHidden,
            })}"
          >
            ${__("Filter")}
          </h5>
          <div>
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary me-2"
              @click=${this.handleHideToggle}
              aria-label=${this.isHidden ? "Show filters" : "Hide filters"}
            >
              ${this.isHidden ? "Show" : "Hide"}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary ${classMap({
                "d-none": this.isHidden,
              })}"
              @click=${this.handleReset}
            >
              ${__("Reset")}
            </button>
          </div>
        </div>
        <div class="card-body ${classMap({ "d-none": this.isHidden })}">
          <div class="form-group">
            <label for="event_type">Event Type</label>
            ${map(
              this.facets.eventTypeIds,
              (eventTypeId) => html`
                <div class="form-group form-check">
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
          </div>
          <div class="form-group">
            <label for="target_group">${__("Target Group")}</label>
            ${map(
              this.facets.targetGroupIds,
              (targetGroupId) => html` <div class="form-group form-check">
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
              </div>`
            )}
          </div>
          <div class="form-group">
            <label for="min_age">Min Age</label>
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
            <label for="max_age">Max Age</label>
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
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="open_registration"
              name="open_registration"
              checked
            />
            <label for="open_registration">${__("Open Registration")}</label>
          </div>
          <div class="form-group">
            <label for="start_time">Start Date</label>
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
            />
          </div>
          <div class="form-group">
            <label for="location">${__("Location")}</label>
            ${map(
              this.facets.locationIds,
              (locationId) =>
                html` <div class="form-group form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    name="location"
                    id=${locationId}
                  />
                  <label class="form-check-label" for=${locationId}
                    >${this.locations.find(
                      (location) => location.id === parseInt(locationId, 10)
                    )?.name}</label
                  >
                </div>`
            )}
          </div>
          <div class="form-group">
            <label for="fee">${__("Fee")}</label>
            <input
              type="number"
              class="form-control form-control-sm"
              id="fee"
              name="fee"
              @input=${this.emitChange}
            />
          </div>
        </div>
      </div>
    `;
  }
}
