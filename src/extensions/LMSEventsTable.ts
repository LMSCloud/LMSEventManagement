import { customElement } from "lit/decorators";
import LMSTable from "../components/LMSTable";
import { html, TemplateResult } from "lit";
import { InputType } from "../types";
import { TargetGroup } from "../interfaces";

@customElement("lms-events-table")
export default class LMSEventsTable extends LMSTable {
  override handleEdit(e: Event) {
    if (e.target) {
      let inputs: NodeListOf<HTMLInputElement | HTMLSelectElement> =
        this.renderRoot.querySelectorAll("input, select");
      inputs.forEach((input) => {
        input.disabled = true;
      });

      const target = e.target as HTMLElement;
      let parent = target.parentElement;
      while (parent && parent.tagName !== "TR") {
        parent = parent.parentElement;
      }

      if (parent) {
        inputs = parent?.querySelectorAll("input, select");
        inputs?.forEach((input) => {
          input.disabled = false;
        });
      }
    }
  }

  override handleSave() {}

  override handleDelete() {}

  override connectedCallback() {
    super.connectedCallback();
    this.order = [
      "id",
      "name",
      "event_type",
      "min_age",
      "max_age",
      "max_participants",
      "start_time",
      "end_time",
      "registration_start",
      "registration_end",
      "fee",
      "location",
      "image",
      "description",
      "status",
      "registration_link",
      "open_registration",
    ];
    this._isEditable = true;
    this._isDeletable = true;

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
          html`<input
            class="form-control"
            type="text"
            name="description"
            value=${value}
            disabled
          />`,
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
            class="form-control"
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
}
