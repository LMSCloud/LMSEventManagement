import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import LMSStaffEventCardForm from "./LMSStaffEventCard/LMSStaffEventCardForm";
import {
  TaggedColumn,
  TargetGroup,
  EventType,
  LMSLocation,
  LMSEvent,
  TaggedData,
} from "../sharedDeclarations";
import LMSStaffEventCardAttendees from "./LMSStaffEventCard/LMSStaffEventCardAttendees";
import LMSStaffEventCardPreview from "./LMSStaffEventCard/LMSStaffEventCardPreview";
import LMSAnchor from "./LMSAnchor";
import { InputConverter, TemplateResultConverter } from "../lib/converters";
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
  private inputConverter = new InputConverter();

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

  protected *getColumnData(
    query: Record<string, string | number | boolean | any[]>,
    data?: TaggedData[]
  ) {
    for (const [name, value] of Object.entries(query)) {
      yield [name, this.inputConverter.getInputTemplate({ name, value, data })];
    }
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
      return Object.fromEntries(
        this.getColumnData(event, [
          ["target_groups", this.target_groups],
          ["location", this.locations],
          ["event_type", this.event_types],
        ])
      );
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

  override updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    if (changedProperties.has("events")) {
      this.hydrate();
      this.requestUpdate();
    }
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
