import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, TemplateResult, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined";
import { ModalField } from "../../sharedDeclarations";

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
  @property({ type: Boolean, attribute: false }) private hasTransformedField =
    false;

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
            const clone = { ...obj };
            const idKey = Object.keys(clone).find((key) =>
              key.toLowerCase().includes("id")
            );
            if (!idKey) {
              return undefined;
            }
            const idValue = clone[idKey];
            if (!idValue) {
              return undefined;
            }
            delete clone[idKey];
            return {
              id: idValue,
              ...clone,
            };
          })
          .filter((groupItem): groupItem is GroupItem => Boolean(groupItem))
      : [];
    /** We have to update the value on the field with the expected format
     *  as the form can be submitted without the user interacting with the
     *  matrix input. We only do this on the first update though. */
    if (!this.hasTransformedField) {
      this.field.value = this.group.map(({ id, ...rest }) => {
        rest = Object.fromEntries(
          Object.entries(rest).map(([key, value]) => {
            let _value;
            switch (typeof value) {
              case "boolean":
                _value = value ? "1" : "0";
                break;
              case "number":
                _value = value.toString();
                break;
              default:
                break;
            }
            return [key, _value];
          })
        );
        return {
          id,
          ...rest,
        };
      }) as unknown as { [key: string]: string }[];
      this.hasTransformedField = true;
    }
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
      return;
    }

    const index = field.value?.findIndex((value) => value.id === entry.value);
    if (target.type === "checkbox") {
      field.value[index][name] = target.checked ? "1" : "0";
    }

    if (target.type === "number") {
      field.value[index][name] = target.value.toString();
    }

    field.value[index][name] = target.value;
  }
}
