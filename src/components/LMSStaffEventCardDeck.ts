import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, TemplateResult, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import LMSStaffEventCardForm from "./LMSStaffEventCard/LMSStaffEventCardForm";
import {
  InputType,
  Column,
  TargetGroup,
  TargetGroupFee,
  URIComponents,
} from "../sharedDeclarations";
import LMSStaffEventCardAttendees from "./LMSStaffEventCard/LMSStaffEventCardAttendees";
import LMSStaffEventCardPreview from "./LMSStaffEventCard/LMSStaffEventCardPreview";
import LMSAnchor from "./LMSAnchor";
import TemplateResultConverter from "../lib/TemplateResultConverter";
import { map } from "lit/directives/map";

declare global {
  interface HTMLElementTagNameMap {
    "lms-staff-event-card-form": LMSStaffEventCardForm;
    "lms-staff-event-card-attendees": LMSStaffEventCardAttendees;
    "lms-staff-event-card-preview": LMSStaffEventCardPreview;
    "lms-anchor": LMSAnchor;
  }
}

@customElement("lms-staff-event-card-deck")
export default class LMSStaffEventCardDeck extends LitElement {
  @property({ type: Array }) data: Column[] = [];
  @state() cardStates: Map<string, string[]> = new Map();
  @state() href: URIComponents = {
    path: "/cgi-bin/koha/plugins/run.pl",
    query: true,
    params: {
      class: "Koha::Plugin::Com::LMSCloud::EventManagement",
      method: "configure",
    },
  };

  static override styles = [
    bootstrapStyles,
    css`
      .card-deck {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(40rem, 1fr));
        grid-gap: 0.5rem;
      }
    `,
  ];

  override connectedCallback() {
    super.connectedCallback();

    const events = fetch("/api/v1/contrib/eventmanagement/events");
    events
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        }

        throw new Error("Something went wrong");
      })
      /** Because we have to fetch data from endpoints to build the select
       *  elements, we have to make the getInputFromColumn function async
       *  and therefore turn the whole map call into nested async calls.
       *  Looks ugly, but basically the call to getInputFromColumn call
       *  just turns the enclosed function into a promise, which resolves
       *  to the value you'd expect. Just ignore the async/await syntax
       *  and remember that you have to resolve the Promise returned by
       *  the previous call before you can continue with the next one. */
      .then(async (result) => {
        /** Here we initialize the card states so we can track them
         *  individually going forward. */
        result.forEach(() => {
          this.cardStates.set(
            crypto.getRandomValues(new Uint32Array(2)).join("-"),
            ["data"]
          );
        });

        const data = await Promise.all(
          result.map(
            async (promisedTemplateResult: Promise<TemplateResult>) => {
              const entries = await Promise.all(
                Object.entries(promisedTemplateResult).map(
                  async ([name, value]) => [
                    name,
                    await this.getInputFromColumn({ name, value }),
                  ]
                )
              );
              return Object.fromEntries(entries);
            }
          )
        );
        /** Here we tag every datum with the uuid we generated earlier. */
        const cardStatesArray = Array.from(this.cardStates);
        this.data = data.map((datum, index) => ({
          ...datum,
          uuid: cardStatesArray[index][0],
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private async getInputFromColumn({
    name,
    value,
  }: {
    name: string;
    value: InputType;
  }) {
    const inputs = new Map<
      string,
      () => TemplateResult | Promise<TemplateResult>
    >([
      [
        "name",
        () =>
          html`<input
            class="form-control"
            type="text"
            name="name"
            value=${value}
            disabled
          />`,
      ],
      [
        "event_type",
        async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/event_types"
          );
          const result = await response.json();
          return html`<select class="form-control" name="event_type" disabled>
            ${map(
              result,
              ({ id, name }: { id: number; name: string }) =>
                html`<option
                  value=${id}
                  ?selected=${id === parseInt(value, 10)}
                >
                  ${name}
                </option>`
            )};
          </select>`;
        },
      ],
      [
        "target_groups",
        async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/target_groups"
          );
          const result = await response.json();
          return html`
            <table class="table table-sm table-bordered table-striped">
              <thead>
                <tr>
                  <th scope="col">target_group</th>
                  <th scope="col">selected</th>
                  <th scope="col">fee</th>
                </tr>
              </thead>
              <tbody>
                ${map(result, ({ id, name }: TargetGroup) => {
                  const target_group = (
                    value as unknown as TargetGroupFee[]
                  ).find((target_group) => target_group.target_group_id === id);
                  const selected = target_group?.selected ?? false;
                  const fee = target_group?.fee ?? 0;
                  return html`
                    <tr>
                      <td
                        id=${id}
                        data-group="target_groups"
                        data-name="id"
                        class="align-middle"
                      >
                        ${name}
                      </td>
                      <td class="align-middle">
                        <input
                          type="checkbox"
                          data-group="target_groups"
                          data-name="selected"
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
                          data-name="fee"
                          id=${id}
                          step="0.01"
                          class="form-control"
                          value=${fee}
                          disabled
                        />
                      </td>
                    </tr>
                  `;
                })}
              </tbody>
            </table>
          `;
        },
      ],
      [
        "min_age",
        () =>
          html`<input
            class="form-control"
            type="number"
            name="min_age"
            value=${value}
            disabled
          />`,
      ],
      [
        "max_age",
        () =>
          html`<input
            class="form-control"
            type="number"
            name="max_age"
            value=${value}
            disabled
          />`,
      ],
      [
        "max_participants",
        () =>
          html`<input
            class="form-control"
            type="number"
            name="max_participants"
            value=${value}
            disabled
          />`,
      ],
      [
        "start_time",
        () =>
          html`<input
            class="form-control"
            type="datetime-local"
            name="start_time"
            value=${value}
            disabled
          />`,
      ],
      [
        "end_time",
        () =>
          html`<input
            class="form-control"
            type="datetime-local"
            name="end_time"
            value=${value}
            disabled
          />`,
      ],
      [
        "registration_start",
        () =>
          html`<input
            class="form-control"
            type="datetime-local"
            name="registration_start"
            value=${value}
            disabled
          />`,
      ],
      [
        "registration_end",
        () =>
          html`<input
            class="form-control"
            type="datetime-local"
            name="registration_end"
            value=${value}
            disabled
          />`,
      ],
      [
        "fee",
        () =>
          html`<input
            class="form-control"
            type="number"
            step="0.01"
            name="fee"
            value=${value}
            disabled
          />`,
      ],
      [
        "location",
        async () => {
          const response = await fetch(
            "/api/v1/contrib/eventmanagement/locations"
          );
          const result = await response.json();
          return html`<select class="form-control" name="location" disabled>
            ${map(
              result,
              ({ id, name }: { id: number; name: string }) =>
                html`<option value=${id}>${name}</option>`
            )};
          </select>`;
        },
      ],
      [
        "image",
        () =>
          html`<input
            class="form-control"
            type="number"
            name="image"
            value=${value}
            disabled
          />`,
      ],
      [
        "description",
        () =>
          html`<textarea
            class="form-control overflow-hidden h-100"
            name="description"
            disabled
          >
${value}</textarea
          >`,
      ],
      [
        "status",
        () =>
          html`<select class="form-control" name="status" disabled>
            <option
              value="pending"
              ?selected=${(value as string) === "pending"}
            >
              Pending
            </option>
            <option
              value="confirmed"
              ?selected=${(value as string) === "confirmed"}
            >
              Confirmed
            </option>
            <option
              value="canceled"
              ?selected=${(value as string) === "canceled"}
            >
              Canceled
            </option>
            <option
              value="sold_out"
              ?selected=${(value as string) === "sold_out"}
            >
              Sold Out
            </option>
          </select>`,
      ],
      [
        "registration_link",
        () =>
          html`<input
            class="form-control"
            type="text"
            name="registration_link"
            value=${value}
            disabled
          />`,
      ],
      [
        "open_registration",
        () =>
          html`<input
            @change=${(e: Event) => {
              const target = e.target as HTMLInputElement;
              target.value = (target.checked ? 1 : 0).toString();
            }}
            class="form-check-input"
            type="checkbox"
            name="open_registration"
            ?checked=${value as unknown as boolean}
            disabled
          />`,
      ],
      ["default", () => html`${value}`],
    ]);

    return inputs.get(name) ? inputs.get(name)!() : inputs.get("default")!();
  }

  private handleTabClick(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const tab = target.closest("li");
    if (!tab) return;

    const previousActiveTab = tab.closest("ul")?.querySelector(".active");
    if (!previousActiveTab) return;
    previousActiveTab.classList.remove("active");

    tab.firstElementChild?.classList.add("active");

    const { content, uuid } = tab.dataset;
    if (!content || !uuid) return;
    this.cardStates.set(uuid, [content]);
    this.requestUpdate();
  }

  override render() {
    return !this.data.length
      ? html`<h1 class="text-center">
          You have to create a
          <lms-anchor
            .href=${{
              ...this.href,
              params: {
                ...this.href.params,
                op: "target-groups",
              },
            }}
            data-text="target group"
            >target group</lms-anchor
          >, a
          <lms-anchor
            .href=${{
              ...this.href,
              params: {
                ...this.href.params,
                op: "locations",
              },
            }}
            data-text="location"
            >location</lms-anchor
          >
          and an
          <lms-anchor
            .href=${{
              ...this.href,
              params: {
                ...this.href.params,
                op: "event-types",
              },
            }}
            data-text="event type"
            >event type</lms-anchor
          >
          first.
        </h1>`
      : html`
          <div class="container-fluid mx-0">
            <div class="card-deck">
              ${map(
                this.data,
                (datum) => html`
                  <div class="card">
                    <div class="card-header">
                      <ul class="nav nav-tabs card-header-tabs">
                        <li
                          class="nav-item"
                          data-content="data"
                          data-uuid=${datum.uuid}
                          @click=${this.handleTabClick}
                        >
                          <a class="nav-link active" href="#">Data</a>
                        </li>
                        <li
                          class="nav-item"
                          data-content="attendees"
                          data-uuid=${datum.uuid}
                          @click=${this.handleTabClick}
                        >
                          <a class="nav-link" href="#">Waitlist</a>
                        </li>
                        <li
                          class="nav-item"
                          data-content="preview"
                          data-uuid=${datum.uuid}
                          @click=${this.handleTabClick}
                        >
                          <a class="nav-link">Preview</a>
                        </li>
                      </ul>
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">
                        ${html`<span class="badge badge-primary"
                          >${[
                            new TemplateResultConverter(
                              datum.name
                            ).getRenderValues(),
                          ]}</span
                        >`}
                      </h5>
                      <lms-staff-event-card-form
                        .datum=${datum}
                        ?hidden=${!(
                          this.cardStates?.get(datum.uuid as string)?.[0] ===
                          "data"
                        )}
                      ></lms-staff-event-card-form>
                      <lms-staff-event-card-attendees
                        ?hidden=${!(
                          this.cardStates?.get(datum.uuid as string)?.[0] ===
                          "attendees"
                        )}
                      ></lms-staff-event-card-attendees>
                      <lms-staff-event-card-preview
                        ?hidden=${!(
                          this.cardStates?.get(datum.uuid as string)?.[0] ===
                          "preview"
                        )}
                        .datum=${datum}
                      ></lms-staff-event-card-preview>
                    </div>
                  </div>
                `
              )}
            </div>
          </div>
        `;
  }
}
