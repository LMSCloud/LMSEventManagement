import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import LMSStaffEventCardForm from "./LMSStaffEventCardForm";
import { Column, TargetGroup } from "../interfaces";
import { InputType } from "../types";

declare global {
  interface HTMLElementTagNameMap {
    "lms-staff-event-card-form": LMSStaffEventCardForm;
  }
}

@customElement("lms-staff-event-card-deck")
export default class LMSStaffEventCardDeck extends LitElement {
  @property({ type: Array }) data: Column[] = [];

  static override styles = [bootstrapStyles];

  override connectedCallback() {
    super.connectedCallback();

    const events = fetch("/api/v1/contrib/eventmanagement/events");
    events
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        }

        throw new Error("Something went wrong");
      })
      /** Because we have to fetch data from endpoints to build the select
       *  elements, we have to make the getInputFromColumn function async
       *  and therefore turn the whole map call into nested async calls.
       *  Looks ugly, but basically the call to getInputFromColumn call
       *  just turns the enclosed function into a promise, which resolves
       *  to the value you'd expect. Just ignore the async/await syntax
       *  and remember that you have to resolve the Promise returned by
       *  the previous call before you can continue with the next one. */
      .then(async (result) => {
        const data = await Promise.all(
          result.map(async (target_group: TargetGroup) => {
            const entries = await Promise.all(
              Object.entries(target_group).map(async ([name, value]) => [
                name,
                await this.getInputFromColumn({ name, value }),
              ])
            );
            return Object.fromEntries(entries);
          })
        );
        this.data = data;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private async getInputFromColumn({
    name,
    value,
  }: {
    name: string;
    value: InputType;
  }) {
    const inputs = new Map<
      string,
      () => TemplateResult | Promise<TemplateResult>
    >([
      [
        "name",
        () =>
          html`<input
            class="form-control"
            type="text"
            name="name"
            value=${value}
            disabled
          />`,
      ],
      [
        "event_type",
        async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/event_types"
          );
          const result = await response.json();
          return html`<select class="form-control" name="event_type" disabled>
            ${result.map(
              ({ id, name }: { id: number; name: string }) =>
                html`<option value=${id}>${name}</option>`
            )};
          </select>`;
        },
      ],
      [
        "min_age",
        () =>
          html`<input
            class="form-control"
            type="number"
            name="min_age"
            value=${value}
            disabled
          />`,
      ],
      [
        "max_age",
        () =>
          html`<input
            class="form-control"
            type="number"
            name="max_age"
            value=${value}
            disabled
          />`,
      ],
      [
        "max_participants",
        () =>
          html`<input
            class="form-control"
            type="number"
            name="max_participants"
            value=${value}
            disabled
          />`,
      ],
      [
        "start_time",
        () =>
          html`<input
            class="form-control"
            type="datetime-local"
            name="start_time"
            value=${value}
            disabled
          />`,
      ],
      [
        "end_time",
        () =>
          html`<input
            class="form-control"
            type="datetime-local"
            name="end_time"
            value=${value}
            disabled
          />`,
      ],
      [
        "registration_start",
        () =>
          html`<input
            class="form-control"
            type="datetime-local"
            name="registration_start"
            value=${value}
            disabled
          />`,
      ],
      [
        "registration_end",
        () =>
          html`<input
            class="form-control"
            type="datetime-local"
            name="registration_end"
            value=${value}
            disabled
          />`,
      ],
      [
        "fee",
        () =>
          html`<input
            class="form-control"
            type="number"
            step="0.01"
            name="fee"
            value=${value}
            disabled
          />`,
      ],
      [
        "location",
        async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/locations"
          );
          const result = await response.json();
          return html`<select class="form-control" name="location" disabled>
            ${result.map(
              ({ id, name }: { id: number; name: string }) =>
                html`<option value=${id}>${name}</option>`
            )};
          </select>`;
        },
      ],
      [
        "image",
        () =>
          html`<input
            class="form-control"
            type="number"
            name="image"
            value=${value}
            disabled
          />`,
      ],
      [
        "description",
        () =>
          html`<textarea
            class="form-control"
            name="description"
            disabled
            style="height: inherit;"
          >
${value}</textarea
          >`,
      ],
      [
        "status",
        () =>
          html`<select class="form-control" name="status" disabled>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="canceled">Canceled</option>
            <option value="sold_out">Sold Out</option>
          </select>`,
      ],
      [
        "registration_link",
        () =>
          html`<input
            class="form-control"
            type="text"
            name="registration_link"
            value=${value}
            disabled
          />`,
      ],
      [
        "open_registration",
        () =>
          html`<input
            class="form-check-input"
            type="checkbox"
            name="open_registration"
            value="1"
            ?checked=${value as unknown as boolean}
            disabled
          />`,
      ],
      ["default", () => html`${value}`],
    ]);

    return inputs.get(name) ? inputs.get(name)!() : inputs.get("default")!();
  }

  override render() {
    return html`
      <div class="container-fluid mx-0">
        <div class="card-deck">
          ${this.data.map(
            (datum) => html`
              <div class="card">
                <div class="card-header">
                  <ul class="nav nav-tabs card-header-tabs">
                    <li class="nav-item">
                      <a class="nav-link active" href="#">Data</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#">Attendees</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#">???</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">Preview</a>
                    </li>
                  </ul>
                </div>
                <div class="card-body">
                  <h5 class="card-title">${datum.name}</h5>
                  <lms-staff-event-card-form
                    .datum=${datum}
                  ></lms-staff-event-card-form>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}
