import { LitElement, html } from "lit";
import {
  EventType,
  LMSEvent,
  LMSLocation,
  TargetGroup,
} from "../sharedDeclarations";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { customElement, property, queryAll, state } from "lit/decorators";
import { map } from "lit/directives/map";

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
  @state() facets: Partial<Facets> = {};
  @state() event_types: EventType[] = [];
  @state() target_groups: TargetGroup[] = [];
  @state() locations: LMSLocation[] = [];
  @queryAll("input") inputs: NodeListOf<HTMLInputElement> | undefined;

  static override styles = [bootstrapStyles];

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

  override willUpdate() {
    if (!this.events.length) return;
    console.log(this.event_types, this.target_groups, this.locations);
    this.facets = {
      eventTypeIds: [...new Set(this.events.map((event) => event.event_type))],
      targetGroupIds: [
        ...new Set(
          this.events.flatMap((event) =>
            event.target_groups.map((target_group) =>
              target_group.selected ? target_group.target_group_id : NaN
            )
          )
        ),
      ].filter(Number.isInteger),
      locationIds: [...new Set(this.events.map((event) => event.location))],
      ...this.events
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
          input.checked = false;
          break;
        case "date":
          input.value = "";
          break;
        case "number":
          input.value = input.min;
          break;
        default:
          break;
      }
    });
  }

  handleChange() {
    const inputHandlers = new Map<
      string,
      (input: HTMLInputElement) => string | boolean | undefined
    >([
      ["checkbox", (input) => (input.checked ? input.id : false)],
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
            (name === "event_type" ||
              name === "target_group" ||
              name === "location") &&
            value === false
          )
      );

    console.log(params);

    const query = new URLSearchParams(Object.fromEntries(params)).toString();

    console.log(query);

    this.dispatchEvent(
      new CustomEvent("filter", {
        detail: query,
        composed: true,
        bubbles: true,
      })
    );
  }

  // debounce(callbackFunction: Function, delay = 10) {
  //   let timeout: ReturnType<typeof setTimeout>;

  //   return (...args: unknown[]) => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => {
  //       callbackFunction(...args);
  //     }, delay);
  //   };
  // }

  emitChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target) {
      target.dispatchEvent(
        new Event("change", { composed: true, bubbles: true })
      );
    }
  }

  // debouncedEmitChange = this.debounce(this.emitChange);

  override render() {
    return html`
      <div class="card" @change=${this.handleChange}>
        <div class="card-header">
          <h5 class="card-title d-inline">Filter</h5>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click=${this.handleReset}
          >
            Reset
          </button>
        </div>
        <div class="card-body">
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
            <label for="target_group">Target Group</label>
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
              value="0"
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
              value="120"
              @input=${this.emitChange}
            />
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="open_registration"
              name="open_registration"
            />
            <label for="open_registration">Open Registration</label>
          </div>
          <div class="form-group">
            <label for="start_date">Start Date</label>
            <input
              type="date"
              class="form-control form-control-sm"
              id="start_date"
              name="start_date"
            />
            <label for="end_date">End Date</label>
            <input
              type="date"
              class="form-control form-control-sm"
              id="end_date"
              name="end_date"
            />
          </div>
          <div class="form-group">
            <label for="location">Location</label>
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
            <label for="fee">Fee</label>
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
