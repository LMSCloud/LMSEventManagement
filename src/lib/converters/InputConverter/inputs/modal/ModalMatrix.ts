import { html, TemplateResult } from "lit";
import { z } from "zod";
import { ModalField } from "../../../../../types/common";
import { __ } from "../../../../translate";

export default class ModalMatrix {
    private name: string;

    private value:
        | string
        | number
        | boolean
        | unknown[]
        | Record<string, unknown>
        | undefined;

    private headers: string[][] | undefined;

    private data: any[] | undefined;

    constructor(value: ModalField, data: any[]) {
        this.name = value.name;
        this.value = value.value;
        this.headers = value.headers;
        this.data = data;
    }

    public render() {
        if (this.name !== "target_groups") {
            return this.renderError();
        }

        return html`<table
            class="table table-xs my-4"
            @change=${this.handleMatrixChange}
        >
            <thead>
                <tr>
                    ${this.headers?.map((header) => {
                        let [title] = header;
                        if (!title) {
                            title = "Unknown";
                        }

                        return html`<th>${__(title)}</th>`;
                    })}
                </tr>
            </thead>
            <tbody>
                ${this.data?.map((datum) => {
                    let checked = undefined;
                    let fee = undefined;
                    if (Array.isArray(this.value)) {
                        const row = this.value.find(
                            (row: any) => row.id == datum.id
                        ) as any;

                        if (row) {
                            checked = row.selected;
                            fee = row.fee;
                        }
                    }

                    return html`
                        <tr>
                            <td id=${datum.id} class="align-middle">
                                ${datum.name}
                            </td>
                            <td class="align-middle">
                                <input
                                    type="checkbox"
                                    data-group="target_groups"
                                    name="selected"
                                    id=${datum.id}
                                    class="checkbox"
                                    ?checked=${Boolean(checked)}
                                />
                            </td>
                            <td class="align-middle">
                                <input
                                    type="number"
                                    data-group="target_groups"
                                    name="fee"
                                    id=${datum.id}
                                    step="0.01"
                                    class="input input-bordered w-full"
                                    value=${fee}
                                />
                            </td>
                        </tr>
                    `;
                })}
            </tbody>
        </table>`;
    }

    private handleMatrixChange(e: Event | CustomEvent): void {
        if (e instanceof CustomEvent) {
            return;
        }

        const TargetGroupSchema = z.object({
            id: z.string().transform((val) => Number(val)),
            selected: z.string().transform((val) => val === "true"),
            fee: z.string().transform((val) => parseFloat(val)),
        });

        const table = e.currentTarget as HTMLTableElement;
        const rows = Array.from(table.querySelectorAll("tbody > tr"));
        const matrixData = rows.map((row) => {
            const id = row.querySelector("td")?.id;
            const selectedInput = row.querySelector(
                'input[type="checkbox"]'
            ) as HTMLInputElement;
            const feeInput = row.querySelector(
                'input[type="number"]'
            ) as HTMLInputElement;

            if (!id || !selectedInput || !feeInput) {
                return;
            }

            const selected = selectedInput.checked.toString();
            const fee = feeInput.value || "0";

            // Validate and coerce the data with Zod
            const groupData = { id, selected, fee };
            const validationResult = TargetGroupSchema.safeParse(groupData);

            if (!validationResult.success) {
                // Handle validation errors
                console.error(validationResult.error);
                return;
            }

            return validationResult.data; // Return the validated and coerced data
        });

        // Emit a custom event here with matrixData as its detail
        const changeEvent = new CustomEvent("change", {
            detail: { name: "target_groups", value: matrixData },
            bubbles: true,
        });
        table.dispatchEvent(changeEvent);
    }

    private renderError(): TemplateResult {
        return html`<strong>${__("Error")}!</strong>`;
    }
}
