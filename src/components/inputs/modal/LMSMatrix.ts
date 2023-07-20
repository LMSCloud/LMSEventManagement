import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DirectiveResult } from "lit/directive";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";
import { TranslateDirective, __ } from "../../../lib/translate";
import { tailwindStyles } from "../../../tailwind.lit";
import { BaseFieldValue, MatrixGroup, ModalField } from "../../../types/common";

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

    static override styles = [tailwindStyles];

    override render() {
        const { field } = this;
        return html`
            <div class="form-control w-full">
                <label for=${field.name} class="label">
                    <span class="label-text"> ${field.desc} </span>
                </label>
                <table class="table" id=${field.name}>
                    <thead>
                        <tr>
                            ${map(
                                field.headers,
                                ([name]) => html`<th>${__(name)}</th>`
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        ${map(
                            field.dbData,
                            (row) => html`<tr>
                                <td class="align-middle">${row.name}</td>
                                ${map(field.headers, (header) =>
                                    this.getMatrixInputMarkup({
                                        field,
                                        row,
                                        header,
                                    })
                                )}
                            </tr>`
                        )}
                    </tbody>
                </table>
            </div>
        `;
    }

    private handleInput({ e, id, header }: InputHandlerArgs) {
        if (!(e.target instanceof HTMLInputElement)) return;

        const { field } = this;
        const { type } = e.target;
        const [name] = header;

        const updateOrCreateItem = (value: string | number) => {
            let newValue: MatrixGroup[];

            /** If there's no Array present in field.value
             *  we create one and add the item to it. */
            if (!(field?.value instanceof Array)) {
                newValue = [{ id: id.toString(), [name]: value }];
            } else {
                /** Now it must be an array because the guard clause
                 *  didn't return in the previous step. We check if
                 *  the item exists and update it if it does. */
                const item = field.value.find((item) => item.id == id);
                if (item) {
                    item[name] = value;
                    newValue = [...field.value] as MatrixGroup[];
                } else {
                    /** If it is an Array but we didn't find an item  we
                     *  have to add a new one. */
                    newValue = [
                        ...field.value,
                        { id: id.toString(), [name]: value },
                    ] as MatrixGroup[];
                }
            }

            // Dispatch the custom event
            this.dispatchEvent(
                new CustomEvent("change", {
                    detail: { name: field.name, value: newValue },
                    bubbles: true,
                    composed: true,
                })
            );
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

    private getValue(
        name: string,
        value: BaseFieldValue | undefined,
        row: Row
    ) {
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
            return (
                value.find((item) => item.id == row.id)?.[name] === 1 ?? false
            );
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
                    class="input-bordered input w-full"
                    step=${ifDefined(
                        field.attributes
                            ?.find(([attribute]) => attribute === "step")
                            ?.slice(-1)[0] as number
                    )}
                    @input=${(e: Event) =>
                        this.handleInput({ e, id: row.id, header })}
                    ?required=${field.required}
                />
            </td>`,
            checkbox: html` <td class="align-middle">
                <input
                    type="checkbox"
                    name=${row.name}
                    id=${row.id}
                    class="checkbox"
                    @input=${(e: Event) =>
                        this.handleInput({ e, id: row.id, header })}
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
