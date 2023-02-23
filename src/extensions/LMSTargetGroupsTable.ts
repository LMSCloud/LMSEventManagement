import { customElement } from "lit/decorators";
import LMSTable from "../components/LMSTable";
import { html, TemplateResult } from "lit";
import { InputType } from "../types";
import { TargetGroup } from "../interfaces";

@customElement("lms-target-groups-table")
export default class LMSEventTypesTable extends LMSTable {
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

  override handleSave() {}

  override handleDelete() {}

  override connectedCallback() {
    super.connectedCallback();

    this.order = ["id", "name", "min_age", "max_age"];
    this._isEditable = true;
    this._isDeletable = true;

    const events = fetch("/api/v1/contrib/eventmanagement/target_groups");
    events
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json() as Promise<TargetGroup[]>;
        }

        throw new Error("Something went wrong");
      })
      .then((result: TargetGroup[]) => {
        this.data = result.map((target_group: TargetGroup) =>
          Object.fromEntries(
            Object.entries(target_group).map(([name, value]) => [
              name,
              this.getInputFromColumn({ name, value }),
            ])
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
    value: InputType;
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
      ["default", () => html`${value}`],
    ]);

    return inputs.get(name) ? inputs.get(name)!() : inputs.get("default")!();
  }
}
