import { customElement } from "lit/decorators";
import LMSTable from "../components/LMSTable";
import { html, TemplateResult } from "lit";
import { InputType } from "../types";
import { EventType, TargetGroup, TargetGroupFee } from "../interfaces";

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

  handleInput(input: HTMLInputElement | HTMLSelectElement, value: unknown) {
    if (input instanceof HTMLInputElement && input.type === "checkbox") {
      return input.checked ? "1" : "0";
    }

    return value;
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
          ...Array.from(inputs).reduce((acc, input) => {
            if (input.dataset.group && input instanceof HTMLInputElement) {
              const group = input.dataset.group;
              if (!(group in acc)) {
                acc[group] = [];
              }

              const { id, name, value } = input;

              const groupArray = acc[group] as Array<Record<string, unknown>>;
              const groupIndex = groupArray.findIndex((item) => item.id === id);

              if (groupIndex === -1) {
                groupArray.push({
                  id,
                  [name]: this.handleInput(input, value),
                });
                return acc;
              }

              groupArray[groupIndex][name] = this.handleInput(input, value);
              return acc;
            }

            acc[input.name] = this.handleInput(input, input.value);
            return acc;
          }, {} as Record<string, unknown>),
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
      "target_groups",
      "min_age",
      "max_age",
      "max_participants",
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
          result.map(async (event_type: EventType) => {
            const entries = await Promise.all(
              Object.entries(event_type).map(async ([name, value]) => [
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
        "target_groups",
        async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/target_groups"
          );
          const result = await response.json();
          return html` <table class="table table-sm mb-0">
            <tbody>
              ${(value as unknown as TargetGroupFee[]).map(
                ({ target_group_id, selected, fee }) => html`
                  <tr>
                    <td id=${target_group_id} class="align-middle">
                      ${result.find(
                        (target_group: TargetGroup) =>
                          target_group.id === target_group_id
                      ).name}
                    </td>
                    <td class="align-middle">
                      <input
                        type="checkbox"
                        data-group="target_groups"
                        name="selected"
                        id=${target_group_id}
                        class="form-control"
                        ?checked=${selected}
                        disabled
                      />
                    </td>
                    <td class="align-middle">
                      <input
                        type="number"
                        data-group="target_groups"
                        name="fee"
                        id=${target_group_id}
                        step="0.01"
                        class="form-control"
                        value=${fee}
                        disabled
                      />
                    </td>
                  </tr>
                `
              )}
            </tbody>
          </table>`;
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
            class="form-control"
            type="checkbox"
            name="open_registration"
            ?checked=${value as unknown as boolean}
            disabled
          />`,
      ],
      ["default", () => html`${value}`],
    ]);

    return inputs.get(name) ? inputs.get(name)!() : inputs.get("default")!();
  }
}
