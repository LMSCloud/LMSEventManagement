import { customElement } from "lit/decorators.js";
import LMSTable from "../components/LMSTable";
import { html, TemplateResult } from "lit";
import { Input, InputType, LMSLocation } from "../sharedDeclarations";
import { __ } from "../lib/translate";

type LMSLocationValue = string | number;

@customElement("lms-locations-table")
export default class LMSLocationsTable extends LMSTable {
  override handleEdit(e: Event) {
    if (e.target) {
      let inputs: NodeListOf<HTMLInputElement> =
        this.renderRoot.querySelectorAll("input");
      inputs.forEach((input) => {
        input.disabled = true;
      });

      const target = e.target as HTMLElement;
      let parent = target.parentElement;
      while (parent && parent.tagName !== "TR") {
        parent = parent.parentElement;
      }

      if (parent) {
        inputs = parent?.querySelectorAll("input");
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
      inputs = parent.querySelectorAll("input");
    }

    if (!id || !inputs) {
      return;
    }

    const response = await fetch(
      `/api/v1/contrib/eventmanagement/locations/${id}`,
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
      `/api/v1/contrib/eventmanagement/locations/${id}`,
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
      "street",
      "number",
      "city",
      "state",
      "zip",
      "country",
    ];
    this.isEditable = true;
    this.isDeletable = true;

    const locations = fetch("/api/v1/contrib/eventmanagement/locations");
    locations
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        }

        throw new Error("Something went wrong");
      })
      .then((result) => {
        this.data = result.map((location: LMSLocation) =>
          Object.fromEntries(
            Object.entries(location).map(
              ([name, value]: [string, LMSLocationValue]) => [
                name,
                this.getInputFromColumn({ name, value }),
              ]
            )
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private getInputFromColumn({
    name,
    value,
  }: {
    name: string;
    value: InputType | LMSLocationValue;
  }) {
    const inputs = new Map<string, () => TemplateResult>([
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
        "street",
        () =>
          html`<input
            class="form-control"
            type="text"
            name="street"
            value=${value}
            disabled
          />`,
      ],
      [
        "number",
        () =>
          html`<input
            class="form-control"
            type="text"
            name="number"
            value=${value}
            disabled
          />`,
      ],
      [
        "city",
        () =>
          html`<input
            class="form-control"
            type="text"
            name="city"
            value=${value}
            disabled
          />`,
      ],
      [
        "zip",
        () =>
          html`<input
            class="form-control"
            type="text"
            name="zip"
            value=${value}
            disabled
          />`,
      ],
      [
        "country",
        () =>
          html`<input
            class="form-control"
            type="text"
            name="country"
            value=${value}
            disabled
          />`,
      ],
      ["default", () => html`${value}`],
    ]);

    return inputs.get(name) ? inputs.get(name)!() : inputs.get("default")!();
  }
}
