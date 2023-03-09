import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, TemplateResult, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined";
import { ModalField } from "../../interfaces";

type MatrixInputHandlerArgs = {
  e: Event;
  field: ModalField;
  name: string;
  entry: { value: string; name: string };
};

type MatrixMarkupGenArgs = {
  field: ModalField;
  entry: { value: string; name: string };
  header: string[];
};

type GroupItem = {
  id: number;
} & Record<string, unknown | undefined>;

@customElement("lms-matrix")
export default class LMSMatrix extends LitElement {
  @property({ type: Object }) field: ModalField = {} as ModalField;
  @property({ type: Array }) value: { [key: string]: string }[] = [];
  @property({ type: Boolean }) hasResolvedEntries = false;
  @property({ type: Array, attribute: false }) private group: GroupItem[] = [];

  static override styles = [
    bootstrapStyles,
    css`
      input[type="checkbox"].form-control {
        font-size: 0.375rem;
      }
    `,
  ];

  override performUpdate(): void {
    if (!this.value) {
      return;
    }
    this.group = this.value.length
      ? this.value
          .map((obj: Record<string, unknown>) => {
            const idKey = Object.keys(obj).find((key) =>
              key.toLowerCase().includes("id")
            );
            if (!idKey) {
              return undefined;
            }
            const idValue = obj[idKey];
            if (!idValue) {
              return undefined;
            }
            delete obj[idKey];
            return {
              id: idValue,
              ...obj,
            };
          })
          .filter((groupItem): groupItem is GroupItem => Boolean(groupItem))
      : [];
    super.performUpdate();
  }

  override render() {
    const { field } = this;
    return html` <label for=${field.name}>${field.desc}</label>
      <table class="table table-bordered" id=${field.name}>
        <thead>
          <tr>
            ${field.headers?.map(
              ([name]) => html`<th scope="col">${name}</th>`
            )}
          </tr>
        </thead>
        <tbody>
          ${field.entries?.map(
            (entry) => html`<tr>
              <td class="align-middle">${entry.name}</td>
              ${field.headers?.map((header) =>
                this.getMatrixInputMarkup({ field, entry, header })
              )}
            </tr>`
          )}
        </tbody>
      </table>`;
  }

  private getMatrixInputMarkup({ field, entry, header }: MatrixMarkupGenArgs) {
    const [name, type] = header;
    const inputTypes = new Map<string, TemplateResult>([
      [
        "number",
        html`<td class="align-middle">
          <input
            type="number"
            name=${entry.name}
            id=${entry.value}
            .value=${this.group.find(
              (groupItem) => groupItem.id === parseInt(entry.value, 10)
            )?.[name] as unknown as string}
            step="0.01"
            class="form-control"
            step=${ifDefined(
              field.attributes
                ?.find(([attribute]) => attribute === "step")
                ?.at(-1) as number
            )}
            @input=${(e: Event) => {
              this.handleMatrixInput({ e, field, name, entry });
            }}
            ?required=${field.required}
          />
        </td>`,
      ],
      [
        "checkbox",
        html` <td class="align-middle">
          <input
            type="checkbox"
            name=${entry.name}
            id=${entry.value}
            value="1"
            class="form-control"
            @input=${(e: Event) => {
              this.handleMatrixInput({ e, field, name, entry });
            }}
            ?required=${field.required}
            .checked=${this.group.find(
              (groupItem) => groupItem.id === parseInt(entry.value, 10)
            )?.[name] as unknown as boolean}
          />
        </td>`,
      ],
    ]);

    return inputTypes.has(type)
      ? inputTypes.get(type)
      : inputTypes.get("default");
  }

  private handleMatrixInput({ e, field, name, entry }: MatrixInputHandlerArgs) {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (!(field.value instanceof Array)) {
      field.value = [];
    }

    const index = field.value.findIndex((row) => row.id === entry.value);
    if (index === -1) {
      field.value.push({
        id: entry.value,
        [name]:
          new Map<string, string>([
            ["number", target.value],
            ["checkbox", target.checked ? "1" : "0"],
          ]).get(target.type) ?? target.value,
      });
      return;
    }

    field.value[index][name] = target.value;
  }
}
