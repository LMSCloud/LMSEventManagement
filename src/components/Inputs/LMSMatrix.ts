import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, TemplateResult, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined";
import { MatrixGroup, ModalField } from "../../sharedDeclarations";
import { map } from "lit/directives/map.js";

type MatrixMarkupGenArgs = {
  field: ModalField;
  row: { id: string | number; name: string };
  header: string[];
};

type InputHandlerArgs = {
  e: Event;
  id: string | number;
  header: string[];
};

@customElement("lms-matrix")
export default class LMSMatrix extends LitElement {
  @property({ type: Object }) field: ModalField = {} as ModalField;
  @property({ type: Array }) value: MatrixGroup[] = [];
  // @state() private hasTransformedField = false;

  static override styles = [
    bootstrapStyles,
    css`
      input[type="checkbox"].form-control {
        font-size: 0.375rem;
      }
    `,
  ];

  override render() {
    const { field } = this;
    return html` <label for=${field.name}>${field.desc}</label>
      <table class="table table-bordered" id=${field.name}>
        <thead>
          <tr>
            ${map(
              field.headers,
              ([name]) => html`<th scope="col">${name}</th>`
            )}
          </tr>
        </thead>
        <tbody>
          ${map(
            field.dbData,
            (row) => html`<tr>
              <td class="align-middle">${row.name}</td>
              ${map(field.headers, (header) =>
                this.getMatrixInputMarkup({ field, row, header })
              )}
            </tr>`
          )}
        </tbody>
      </table>`;
  }

  handleInput({ e, id, header }: InputHandlerArgs) {
    if (!(e.target instanceof HTMLInputElement)) return;

    const { field } = this;
    const { type } = e.target;
    const [name] = header;

    const updateOrCreateItem = (value: string) => {
      /** If there's no Array present in field.value
       *  we create one and add the item to it. */
      if (!(field?.value instanceof Array)) {
        field.value = [{ id: id.toString(), [name]: value }];
        return;
      }

      /** Now it must be an array because the guard clause
       *  didn't return in the previous step. We check if
       *  the item exists and update it if it does. */
      const item = field.value.find((item) => item.id == id);
      if (item) {
        item[name] = value;
        return;
      }

      /** If it is an Array but we didn't find an item  we
       *  have to add a new one. */
      field.value.push({ id: id.toString(), [name]: value });
    };

    switch (type) {
      case "number":
        const { value } = e.target;
        updateOrCreateItem(value.toString());
        break;
      case "checkbox":
        const { checked } = e.target;
        updateOrCreateItem((checked ? 1 : 0).toString());
        break;
      default:
        break;
    }
  }

  private getMatrixInputMarkup({ field, row, header }: MatrixMarkupGenArgs) {
    const [name, type] = header;
    const inputTypes = new Map<string, TemplateResult>([
      [
        "number",
        html`<td class="align-middle">
          <input
            type="number"
            name=${row.name}
            id=${row.id}
            .value=${field.value instanceof Array
              ? field.value.find((item) => item.id === row.id)?.[name] ?? ""
              : ""}
            step="0.01"
            class="form-control"
            step=${ifDefined(
              field.attributes
                ?.find(([attribute]) => attribute === "step")
                ?.at(-1) as number
            )}
            @input=${(e: Event) => this.handleInput({ e, id: row.id, header })}
            ?required=${field.required}
          />
        </td>`,
      ],
      [
        "checkbox",
        html` <td class="align-middle">
          <input
            type="checkbox"
            name=${row.name}
            id=${row.id}
            class="form-control"
            @input=${(e: Event) => this.handleInput({ e, id: row.id, header })}
            ?required=${field.required}
            .checked=${field.value instanceof Array
              ? field.value.find((item) => item.id === row.id)?.[name] === "1"
                ? true
                : false
              : false}
          />
        </td>`,
      ],
    ]);

    return inputTypes.has(type)
      ? inputTypes.get(type)
      : inputTypes.get("default");
  }
}
