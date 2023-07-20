import { html, TemplateResult } from "lit";
import LMSPellEditor from "../../components/custom/LMSPellEditor";
import {
    InputType,
    LMSEventTargetGroupFee,
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    TaggedData,
    UploadedImage,
} from "../../types/common";
import { normalizeForInput } from "./datetimeConverters";

type InputTypeValue =
    | string
    | number
    | boolean
    | Array<unknown>
    | Record<string, unknown>
    | null;

type TemplateQuery = {
    name: string;
    value: InputType | InputTypeValue;
    data?: TaggedData[];
};

type TemplateFunction = (
    value: InputTypeValue,
    data?: LMSEventType[] | LMSLocation[] | LMSTargetGroup[] | UploadedImage[]
) => TemplateResult;

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

    /**
     * Creates a new instance of InputConverter.
     */
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
        };
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

    /**
     * Checks if a particular input template requires data to be rendered correctly.
     * @param name - The name of the input template.
     * @returns A boolean indicating whether the input template requires data.
     */
    private needsData(name: string): boolean {
        return ["target_groups", "event_type", "location", "image"].includes(
            name
        );
    }

    /**
     * Retrieves the appropriate input template based on the provided query.
     * @param query - The query object containing the name, value, and optional data for the input template.
     * @returns The TemplateResult representing the input template.
     */
    public getInputTemplate({
        name,
        value,
        data,
    }: TemplateQuery): TemplateResult {
        const template = this.conversionMap[name];
        if (!template) {
            return this.renderValue(value);
        }

        if (this.needsData(name)) {
            const requiredData = this.findDataByName(name, data);
            if (!requiredData) return this.renderError();
            return template(value, requiredData);
        }

        return template(value);
    }

    /**
     * Finds the required data based on the name from the provided data array.
     * @param name - The name of the required data.
     * @param data - The data array to search in.
     * @returns The found data if available, otherwise undefined.
     */
    private findDataByName(
        name: string,
        data?: TaggedData[]
    ):
        | LMSTargetGroup[]
        | LMSLocation[]
        | LMSEventType[]
        | UploadedImage[]
        | undefined {
        if (!data) {
            return undefined;
        }

        const [, foundData] =
            data.find(([tag]) => tag === name) ?? new Array(2).fill(undefined);
        return foundData;
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
