import { customElement } from "lit/decorators";
import LMSTable from "../components/LMSTable";
import { html, TemplateResult } from "lit";
import { InputType } from "../types";
import { TargetGroup, Input } from "../interfaces";

@customElement("lms-event-types-table")
export default class LMSEventTypesTable extends LMSTable {
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

  override async handleSave(e: Event) {
    const target = e.target as HTMLElement;

    let parent = target.parentElement;
    while (parent && parent.tagName !== "TR") {
      parent = parent.parentElement;
    }

    let id,
      inputs = undefined;
    if (parent) {
      id = parent.firstElementChild?.textContent?.trim();
      inputs = parent.querySelectorAll("input, select") as NodeListOf<
        HTMLInputElement | HTMLSelectElement
      >;
    }

    if (!id || !inputs) {
      return;
    }

    const response = await fetch(
      `/api/v1/contrib/eventmanagement/event_types/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...Array.from(inputs).reduce(
            (acc: { [key: string]: number | string }, input: Input) => {
              acc[input.name] = input.value;
              return acc;
            },
            {}
          ),
        }),
      }
    );

    if (response.status >= 200 && response.status <= 299) {
      inputs.forEach((input) => {
        input.disabled = true;
      });
      return;
    }

    if (response.status >= 400) {
      const error = await response.json();
      this.renderToast(response.statusText, error);
    }
  }

  override async handleDelete(e: Event) {
    const target = e.target as HTMLElement;

    let parent = target.parentElement;
    while (parent && parent.tagName !== "TR") {
      parent = parent.parentElement;
    }

    let id = undefined;
    if (parent) {
      id = parent.firstElementChild?.textContent?.trim();
    }

    if (!id) {
      return;
    }

    const response = await fetch(
      `/api/v1/contrib/eventmanagement/event_types/${id}`,
      { method: "DELETE" }
    );

    if (response.status >= 200 && response.status <= 299) {
      return;
    }

    if (response.status >= 400) {
      const error = await response.json();
      this.renderToast(response.statusText, error);
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    this.order = [
      "id",
      "name",
      "target_group",
      "min_age",
      "max_age",
      "max_participants",
      "fees",
      "location",
      "image",
      "description",
      "open_registration",
    ];
    this._isEditable = true;
    this._isDeletable = true;

    const eventTypes = fetch("/api/v1/contrib/eventmanagement/event_types");
    eventTypes
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
        "target_group",
        async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/target_groups"
          );
          const result = await response.json();
          return html`<select class="form-control" name="target_group" disabled>
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
        "fees",
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
        "open_registration",
        () =>
          html`<input
            @change=${(e: Event) => {
              const target = e.target as HTMLInputElement;
              target.value = target.checked ? "1" : "0";
            }}
            class="form-control"
            type="checkbox"
            name="open_registration"
            value=${(value as unknown as string) === "true" ? 1 : 0}
            ?checked=${value as unknown as boolean}
            disabled
          />`,
      ],
      ["default", () => html`${value}`],
    ]);

    return inputs.get(name) ? inputs.get(name)!() : inputs.get("default")!();
  }
}
