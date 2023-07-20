import { html, TemplateResult } from "lit";
import { map } from "lit/directives/map.js";
import { z } from "zod";
import LMSPellEditor from "../../components/custom/LMSPellEditor";
import {
    InputType,
    LMSEventTargetGroupFee,
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    ModalField,
    TaggedData,
    UploadedImage,
} from "../../types/common";
import { convertToISO8601, normalizeForInput } from "./datetimeConverters";

type InputTypeValue =
    | string
    | number
    | boolean
    | Array<unknown>
    | Record<string, unknown>
    | null;

type TemplateQuery = {
    name: string;
    value: InputType | InputTypeValue | ModalField;
    data?: TaggedData[];
};

type TemplateFunction = (
    value: InputTypeValue | ModalField,
    data?: LMSEventType[] | LMSLocation[] | LMSTargetGroup[] | UploadedImage[]
) => TemplateResult;

type Option = {
    id: number;
    name: string;
};

declare global {
    interface HTMLElementTagNameMap {
        "lms-image-picker": LMSPellEditor;
    }
}

/**
 * Represents an InputConverter that handles conversion of input fields based on their name.
 */
export class InputConverter {
    private conversionMap: Record<string, TemplateFunction> = {};

    private static readonly DATA_REQUIRING_TEMPLATES = [
        "target_groups",
        "event_type",
        "location",
        "image",
        "status",
    ];

    constructor() {
        this.conversionMap = {
            name: (value) => html`<input
                class="input-bordered input w-full"
                type="text"
                name="name"
                value=${value}
                disabled
            />`,
            event_type: (value, data) => html`<select
                class="select-bordered select w-full"
                name="event_type"
                disabled
            >
                ${(data as LMSEventType[])?.map(
                    ({ id, name }: LMSEventType) =>
                        html`<option
                            value=${id}
                            ?selected=${id === parseInt(value as string, 10)}
                        >
                            ${name}
                        </option>`
                )};
            </select>`,
            target_groups: (value, data) => html`
                <details class="collapse bg-base-200" @click=${this.togglePip}>
                    <summary
                        class="collapse-title min-h-12 !flex items-center justify-center p-0 "
                    >
                        ${__("Target Groups")}
                    </summary>
                    <div class="collapse-content">
                        <table class="table-xs table">
                            <thead>
                                <tr>
                                    <th>${__("target_group")}</th>
                                    <th>${__("selected")}</th>
                                    <th>${__("fee")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(data as LMSTargetGroup[]).map(
                                    ({ id, name }: LMSTargetGroup) => {
                                        const targetGroupFee = (
                                            value as LMSEventTargetGroupFee[]
                                        ).find(
                                            (
                                                targetGroupFee: LMSEventTargetGroupFee
                                            ) =>
                                                targetGroupFee.target_group_id ===
                                                id
                                        );
                                        const selected =
                                            targetGroupFee?.selected ?? false;
                                        const fee = targetGroupFee?.fee ?? 0;
                                        return html`
                                            <tr>
                                                <td
                                                    id=${id}
                                                    class="align-middle"
                                                >
                                                    ${name}
                                                </td>
                                                <td class="align-middle">
                                                    <input
                                                        type="checkbox"
                                                        data-group="target_groups"
                                                        name="selected"
                                                        id=${id}
                                                        class="checkbox"
                                                        ?checked=${selected}
                                                        disabled
                                                    />
                                                </td>
                                                <td class="align-middle">
                                                    <input
                                                        type="number"
                                                        data-group="target_groups"
                                                        name="fee"
                                                        id=${id}
                                                        step="0.01"
                                                        class="input-bordered input w-full"
                                                        value=${fee}
                                                        disabled
                                                    />
                                                </td>
                                            </tr>
                                        `;
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </details>
            `,
            min_age: (value) => html`<input
                class="input-bordered input w-full"
                type="number"
                name="min_age"
                value=${value}
                disabled
            />`,
            max_age: (value) => html`<input
                class="input-bordered input w-full"
                type="number"
                name="max_age"
                value=${value}
                disabled
            />`,
            max_participants: (value) => html`<input
                class="input-bordered input w-full"
                type="number"
                name="max_participants"
                value=${value}
                disabled
            />`,
            location: (value, data) => html`<select
                class="select-bordered select w-full"
                name="location"
                disabled
            >
                ${(data as LMSLocation[])?.map(
                    ({ id, name }: LMSLocation) =>
                        html`<option value=${id} ?selected=${id == value}>
                            ${name}
                        </option>`
                )}
            </select>`,
            link: (value) => html`<input
                class="input-bordered input w-full"
                type="text"
                name="link"
                value=${value}
                disabled
            />`,
            image: (value, data) =>
                html` <lms-image-picker
                    .uploads=${data as UploadedImage[]}
                    .selected=${value as string}
                    .disabled=${true}
                    class="lit-element"
                >
                    <input
                        slot="input"
                        class="input-bordered input w-full"
                        name="image"
                        value=${value}
                        disabled
                    />
                </lms-image-picker>`,
            description: (value) => {
                return html` <lms-pell-editor .value=${value}>
                    <textarea
                        class="input-bordered input block w-full"
                        name="description"
                        disabled
                    >
${value}</textarea
                    >
                </lms-pell-editor>`;
            },
            open_registration: (value) => html`<input
                class="checkbox"
                type="checkbox"
                name="open_registration"
                ?checked=${value as unknown as boolean}
                disabled
            />`,
            street: (value) => html`<input
                class="input-bordered input w-full"
                type="text"
                name="street"
                value=${value}
                disabled
            />`,
            number: (value) => html`<input
                class="input-bordered input w-full"
                type="text"
                name="number"
                value=${value}
                disabled
            />`,
            city: (value) => html`<input
                class="input-bordered input w-full"
                type="text"
                name="city"
                value=${value}
                disabled
            />`,
            zip: (value) => html`<input
                class="input-bordered input w-full"
                type="text"
                name="zip"
                value=${value}
                disabled
            />`,
            country: (value) => html`<input
                class="input-bordered input w-full"
                type="text"
                name="country"
                value=${value}
                disabled
            />`,
            start_time: (value) => html`<input
                class="input-bordered input w-full"
                type="datetime-local"
                name="start_time"
                value=${normalizeForInput(value as string, "datetime-local")}
                disabled
            />`,
            end_time: (value) => html`<input
                class="input-bordered input w-full"
                type="datetime-local"
                name="end_time"
                value=${normalizeForInput(value as string, "datetime-local")}
                disabled
            />`,
            registration_start: (value) => html`<input
                class="input-bordered input w-full"
                type="datetime-local"
                name="registration_start"
                value=${normalizeForInput(value as string, "datetime-local")}
                disabled
            />`,
            registration_end: (value) => html`<input
                class="input-bordered input w-full"
                type="datetime-local"
                name="registration_end"
                value=${normalizeForInput(value as string, "datetime-local")}
                disabled
            />`,
            status: (value) => html`<select
                class="select-bordered select w-full"
                name="status"
                disabled
            >
                <option
                    value="pending"
                    ?selected=${(value as string) === "pending"}
                >
                    ${__("Pending")}
                </option>
                <option
                    value="confirmed"
                    ?selected=${(value as string) === "confirmed"}
                >
                    ${__("Confirmed")}
                </option>
                <option
                    value="canceled"
                    ?selected=${(value as string) === "canceled"}
                >
                    ${__("Canceled")}
                </option>
                <option
                    value="sold_out"
                    ?selected=${(value as string) === "sold_out"}
                >
                    ${__("Sold Out")}
                </option>
            </select>`,
            registration_link: (value) => html`<input
                class="input-bordered input w-full"
                type="text"
                name="registration_link"
                value=${value}
                disabled
            />`,
            value: (value) => {
                return html`<input
                    class="input-bordered input w-full"
                    type="text"
                    name="value"
                    value=${value}
                    disabled
                />`;
            },
            modal_text: (value) => {
                const {
                    name,
                    desc,
                    placeholder,
                    required,
                    value: initialValue,
                } = value as ModalField;
                return html` <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">${desc}</span>
                    </label>
                    <input
                        class="input-bordered input w-full"
                        type="text"
                        name=${name}
                        placeholder=${placeholder}
                        ?required=${required}
                        value=${initialValue}
                    />
                </div>`;
            },
            modal_number: (value) => {
                const {
                    name,
                    desc,
                    placeholder,
                    required,
                    value: initialValue,
                } = value as ModalField;
                return html` <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">${desc}</span>
                    </label>
                    <input
                        class="input-bordered input w-full"
                        type="text"
                        name=${name}
                        placeholder=${placeholder}
                        ?required=${required}
                        value=${initialValue}
                        step=${name === "fee" ? "0.01" : "1"}
                    />
                </div>`;
            },
            modal_matrix: (value, data) => {
                const { name, headers } = value as ModalField;

                if (name !== "target_groups") {
                    return this.renderError();
                }

                return html`<table
                    class="table-xs my-4 table"
                    @change=${this.handleMatrixChange}
                >
                    <thead>
                        <tr>
                            ${map(headers, (header) => {
                                let [title] = header;
                                if (!title) {
                                    title = "Unknown";
                                }

                                return html`<th>${__(title)}</th>`;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        ${(data as any).map((datum: any) => {
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
                                            ?checked=${datum.selected}
                                        />
                                    </td>
                                    <td class="align-middle">
                                        <input
                                            type="number"
                                            data-group="target_groups"
                                            name="fee"
                                            id=${datum.id}
                                            step="0.01"
                                            class="input-bordered input w-full"
                                            value=${datum.fee}
                                        />
                                    </td>
                                </tr>
                            `;
                        })}
                    </tbody>
                </table>`;
            },
            modal_select: (value, data) => {
                const {
                    name,
                    desc,
                    required,
                    value: initialValue,
                } = value as ModalField;
                if (!data) {
                    return this.renderError();
                }

                return html` <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">${desc}</span>
                    </label>
                    <select
                        class="select-bordered select"
                        name=${name}
                        ?required=${required}
                    >
                        <option selected disabled>
                            ${__("Please select an option")}
                        </option>
                        ${(data as Option[]).map(
                            (datum) =>
                                html`<option
                                    value=${datum.id}
                                    ?selected=${datum.id === initialValue}
                                >
                                    ${datum.name}
                                </option>`
                        )}
                    </select>
                </div>`;
            },
            modal_checkbox: (value) => {
                const {
                    name,
                    desc,
                    required,
                    value: initialValue,
                } = value as ModalField;
                return html` <div class="form-control">
                    <label class="label cursor-pointer">
                        <input
                            type="checkbox"
                            ?checked=${initialValue}
                            class="checkbox"
                            name=${name}
                            ?required=${required}
                        />
                        <span class="label-text">${desc}</span>
                    </label>
                </div>`;
            },
            "modal_datetime-local": (value) => {
                const {
                    name,
                    desc,
                    required,
                    value: initialValue,
                } = value as ModalField;
                return html` <div
                    class="form-control w-full"
                    @change=${this.handleDatetimeLocalChange}
                >
                    <label class="label">
                        <span class="label-text">${desc}</span>
                    </label>
                    <input
                        class="input-bordered input w-full"
                        type="datetime-local"
                        name=${name}
                        ?required=${required}
                        value=${initialValue}
                    />
                </div>`;
            },
        };
    }

    private handleDatetimeLocalChange(e: Event | CustomEvent): void {
        if (e instanceof CustomEvent) {
            return;
        }

        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        const { name } = target;
        let { value } = target;

        value = convertToISO8601(value);

        const changeEvent = new CustomEvent("change", {
            detail: { name, value },
            bubbles: true,
        });

        target.dispatchEvent(changeEvent);
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

    /**
     * Toggles the collapse state of a target element.
     * @param e - The MouseEvent that triggered the toggle.
     */
    private togglePip(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const details = target.closest("details");
        if (!details || target.tagName !== "SUMMARY") {
            return;
        }

        const parent = details.parentElement;
        if (parent?.classList.contains("pip")) {
            parent?.classList.remove("pip");
        } else {
            parent?.classList.add("pip");
        }
    }

    private needsData(templateName: string): boolean {
        return InputConverter.DATA_REQUIRING_TEMPLATES.includes(templateName);
    }

    public getInputTemplate({
        name,
        value,
        data,
    }: TemplateQuery): TemplateResult {
        const template = this.conversionMap[name];
        if (!template) return this.renderValue(value);

        const targetName = this.getTargetName(name, value);
        if (!targetName) return this.renderError();

        if (this.needsData(targetName)) {
            const requiredData = this.findDataByName(targetName, data);
            if (!requiredData) return this.renderError();

            return template(value, requiredData);
        }

        return template(value);
    }

    private getTargetName(name: string, value: unknown): string | undefined {
        if (name.startsWith("modal_")) {
            return (value as ModalField)?.name;
        }

        return name;
    }

    private findDataByName(name: string, data?: TaggedData[]): any {
        return data?.find(([tag]) => tag === name)?.[1];
    }

    /**
     * Renders the value as a TemplateResult.
     * @param value - The value to be rendered.
     * @returns The rendered value as a TemplateResult.
     */
    private renderValue(value: InputTypeValue): TemplateResult {
        return html`${value}`;
    }

    /**
     * Renders an error message as a TemplateResult.
     * @returns The rendered error message as a TemplateResult.
     */
    private renderError(): TemplateResult {
        return html`<strong>${__("Error")}!</strong>`;
    }
}
