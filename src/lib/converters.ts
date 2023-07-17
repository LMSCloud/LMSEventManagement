import countryToCurrency from "country-to-currency";
import { html, nothing, TemplateResult } from "lit";
import LMSPellEditor from "../components/LMSPellEditor";
import { __ } from "../lib/translate";
import {
    InputType,
    LMSEventTargetGroupFee,
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    TaggedData,
    UploadedImage,
} from "../types/common";

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
 * Represents a TemplateResultConverter that can extract values and render strings from a TemplateResult.
 */
export class TemplateResultConverter {
    private _templateResult: unknown;

    /**
     * Creates a new instance of TemplateResultConverter.
     * @param templateResult - The TemplateResult to be converted.
     */
    constructor(templateResult: unknown) {
        this._templateResult = templateResult;
    }

    /**
     * Sets the TemplateResult to be converted.
     * @param templateResult - The TemplateResult to be set.
     */
    set templateResult(templateResult: unknown) {
        this._templateResult = templateResult;
    }

    /**
     * Retrieves the value at the specified index from the TemplateResult.
     * @param templateResult - The TemplateResult to extract the value from.
     * @param index - The index of the value to retrieve.
     * @returns The extracted value as a string.
     */
    public getValueByIndex(
        templateResult: TemplateResult,
        index: number
    ): unknown {
        this.templateResult = templateResult;
        const renderValue = this.getRenderValues()[index];
        return typeof renderValue === "string"
            ? renderValue
            : (renderValue as string | number | boolean).toString();
    }

    /**
     * Generates the rendered string from the TemplateResult.
     * @param data - The data object to render. Defaults to the stored TemplateResult.
     * @returns The rendered string.
     */
    public getRenderString(data = this._templateResult): string {
        const { strings, values } = data as TemplateResult;
        const v = [...values, ""].map((e) =>
            typeof e === "object" ? this.getRenderString(e) : e
        );
        return strings.reduce((acc, s, i) => acc + s + v[i], "");
    }

    /**
     * Checks if the provided value is a TemplateResult.
     * @param value
     * @returns
     */
    private isTemplateResult(value: unknown): boolean {
        return (
            typeof value === "object" &&
            {}.hasOwnProperty.call(value, "_$litType$")
        );
    }

    /**
     * Retrieves all the rendered values from the TemplateResult.
     * @param data - The data object to extract values from. Defaults to the stored TemplateResult.
     * @returns An array of the extracted values.
     */
    public getRenderValues(data: unknown = this._templateResult): unknown[] {
        // Using optional chaining (?.) to check if data is null or undefined and
        // if values exist in data; if not, default to an empty array (?? [])
        const values = (data as TemplateResult)?.values ?? [];

        // Now, we can map through the values array directly
        return [...values].flatMap((e) => {
            if (this.isTemplateResult(e)) {
                return this.getRenderValues(e);
            }

            if (
                Array.isArray(e) &&
                e.some((item) => this.isTemplateResult(item))
            ) {
                const indices: number[] = [];
                let index;
                for (index = 0; index < e.length; index += 1) {
                    if ({}.hasOwnProperty.call(e[index], "_$litType$")) {
                        indices.push(index);
                    }
                }
                return e.map((item, index) => {
                    if (indices.includes(index)) {
                        return this.getRenderValues(item);
                    }

                    return item;
                });
            }

            return e;
        });
    }
}

/**
 * Converts a datetime string to the specified format.
 * @param string - The datetime string to convert.
 * @param format - The desired format for the conversion.
 * @param locale - The locale to use for the conversion.
 * @returns The converted datetime string.
 */
export function convertToFormat(
    string: string,
    format: string,
    locale: string
): string {
    if (format === "datetime") {
        const datetime = new Date(string);
        return datetime.toLocaleString(locale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    if (format === "date") {
        const date = new Date(string);
        return date.toLocaleDateString(locale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }

    return string;
}

/**
 * Splits a datetime string into date and time components.
 * @param {string} string - The datetime string to split.
 * @param {string} locale - The locale used for formatting the date and time.
 * @returns {string[]} An array containing the date and time components.
 */
export function splitDateTime(
    string: string | Date | null,
    locale: string
): string[] {
    if (!string) return [`${__("Error: Invalid date")}`, ""];
    const datetime = new Date(string);
    const date = datetime.toLocaleDateString(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const time = datetime.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
    });
    return [date, time];
}

/**
 * Represents a DatetimeLocal object.
 */
class DatetimeLocal {
    year!: number;
    month!: number;
    day!: number;
    hours!: number;
    minutes!: number;

    private static cache: Map<string, Partial<DatetimeLocal>> = new Map();

    /**
     * Creates a new instance of DatetimeLocal.
     * @param date The date to create the DatetimeLocal object from.
     * @returns A new instance of DatetimeLocal.
     */
    static fromDate(date: Date): Partial<DatetimeLocal> {
        return {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1, // Months are 0-indexed
            day: date.getUTCDate(),
            hours: date.getUTCHours(),
            minutes: date.getUTCMinutes(),
        };
    }

    /**
     * Creates a new instance of DatetimeLocal.
     * @param datetime The datetime string to create the DatetimeLocal object from.
     * @returns A new instance of DatetimeLocal.
     */
    static fromString(datetime: string): Partial<DatetimeLocal> {
        // Look for the datetime string in the cache
        const cachedDatetime = this.cache.get(datetime);
        if (cachedDatetime !== undefined) {
            return cachedDatetime;
        }

        const [datePart, timePart] = datetime.split("T");
        const offsetPart = timePart.slice(-6);
        const [year, month, day] = datePart
            .split("-")
            .map((part) => parseInt(part, 10));
        let [hours, minutes] = timePart
            .slice(0, 5)
            .split(":")
            .map((part) => parseInt(part, 10));

        if (offsetPart.includes("+") || offsetPart.includes("-")) {
            const offsetSign = offsetPart[0] === "+" ? 1 : -1;
            const offsetHours = parseInt(offsetPart.slice(1, 3), 10);
            const offsetMinutes = parseInt(offsetPart.slice(4), 10);

            hours += offsetSign * offsetHours;
            minutes += offsetSign * offsetMinutes;
        }

        const parsedDatetime = { year, month, day, hours, minutes };

        // Store the parsed datetime in the cache
        this.cache.set(datetime, parsedDatetime);

        return parsedDatetime;
    }
}

/**
 * Pads a number with the specified character to the specified length.
 * @param value value to pad
 * @param length length to pad to
 * @param padChar character to pad with
 * @returns padded string
 */
function padStart(
    value: number | undefined,
    length: number,
    padChar = "0"
): string {
    return String(value).padStart(length, padChar);
}

/**
 * Normalizes a datetime string for use in an input field.
 * @param datetime
 * @param format
 * @returns
 */
export function normalizeForInput(
    datetime: string | Date,
    format: string
): string {
    if (format !== "datetime-local") {
        return datetime instanceof Date ? datetime.toString() : datetime;
    }

    try {
        let dateParts: Partial<DatetimeLocal>;

        if (datetime instanceof Date) {
            dateParts = DatetimeLocal.fromDate(datetime);
        } else {
            dateParts = DatetimeLocal.fromString(datetime);
        }

        const { year, month, day, hours, minutes } = dateParts;

        const paddedYear = padStart(year, 4);
        const paddedMonth = padStart(month, 2);
        const paddedDay = padStart(day, 2);
        const paddedHours = padStart(hours, 2);
        const paddedMinutes = padStart(minutes, 2);
        return `${paddedYear}-${paddedMonth}-${paddedDay}T${paddedHours}:${paddedMinutes}`;
    } catch (error) {
        console.error(`Failed to normalize datetime: ${error}`);
        return datetime instanceof Date ? datetime.toString() : datetime;
    }
}

/**
 * Converts a datetime string to ISO8601 format with the caller's timezone offset.
 * @param string - The datetime string to convert.
 * @returns The converted datetime string in ISO8601 format with the caller's timezone offset.
 * @see https://en.wikipedia.org/wiki/ISO_8601
 */
export function convertToISO8601(string: string): string {
    return new Date(string).toISOString();
}

/**
 * Returns a TemplateResult for a datetime string formatted by the specified locale.
 * @param datetime
 * @param locale
 * @returns TemplateResult
 */
export function formatDatetimeByLocale(
    datetime: string | Date | null,
    locale: string
) {
    if (!datetime) return html`<span>${__("There's been an error")}..</span>`;
    if (datetime) {
        return new Intl.DateTimeFormat(locale, {
            dateStyle: "full",
            timeStyle: "short",
        }).format(new Date(datetime));
    }
    return nothing;
}

/**
 * Returns the currency symbol for the specified locale.
 * @param locale
 * @param amount
 * @returns
 */
export function formatMonetaryAmountByLocale(
    locale: string,
    amount?: number | null
): string {
    if (!amount) {
        return "";
    }

    const countryCode = locale.split("-")[1];
    try {
        const currencyFormatter = new Intl.NumberFormat(locale, {
            style: "currency",
            currency:
                countryToCurrency[
                    countryCode as keyof typeof countryToCurrency
                ],
        });

        return currencyFormatter.format(amount);
    } catch (error) {
        console.error(`Error formatting currency for locale ${locale}:`, error);

        return "";
    }
}

/**
 * Returns a TemplateResult for a LMSLocation object.
 * @param address
 * @returns TemplateResult
 */
export function formatAddress(address: number | LMSLocation | null) {
    if (!address || typeof address === "number")
        return html`<span>${__("There's been an error")}..</span>`;
    if (address) {
        const { name, street, number, city, zip, country } = address;
        return html` <strong>${name}</strong><br />
            ${street} ${number}<br />
            ${zip} ${city}<br />
            ${country}`;
    }
    return nothing;
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
        if (!details || target.tagName !== "SUMMARY") return;

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
        if (!template) return this.renderValue(value);

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
        if (!data) return undefined;

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
