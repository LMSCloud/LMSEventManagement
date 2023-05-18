import {
  faCalendarAlt,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import LMSCard from "../components/LMSCard";
import LMSCardDetailsModal from "../components/LMSCardDetailsModal";
import LMSEventsFilter from "../components/LMSEventsFilter";
import { QueryBuilder } from "../lib/QueryBuilder";
import { requestHandler } from "../lib/RequestHandler";
import { splitDateTime } from "../lib/converters";
import { __, locale } from "../lib/translate";
import { LMSEvent, LMSLocation } from "../sharedDeclarations";
import { skeletonStyles } from "../styles/skeleton";

declare global {
  interface HTMLElementTagNameMap {
    "lms-card": LMSCard;
    "lms-events-filter": LMSEventsFilter;
    "lms-card-details-modal": LMSCardDetailsModal;
  }
}

@customElement("lms-events-view")
export default class LMSEventsView extends LitElement {
  @property({ type: String }) borrowernumber = undefined;

  @state() events: LMSEvent[] = [];

  @state() locations: LMSLocation[] = [];

  @state() modalData: LMSEvent = {} as LMSEvent;

  @state() hasOpenModal = false;

  @query(".load-more") loadMore!: HTMLButtonElement;

  private hasLoaded = false;

  private queryBuilder = new QueryBuilder();

  private boundHandlePopState = this.handlePopState.bind(this);

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
    css`
      .card-deck {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
      }

      @media (min-width: 768px) {
        .card-deck {
          grid-gap: 1rem;
        }

        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
        }
      }

      @media (min-width: 992px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
        }
      }

      @media (min-width: 1200px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
        }
      }

      @media (min-width: 1600px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(16.67%, 1fr));
        }
      }
    `,
  ];

  constructor() {
    super();

    this.queryBuilder.reservedParams = [
      "_match",
      "_order_by",
      "_page",
      "_per_page",
      "q",
    ];
    this.queryBuilder.areRepeatable = [
      "event_type",
      "target_group",
      "location",
    ];
    this.queryBuilder.query = window.location.search;
    this.queryBuilder.updateQuery(
      "_order_by=start_time&_page=1&_per_page=20&open_registration=true"
    );
  }

  override connectedCallback() {
    super.connectedCallback();

    window.addEventListener("popstate", this.boundHandlePopState);

    Promise.all([
      requestHandler.request(
        "getEventsPublic",
        this.queryBuilder.query.toString()
      ),
      requestHandler.request("getLocationsPublic"),
    ])
      .then((results) => Promise.all(results.map((result) => result.json())))
      .then(([events, locations]) => {
        this.hasLoaded = true;
        this.events = events;
        this.locations = locations;
        this.queryBuilder.updateUrl();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this.boundHandlePopState);
  }

  private handlePopState(e: PopStateEvent) {
    const { state } = e;
    const url = new URL(state?.url || window.location.href);
    this.handleQuery(new CustomEvent("query", { detail: url.search }), false);
  }

  private handleQuery(e: CustomEvent, updateUrl = true) {
    const query = e.detail;
    this.queryBuilder.updateQuery(query);

    const response = async () =>
      await requestHandler.request(
        "getEventsPublic",
        this.queryBuilder.query.toString()
      );
    response()
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Something went wrong");
      })
      .then((events: LMSEvent[]) => {
        this.events = events;
        if (updateUrl) {
          this.queryBuilder.updateUrl();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private handleShowDetails({ lmsEvent }: { lmsEvent: LMSEvent }) {
    this.modalData = lmsEvent;
    this.hasOpenModal = true;
  }

  private handleHideDetails() {
    this.modalData = {} as LMSEvent;
    this.hasOpenModal = false;
  }

  private handleLoadMore() {
    const currentPage = this.queryBuilder.getParamValue("_page");
    if (!currentPage) return;

    const nextPage = parseInt(currentPage, 10) + 1;
    this.queryBuilder.updateQuery(`_page=${nextPage}`);
    const response = async () =>
      await requestHandler.request(
        "getEventsPublic",
        this.queryBuilder.query.toString()
      );
    response()
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Something went wrong");
      })
      .then((events: LMSEvent[]) => {
        if (!events.length) {
          this.queryBuilder.updateQuery(`_page=${currentPage}`);
          this.loadMore.querySelector("button")?.classList.add("d-none");
          this.loadMore.firstElementChild?.classList.remove("d-none");
          return;
        }
        this.events = [...this.events, ...events];
      })
      .catch((error) => {
        console.error(error);
      });
  }

  override render() {
    return html`
      <div class="container-fluid px-0">
        <div class="row">
          <div class="col-12 mb-3">
            <lms-events-filter
              @filter=${this.handleQuery}
              @search=${this.handleQuery}
              .events=${this.events}
            >
              ${!this.hasLoaded
                ? html`<div class="d-flex justify-content-around flex-wrap">
                    ${map(
                      [...Array(10)],
                      () => html`<div class="skeleton skeleton-card"></div>`
                    )}
                  </div>`
                : nothing}
              ${this.hasLoaded && !this.events.length
                ? html`<div class="col-12" ?hidden=${this.events.length > 0}>
                    <div class="alert alert-info" role="alert">
                      ${__("There are no events to display")}
                    </div>
                  </div>`
                : nothing}
              <div class="col-12" ?hidden=${!this.events.length}>
                <div class="card-deck">
                  ${map(this.events, (event) => {
                    const [sDate, sTime] = splitDateTime(
                      event.start_time,
                      locale
                    );
                    const [eDate, eTime] = splitDateTime(
                      event.end_time,
                      locale
                    );
                    const isSameDay = sDate === eDate;
                    return html`
                      <lms-card
                        tabindex="0"
                        @keyup=${(e: KeyboardEvent) => {
                          if (e.key === "Enter") {
                            this.handleShowDetails({ lmsEvent: event });
                          }
                        }}
                        @click=${() => {
                          this.handleShowDetails({ lmsEvent: event });
                        }}
                        .title=${event.name}
                        .text=${event.description}
                        .listItems=${[
                          html`<span class="text-muted font-weight-light">
                            <small>
                              ${litFontawesome(faMapMarkerAlt)}
                              ${this.locations.find(
                                (location) =>
                                  location.id === parseInt(event.location, 10)
                              )?.name || __("Location not found")}
                            </small>
                          </span>`,
                          html`<span class="text-muted font-weight-light">
                            <small>
                              ${litFontawesome(faCalendarAlt)} ${sDate},
                              ${sTime} -
                              ${isSameDay ? eTime : `${eDate}, ${eTime}`}</small
                            ></span
                          >`,
                        ]}
                        .image=${{ src: event.image, alt: event.name }}
                      ></lms-card>
                    `;
                  }) ?? nothing}
                  <lms-card-details-modal
                    @close=${this.handleHideDetails}
                    .event=${this.modalData}
                    .isOpen=${this.hasOpenModal}
                  ></lms-card-details-modal>
                </div>
                <div class="d-flex justify-content-center load-more">
                  <span class="d-none text-center mt-3"
                    >${__("You've reached the end")}</span
                  >
                  <button
                    class="btn btn-primary btn-block mt-3 w-25"
                    ?hidden=${!this.events.length}
                    @click=${this.handleLoadMore}
                  >
                    ${__("Load more")}
                  </button>
                </div>
              </div>
            </lms-events-filter>
          </div>
        </div>
      </div>
    `;
  }
}
