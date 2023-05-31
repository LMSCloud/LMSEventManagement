import { TemplateResult, html, nothing } from "lit";
import {
  TaggedData,
  InputType,
  LMSLocation,
  LMSEventTargetGroupFee,
  LMSTargetGroup,
  LMSEventType,
} from "../sharedDeclarations";
import { __ } from "../lib/translate";
import LMSPellEditor from "../components/LMSPellEditor";

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
  data?: LMSEventType[] | LMSLocation[] | LMSTargetGroup[]
) => TemplateResult;

declare global {
  interface HTMLElementTagNameMap {
    "lms-pell-editor": LMSPellEditor;
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
  ): string {
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
   * Retrieves all the rendered values from the TemplateResult.
   * @param data - The data object to extract values from. Defaults to the stored TemplateResult.
   * @returns An array of the extracted values.
   */
  public getRenderValues(data = this._templateResult): unknown[] {
    const { values } = data as TemplateResult;
    return [...values, ""].map((e) =>
      typeof e === "object" ? this.getRenderValues(e) : e
    );
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
 * Normalizes a datetime string for use in an input field of type "datetime-local".
 * @param string - The datetime string to normalize.
 * @param format - The format of the datetime string.
 * @returns The normalized datetime string.
 */
export function normalizeForInput(string: string, format: string): string {
  if (format === "datetime-local") {
    const datetime = new Date(string);
    const normalizedDateTime = datetime.toISOString().slice(0, 16);
    return normalizedDateTime;
  }

  return string;
}

/**
 * Converts a datetime string to ISO8601 format.
 * @param string - The datetime string to convert.
 * @returns The converted datetime string.
 * @see https://en.wikipedia.org/wiki/ISO_8601
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 */
export function convertToISO8601(string: string): string {
  const datetime = new Date(string);
  return datetime.toISOString();
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
        class="form-control"
        type="text"
        name="name"
        value=${value}
        disabled
      />`,
      event_type: (value, data) => html`<select
        class="form-control"
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
        <button
          type="button"
          class="btn btn-link btn-section w-100 text-left"
          data-toggle="collapse"
          data-target="#targetGroups"
          @click=${this.toggleCollapse}
        >
          <h4 class="pointer-events-none">${__("Target Groups")}</h4>
        </button>
        <div class="collapse" id="targetGroups">
          <table
            class="table table-sm table-bordered table-striped mx-3 w-inherit"
          >
            <thead>
              <tr>
                <th scope="col">${__("target_group")}</th>
                <th scope="col">${__("selected")}</th>
                <th scope="col">${__("fee")}</th>
              </tr>
            </thead>
            <tbody>
              ${(data as unknown as LMSTargetGroup[]).map(
                ({ id, name }: LMSTargetGroup) => {
                  const targetGroupFee = (
                    value as unknown as LMSEventTargetGroupFee[]
                  ).find(
                    (targetGroupFee: LMSEventTargetGroupFee) =>
                      targetGroupFee.target_group_id === id
                  );
                  const selected = targetGroupFee?.selected ?? false;
                  const fee = targetGroupFee?.fee ?? 0;
                  return html`
                    <tr>
                      <td id=${id} class="align-middle">${name}</td>
                      <td class="align-middle">
                        <input
                          type="checkbox"
                          data-group="target_groups"
                          name="selected"
                          id=${id}
                          class="form-control"
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
                          class="form-control"
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
      `,
      min_age: (value) => html`<input
        class="form-control"
        type="number"
        name="min_age"
        value=${value}
        disabled
      />`,
      max_age: (value) => html`<input
        class="form-control"
        type="number"
        name="max_age"
        value=${value}
        disabled
      />`,
      max_participants: (value) => html`<input
        class="form-control"
        type="number"
        name="max_participants"
        value=${value}
        disabled
      />`,
      location: (value, data) => html`<select
        class="form-control"
        name="location"
        disabled
      >
        ${(data as unknown as LMSLocation[])?.map(
          ({ id, name }: LMSLocation) =>
            html`<option value=${id} ?selected=${id == value}>${name}</option>`
        )}
      </select>`,
      image: (value) => html`<input
        class="form-control"
        type="text"
        name="image"
        value=${value}
        disabled
      />`,
      description: (value) => {
        return html`
          <div @closed=${this.handleClosed}>
            <textarea class="form-control" name="description" disabled>
${value}
              </textarea
            >
            <lms-pell-editor .value=${value}></lms-pell-editor>
          </div>
        `;
      },

      open_registration: (value) => html`<input
        class="form-control"
        type="checkbox"
        name="open_registration"
        ?checked=${value as unknown as boolean}
        disabled
      />`,
      street: (value) => html`<input
        class="form-control"
        type="text"
        name="street"
        value=${value}
        disabled
      />`,
      number: (value) => html`<input
        class="form-control"
        type="text"
        name="number"
        value=${value}
        disabled
      />`,
      city: (value) => html`<input
        class="form-control"
        type="text"
        name="city"
        value=${value}
        disabled
      />`,
      zip: (value) => html`<input
        class="form-control"
        type="text"
        name="zip"
        value=${value}
        disabled
      />`,
      country: (value) => html`<input
        class="form-control"
        type="text"
        name="country"
        value=${value}
        disabled
      />`,
      start_time: (value) => html`<input
        class="form-control"
        type="datetime-local"
        name="start_time"
        value=${normalizeForInput(value as string, "datetime-local")}
        disabled
      />`,
      end_time: (value) => html`<input
        class="form-control"
        type="datetime-local"
        name="end_time"
        value=${normalizeForInput(value as string, "datetime-local")}
        disabled
      />`,
      registration_start: (value) => html`<input
        class="form-control"
        type="datetime-local"
        name="registration_start"
        value=${normalizeForInput(value as string, "datetime-local")}
        disabled
      />`,
      registration_end: (value) => html`<input
        class="form-control"
        type="datetime-local"
        name="registration_end"
        value=${normalizeForInput(value as string, "datetime-local")}
        disabled
      />`,
      status: (value) => html`<select
        class="form-control"
        name="status"
        disabled
      >
        <option value="pending" ?selected=${(value as string) === "pending"}>
          ${__("Pending")}
        </option>
        <option
          value="confirmed"
          ?selected=${(value as string) === "confirmed"}
        >
          ${__("Confirmed")}
        </option>
        <option value="canceled" ?selected=${(value as string) === "canceled"}>
          ${__("Canceled")}
        </option>
        <option value="sold_out" ?selected=${(value as string) === "sold_out"}>
          ${__("Sold Out")}
        </option>
      </select>`,
      registration_link: (value) => html`<input
        class="form-control"
        type="text"
        name="registration_link"
        value=${value}
        disabled
      />`,
      value: (value) => {
        return html`<input
          class="form-control"
          type="text"
          name="value"
          value=${value}
          disabled
        />`;
      },
    };
  }

  /**
   * Handles the closed event of the LMSPellEditor.
   * Sets the value of the textarea to the value of the LMSPellEditor.
   * @param e
   */
  private handleClosed(e: CustomEvent) {
    const target = e.target as LMSPellEditor;
    const textarea = target.previousElementSibling as HTMLTextAreaElement;
    const { value } = e.detail;

    if (textarea) {
      textarea.value = value;
    }
  }

  /**
   * Toggles the collapse state of a target element.
   * @param e - The MouseEvent that triggered the toggle.
   */
  private toggleCollapse(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const button = target.closest("button");
    if (!button) return;

    const collapse = button.nextElementSibling as HTMLElement;
    const parent = collapse.parentElement;
    if (collapse.classList.contains("show")) {
      parent?.classList.remove("pip");
      collapse.classList.remove("show");
    } else {
      parent?.classList.add("pip");
      collapse.classList.add("show");
    }
  }

  /**
   * Checks if a particular input template requires data to be rendered correctly.
   * @param name - The name of the input template.
   * @returns A boolean indicating whether the input template requires data.
   */
  private needsData(name: string): boolean {
    return ["target_groups", "event_type", "location"].includes(name);
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
  ): LMSTargetGroup[] | LMSLocation[] | LMSEventType[] | undefined {
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
