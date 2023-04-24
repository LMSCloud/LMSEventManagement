import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, TemplateResult, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import LMSStaffEventCardForm from "./LMSStaffEventCard/LMSStaffEventCardForm";
import {
  TaggedColumn,
  TargetGroup,
  TargetGroupFee,
  EventType,
  LMSLocation,
  LMSEvent,
  TargetGroupState,
} from "../sharedDeclarations";
import LMSStaffEventCardAttendees from "./LMSStaffEventCard/LMSStaffEventCardAttendees";
import LMSStaffEventCardPreview from "./LMSStaffEventCard/LMSStaffEventCardPreview";
import LMSAnchor from "./LMSAnchor";
import { TemplateResultConverter } from "../lib/converters";
import { map } from "lit/directives/map.js";
import insertResponsiveWrapper from "../lib/insertResponsiveWrapper";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";

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
  @property({ type: Array }) events: LMSEvent[] = [];
  @property({ type: Array }) event_types: EventType[] = [];
  @property({ type: Array }) target_groups: TargetGroup[] = [];
  @property({ type: Array }) locations: LMSLocation[] = [];
  private data: TaggedColumn[] = [];
  private cardStates: Map<string, string[]> = new Map();

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
    css`
      .card-deck-responsive {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }

      .card-deck-responsive .card {
        flex: 0 0 auto;
        margin: 1rem;
        width: calc(
          20% - 2rem
        ); /* Adjust the width to 20% for larger screens */
      }

      @media (max-width: 1920px) {
        .card-deck-responsive .card {
          width: calc(
            25% - 2rem
          ); /* Adjust the width to 25% for 1080p screens */
        }
      }

      @media (max-width: 1200px) {
        .card-deck-responsive .card {
          width: calc(
            50% - 2rem
          ); /* Adjust the width to 50% for screens smaller than 1200px */
        }
      }

      @media (max-width: 768px) {
        .card-deck-responsive .card {
          width: calc(
            100% - 2rem
          ); /* Adjust the width to 100% for screens smaller than 768px */
        }
      }
    `,
  ];

  override connectedCallback() {
    super.connectedCallback();
    this.hydrate();
  }

  private hydrate() {
    /** Here we initialize the card states so we can track them
     *  individually going forward. */
    this.events.forEach(() => {
      this.cardStates.set(
        crypto.getRandomValues(new Uint32Array(2)).join("-"),
        ["data"]
      );
    });

    const data = this.events.map((event: LMSEvent) => {
      const entries = Object.entries(event).map(([name, value]) => {
        return [name, this.getInputFromColumn({ name, value })];
      });
      return Object.fromEntries(entries);
    });

    /** Here we tag every datum with the uuid we generated earlier. */
    this.data = data.map((datum, index) => {
      const [uuid] = [...this.cardStates][index];
      return {
        ...datum,
        uuid,
      };
    });
  }

  private getInputFromColumn({
    name,
    value,
  }: {
    name: string;
    value: string | number | TargetGroupState[];
  }) {
    const inputs = new Map<string, TemplateResult>([
      [
        "name",
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
        html`<select class="form-control" name="event_type" disabled>
          ${map(
            this.event_types,
            ({ id, name }: { id: number; name: string }) =>
              html`<option
                value=${id}
                ?selected=${id === parseInt(value as string, 10)}
              >
                ${name}
              </option>`
          )};
        </select>`,
      ],
      [
        "target_groups",
        html`
          <table class="table table-sm table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">${__("target_group")}</th>
                <th scope="col">${__("selected")}</th>
                <th scope="col">${__("fee")}</th>
              </tr>
            </thead>
            <tbody>
              ${map(this.target_groups, ({ id, name }: TargetGroup) => {
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
        `,
      ],
      [
        "min_age",
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
        html`<select class="form-control" name="location" disabled>
          ${map(
            this.locations,
            ({ id, name }: { id: number; name: string }) =>
              html`<option value=${id}>${name}</option>`
          )}
        </select>`,
      ],
      [
        "image",
        html`<input
          class="form-control"
          type="text"
          name="image"
          value=${value}
          disabled
        />`,
      ],
      [
        "description",
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
        html`<select class="form-control" name="status" disabled>
          <option value="pending" ?selected=${(value as string) === "pending"}>
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
      ],
      [
        "registration_link",
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
      ["default", html`${value}`],
    ]);

    return inputs.get(name) ? inputs.get(name) : inputs.get("default");
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
    return html`
      <div class="container-fluid mx-0">
        <div class="card-deck card-deck-responsive">
          ${map(this.data, (datum, index) => {
            const { name, uuid } = datum;
            const [title] = new TemplateResultConverter(name).getRenderValues();
            const [state] = this.cardStates.get(uuid) || "data";
            return html`
              <div class="card mt-5">
                <div class="card-header">
                  <ul class="nav nav-tabs card-header-tabs">
                    <li
                      class="nav-item"
                      data-content="data"
                      data-uuid=${datum.uuid}
                      @click=${this.handleTabClick}
                    >
                      <a class="nav-link active" href="#">${__("Data")}</a>
                    </li>
                    <li
                      class="nav-item"
                      data-content="attendees"
                      data-uuid=${datum.uuid}
                      @click=${this.handleTabClick}
                    >
                      <a class="nav-link" href="#">${__("Waitlist")}</a>
                    </li>
                    <li
                      class="nav-item"
                      data-content="preview"
                      data-uuid=${datum.uuid}
                      @click=${this.handleTabClick}
                    >
                      <a class="nav-link">${__("Preview")}</a>
                    </li>
                  </ul>
                </div>
                <div class="card-body">
                  <h3 class="card-title">
                    ${html`<span class="badge badge-primary">${title}</span>`}
                  </h3>
                  <lms-staff-event-card-form
                    .datum=${datum}
                    ?hidden=${!(state === "data")}
                  ></lms-staff-event-card-form>
                  <lms-staff-event-card-attendees
                    ?hidden=${!(state === "attendees")}
                  ></lms-staff-event-card-attendees>
                  <lms-staff-event-card-preview
                    ?hidden=${!(state === "preview")}
                    .datum=${datum}
                  ></lms-staff-event-card-preview>
                </div>
              </div>
              <!-- ${insertResponsiveWrapper(index)} -->
            `;
          })}
        </div>
      </div>
    `;
  }
}
