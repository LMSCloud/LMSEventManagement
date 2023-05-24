import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DirectiveResult } from "lit/directive";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";
import { TranslateDirective, __ } from "../../../lib/translate";
import {
  BaseFieldValue,
  MatrixGroup,
  ModalField,
} from "../../../sharedDeclarations";

type Row = {
  id: string | number;
  name: string | DirectiveResult<typeof TranslateDirective>;
};

type MatrixMarkupGenArgs = {
  field: ModalField;
  row: Row;
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
              ([name]) => html`<th scope="col">${__(name)}</th>`
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

  private handleInput({ e, id, header }: InputHandlerArgs) {
    if (!(e.target instanceof HTMLInputElement)) return;

    const { field } = this;
    const { type } = e.target;
    const [name] = header;

    const updateOrCreateItem = (value: string | number) => {
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
      case "number": {
        const { value } = e.target;
        updateOrCreateItem(value.toString());
        break;
      }
      case "checkbox": {
        const { checked } = e.target;
        updateOrCreateItem(checked ? 1 : 0);
        break;
      }
      default:
        break;
    }
  }

  private getValue(name: string, value: BaseFieldValue | undefined, row: Row) {
    if (value instanceof Array) {
      return value.find((item) => item.id == row.id)?.[name] ?? "0";
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      return value.toString();
    }

    return "0";
  }

  private getCheckedState(
    name: string,
    value: BaseFieldValue | undefined,
    row: Row
  ) {
    if (value instanceof Array) {
      return value.find((item) => item.id == row.id)?.[name] === 1 ?? false;
    }

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      return ["true", "1"].includes(value);
    }

    return false;
  }

  private getMatrixInputMarkup({ field, row, header }: MatrixMarkupGenArgs) {
    const [name, type] = header;
    const inputTypes: Record<string, TemplateResult> = {
      number: html`<td class="align-middle">
        <input
          type="number"
          name=${row.name}
          id=${row.id}
          value=${this.getValue(name, field.value, row)}
          class="form-control"
          step=${ifDefined(
            field.attributes
              ?.find(([attribute]) => attribute === "step")
              ?.slice(-1)[0] as number
          )}
          @input=${(e: Event) => this.handleInput({ e, id: row.id, header })}
          ?required=${field.required}
        />
      </td>`,
      checkbox: html` <td class="align-middle">
        <input
          type="checkbox"
          name=${row.name}
          id=${row.id}
          class="form-control"
          @input=${(e: Event) => this.handleInput({ e, id: row.id, header })}
          ?required=${field.required}
          ?checked=${this.getCheckedState(name, field.value, row)}
        />
      </td>`,
    };

    return {}.hasOwnProperty.call(inputTypes, type)
      ? inputTypes[type]
      : inputTypes["default"];
  }
}
