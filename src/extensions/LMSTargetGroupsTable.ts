import { customElement } from "lit/decorators.js";
import LMSTable from "../components/LMSTable";
import { html, TemplateResult } from "lit";
import { InputType } from "../sharedDeclarations";
import { Input, TargetGroup } from "../sharedDeclarations";
import { TranslationController } from "../lib/TranslationController";

type TargetGroupValue = string | number | boolean;

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
      `/api/v1/contrib/eventmanagement/target_groups/${id}`,
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
      `/api/v1/contrib/eventmanagement/target_groups/${id}`,
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

    TranslationController.getInstance().loadTranslations(() => {
      console.log("Translations loaded");
    });

    this.order = ["id", "name", "min_age", "max_age"];
    this.isEditable = true;
    this.isDeletable = true;

    const events = fetch("/api/v1/contrib/eventmanagement/target_groups");
    events
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json() as Promise<TargetGroup[]>;
        }

        throw new Error("Something went wrong");
      })
      .then((result: TargetGroup[]) => {
        this.data = result?.map((target_group: TargetGroup) =>
          Object.fromEntries(
            Object.entries(target_group).map(
              ([name, value]: [string, TargetGroupValue]) => [
                name,
                this.getInputFromColumn({ name, value }) ?? "",
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
    value: InputType | TargetGroupValue;
  }) {
    const inputs = new Map<string, TemplateResult>([
      [
        "name",
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
        html`<input
          class="form-control"
          type="number"
          name="max_age"
          value=${value}
          disabled
        />`,
      ],
      ["default", html`${value}`],
    ]);

    return inputs.get(name) ? inputs.get(name) : inputs.get("default");
  }
}
