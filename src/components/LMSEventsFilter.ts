import { LitElement, html } from "lit";
import { LMSEvent, Facets } from "../interfaces";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { customElement, property } from "lit/decorators";

@customElement("lms-events-filter")
export default class LMSEventsFilter extends LitElement {
  @property({ type: Array }) events: LMSEvent[] = [];
  @property({ type: Array, attribute: false }) facets: Facets = {
    event_types: [],
    target_groups: [],
    locations: [],
    min_age: { type: "range", name: "min_age", value: "0" },
    max_age: { type: "range", name: "max_age", value: "120" },
    open_registration: {
      type: "checkbox",
      name: "open_registration",
      value: "true",
    },
    start_date: { type: "date", name: "start_date", value: "" },
    end_date: { type: "date", name: "end_date", value: "" },
    fee: { type: "range", name: "fee", value: "0" },
  };

  static override styles = [bootstrapStyles];

  override render() {
    return html`
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">Filter</h5>
          <button type="button" class="btn btn-sm btn-outline-secondary">
            Reset
          </button>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label for="event-type">Event Type</label>
            <select
              class="form-control form-control-sm"
              id="event-type"
              name="event-type"
            >
              <option value="all">All</option>
              ${this.facets.event_types.map((event_type) => {
                return html`
                  <option value="${event_type.value}">
                    ${event_type.name}
                  </option>
                `;
              })}
            </select>
          </div>
          <div class="form-group">
            <label for="target-group">Target Group</label>
            <select
              class="form-control form-control-sm"
              id="target-group"
              name="target-group"
            >
              <option value="all">All</option>
              ${this.facets.target_groups.map((target_group) => {
                return html` <option value="${target_group.value}">
                  ${target_group.name}
                </option>`;
              })}
            </select>
          </div>
          <div class="form-group">
            <label for="min-age">Min Age</label>
            <input
              type="range"
              class="form-control-range"
              id="min-age"
              name="min-age"
              min="0"
              max="120"
              value="0"
            />

            <label for="max-age">Max Age</label>
            <input
              type="range"
              class="form-control-range"
              id="max-age"
              name="max-age"
              min="0"
              max="120"
              value="120"
            />
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="open-registration"
              name="open-registration"
              value="true"
            />
            <label for="open-registration">Open Registration</label>
          </div>
          <div class="form-group">
            <label for="start-date">Start Date</label>
            <input
              type="date"
              class="form-control form-control-sm"
              id="start-date"
              name="start-date"
            />

            <label for="end-date">End Date</label>
            <input
              type="date"
              class="form-control form-control-sm"
              id="end-date"
              name="end-date"
            />
          </div>
          <div class="form-group">
            <label for="location">Location</label>
            ${this.facets.locations.map(
              (location) => html`
                <div class="form-check">
                  <label
                    class="form-check-label"
                    for="location-${location.name}"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value="${location.value}"
                      id="location-${location.name}"
                      name="location"
                    />
                  </label>
                </div>
              `
            )}
          </div>
          <div class="form-group">
            <label for="fee">Fee</label>
            <input
              type="number"
              class="form-control form-control-sm"
              id="fee"
              name="fee"
            />
          </div>
        </div>
      </div>
    `;
  }
}
