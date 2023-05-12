import { TemplateResult, html } from "lit";
import {
  TaggedData,
  EventType,
  InputType,
  LMSLocation,
  TargetGroup,
  TargetGroupFee,
} from "../sharedDeclarations";
// import { map } from "lit/directives/map.js";
import { __ } from "../lib/translate";

type InputTypeValue = string | number | boolean | TargetGroupFee[];

type TemplateQuery = {
  name: string;
  value: InputType | InputTypeValue;
  data?: TaggedData[];
};

type TemplateFunction = (
  value: InputTypeValue,
  data?: EventType[] | LMSLocation[] | TargetGroup[]
) => TemplateResult;

export class TemplateResultConverter {
  private _templateResult: unknown;

  constructor(templateResult: unknown) {
    this._templateResult = templateResult;
  }

  set templateResult(templateResult: unknown) {
    this._templateResult = templateResult;
  }

  public getValueByIndex(
    templateResult: TemplateResult,
    index: number
  ): string {
    this.templateResult = templateResult;
    const renderValue = this.getRenderValues()[index];
    return typeof renderValue === "string"
      ? renderValue
      : (renderValue as any).toString();
  }

  public getRenderString(data = this._templateResult): string {
    const { strings, values } = data as TemplateResult;
    const v = [...values, ""].map((e) =>
      typeof e === "object" ? this.getRenderString(e) : e
    );
    return strings.reduce((acc, s, i) => acc + s + v[i], "");
  }

  public getRenderValues(data = this._templateResult): unknown[] {
    const { values } = data as TemplateResult;
    return [...values, ""].map((e) =>
      typeof e === "object" ? this.getRenderValues(e) : e
    );
  }
}

export function convertToFormat(
  string: string,
  format: string,
  locale: string
): string {
  if (format === "datetime") {
    const date = new Date(string);
    return date.toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return string;
}

export class InputConverter {
  private conversionMap: Record<string, TemplateFunction> = {};

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
        ${(data as EventType[])?.map(
          ({ id, name }: EventType) =>
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
              ${(data as unknown as TargetGroup[]).map(
                ({ id, name }: TargetGroup) => {
                  const targetGroupFee = (
                    value as unknown as TargetGroupFee[]
                  ).find(
                    (targetGroupFee: TargetGroupFee) =>
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
      description: (value) => html`<textarea
        class="form-control"
        name="description"
        disabled
      >
${value}</textarea
      >`,
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
        value=${value}
        disabled
      />`,
      end_time: (value) => html`<input
        class="form-control"
        type="datetime-local"
        name="end_time"
        value=${value}
        disabled
      />`,
      registration_start: (value) => html`<input
        class="form-control"
        type="datetime-local"
        name="registration_start"
        value=${value}
        disabled
      />`,
      registration_end: (value) => html`<input
        class="form-control"
        type="datetime-local"
        name="registration_end"
        value=${value}
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
    };
  }

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

  private needsData(name: string): boolean {
    return ["target_groups", "event_type", "location"].includes(name);
  }

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

  private findDataByName(
    name: string,
    data?: TaggedData[]
  ): TargetGroup[] | LMSLocation[] | EventType[] | undefined {
    if (!data) return undefined;

    const [, foundData] =
      data.find(([tag]) => tag === name) ?? new Array(2).fill(undefined);
    return foundData;
  }

  private renderValue(value: InputTypeValue): TemplateResult {
    return html`${value}`;
  }

  private renderError(): TemplateResult {
    return html`<strong>${__("Error")}!</strong>`;
  }
}
