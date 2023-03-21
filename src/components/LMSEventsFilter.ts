import { LitElement, html } from "lit";
import {
  EventType,
  LMSEvent,
  LMSLocation,
  TargetGroup,
} from "../sharedDeclarations";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { customElement, property, state } from "lit/decorators";
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

  static override styles = [bootstrapStyles];

  override connectedCallback() {
    super.connectedCallback();

    const event_types = async () => {
      const response = await fetch(
        "/api/v1/contrib/eventmanagement/event_types"
      );
      return response.json();
    };
    event_types().then(
      (event_types: EventType[]) => (this.event_types = event_types)
    );
    const target_groups = async () => {
      const response = await fetch(
        "/api/v1/contrib/eventmanagement/target_groups"
      );
      return response.json();
    };
    target_groups().then(
      (target_groups: TargetGroup[]) => (this.target_groups = target_groups)
    );

    const locations = async () => {
      const response = await fetch("/api/v1/contrib/eventmanagement/locations");
      return response.json();
    };
    locations().then(
      (locations: LMSLocation[]) => (this.locations = locations)
    );
  }

  override willUpdate() {
    this.facets = {
      eventTypeIds: this.events.map((event) => event.event_type),
      targetGroupIds: [
        ...new Set(
          this.events.flatMap((event) =>
            event.target_groups.map((target_group) =>
              target_group.selected ? target_group.target_group_id : NaN
            )
          )
        ),
      ].filter(Number.isInteger),
      locationIds: this.events.map((event) => event.location),
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

  handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    console.log(target.type);
  }

  throttle(callbackFn: Function, delay = 1000) {
    let shouldWait = false;
    let waitingArgs: unknown[] | null = null;
    const timeoutFunc = () => {
      if (waitingArgs == null) {
        shouldWait = false;
      } else {
        callbackFn(...waitingArgs);
        waitingArgs = null;
        setTimeout(timeoutFunc, delay);
      }
    };

    return (...args: unknown[]) => {
      if (shouldWait) {
        waitingArgs = args;
        return;
      }

      callbackFn(...args);
      shouldWait = true;
      setTimeout(timeoutFunc, delay);
    };
  }

  emitChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target) {
      target.dispatchEvent(
        new Event("change", { composed: true, bubbles: true })
      );
    }
  }

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
              @input=${(e: Event) => {
                this.emitChange(e);
              }}
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
              @input=${(e: Event) => {
                this.emitChange(e);
              }}
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
              @input=${(e: Event) => {
                this.emitChange(e);
              }}
            />
          </div>
        </div>
      </div>
    `;
  }
}
