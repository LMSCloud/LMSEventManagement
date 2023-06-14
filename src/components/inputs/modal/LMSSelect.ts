import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { tailwindStyles } from "../../../tailwind.lit";
import { ModalField, SelectOption } from "../../../types/common";

@customElement("lms-select")
export default class LMSSelect extends LitElement {
    @property({ type: Object }) field: ModalField = {} as ModalField;

    private defaultOption = {} as SelectOption;

    static override styles = [tailwindStyles];

    protected override updated(
        _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
    ): void {
        super.updated(_changedProperties);
        if (_changedProperties.has("field")) {
            this.setDefaultOption();
        }
    }

    private setDefaultOption() {
        const { dbData } = this.field;
        if (dbData?.length) {
            const [defaultOption] = dbData;
            const { id } = defaultOption;
            this.field.value = id.toString();
            this.defaultOption = defaultOption;
        }
    }

    override render() {
        const { name, desc, value, required, dbData } = this.field;
        return html`
            <div class="form-control w-full">
                <label for=${name} class="label"
                    ><span class="label-text">${desc}</span></label
                >
                <select
                    name=${name}
                    id=${name}
                    class="select-bordered select"
                    @change=${(e: Event) => {
                        this.field.value =
                            (e.target as HTMLSelectElement).value ?? value;
                        this.dispatchEvent(
                            new CustomEvent("change", {
                                detail: {
                                    name,
                                    value: this.field.value,
                                },
                                composed: true,
                                bubbles: true,
                            })
                        );
                    }}
                    ?required=${required}
                >
                    ${map(
                        dbData,
                        ({ id, name }: SelectOption) =>
                            html`<option
                                value=${id}
                                ?selected=${id === this.defaultOption.id}
                            >
                                ${name}
                            </option>`
                    )}
                </select>
            </div>
        `;
    }
}
