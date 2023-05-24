import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { searchSyntax } from "../../docs/searchSyntax";
import { InputConverter, TemplateResultConverter } from "../../lib/converters";
import { __ } from "../../lib/translate";
import {
  Column,
  LMSEvent,
  LMSEventType,
  LMSLocation,
  LMSTargetGroup,
  SortableColumns,
  TaggedColumn,
  TaggedData,
} from "../../sharedDeclarations";
import { skeletonStyles } from "../../styles/skeleton";
import LMSAnchor from "../LMSAnchor";
import LMSSearch from "../LMSSearch";
import LMSStaffEventCardAttendees from "./LMSStaffEventCardAttendees";
import LMSStaffEventCardForm from "./LMSStaffEventCardForm";
import LMSStaffEventCardPreview from "./LMSStaffEventCardPreview";
import LMSStaffEventsFilter from "./LMSStaffEventsFilter";

declare global {
  interface HTMLElementTagNameMap {
    "lms-staff-event-card-form": LMSStaffEventCardForm;
    "lms-staff-event-card-attendees": LMSStaffEventCardAttendees;
    "lms-staff-event-card-preview": LMSStaffEventCardPreview;
    "lms-staff-events-filter": LMSStaffEventsFilter;
    "lms-anchor": LMSAnchor;
    "lms-search": LMSSearch;
  }
}

@customElement("lms-staff-event-card-deck")
export default class LMSStaffEventCardDeck extends LitElement {
  @property({ type: Array }) events: LMSEvent[] = [];

  @property({ type: Array }) event_types: LMSEventType[] = [];

  @property({ type: Array }) target_groups: LMSTargetGroup[] = [];

  @property({ type: Array }) locations: LMSLocation[] = [];

  @property({ type: Array }) nextPage: Column[] | undefined = undefined;

  @property({ type: Boolean }) hasNoResults = false;

  @property({ type: Number }) _page = 1;

  @property({ type: Number }) _per_page = 20;

  private data: TaggedColumn[] = [];

  private cardStates: Map<string, string[]> = new Map();

  private inputConverter = new InputConverter();

  private sortableColumns: SortableColumns = ["id"];

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
    css`
      .card-deck {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
      }

      @media (min-width: 992px) {
        .card-deck {
          grid-gap: 1rem;
        }

        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
        }
      }

      @media (min-width: 1200px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
        }
      }

      @media (min-width: 1600px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
        }
      }

      @media (min-width: 1920px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(16.67%, 1fr));
        }
      }
    `,
  ];

  constructor() {
    super();
    this.sortableColumns = [
      ...(this.sortableColumns as ["id"]),
      "name",
      "event_type",
      "min_age",
      "max_age",
      "max_participants",
      "start_time",
      "end_time",
      "registration_start",
      "registration_end",
      "location",
      "image",
      "status",
      "registration_link",
      "open_registration",
      "description",
    ];
  }

  override connectedCallback() {
    super.connectedCallback();
    this.hydrate();
  }

  protected *getColumnData(query: LMSEvent, data?: TaggedData[]) {
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

  override updated(changedProperties: Map<string, never>) {
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

  private handleSearch(e: CustomEvent) {
    const { detail } = e;
    this.dispatchEvent(
      new CustomEvent("search", {
        detail,
        composed: true,
        bubbles: true,
      })
    );
  }

  private toggleDoc(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const doc = target.nextElementSibling;
    if (!doc) return;

    doc.classList.toggle("d-none");
  }

  override render() {
    return html`
      <div class="container-fluid mx-0">
        <lms-staff-events-filter
          .sortableColumns=${this.sortableColumns}
          .event_types=${this.event_types}
          .target_groups=${this.target_groups}
          .locations=${this.locations}
        >
          <lms-search
            @search=${this.handleSearch}
            .sortableColumns=${this.sortableColumns}
          ></lms-search>
          <lms-pagination
            .nextPage=${this.nextPage}
            ._page=${this._page}
            ._per_page=${this._per_page}
          ></lms-pagination>
        </lms-staff-events-filter>
        <div
          class="alert alert-info text-center ${classMap({
            "d-none": !this.hasNoResults,
          })}"
          role="alert"
        >
          <h4 class="alert-heading">${__("No matches found")}.</h4>
          <p>${__("Try refining your search.")}</p>
          <button class="btn btn-outline-info" @click=${this.toggleDoc}>
            ${__("Help")}
          </button>
          <div class="text-left d-none">
            <hr />
            ${searchSyntax}
          </div>
        </div>
        <div class="card-deck card-deck-responsive">
          ${map(this.data, (datum) => {
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
            `;
          })}
        </div>
      </div>
    `;
  }
}
