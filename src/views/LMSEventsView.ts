import { LitElement, html, nothing, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import LMSCard from "../components/LMSCard";
import LMSEventsFilter from "../components/LMSEventsFilter";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LMSEvent } from "../sharedDeclarations";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";
import LMSCardDetailsModal from "../components/LMSCardDetailsModal";
import LMSPaginationNav from "../components/LMSPaginationNav";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";

declare global {
  interface HTMLElementTagNameMap {
    "lms-card": LMSCard;
    "lms-events-filter": LMSEventsFilter;
    "lms-card-details-modal": LMSCardDetailsModal;
    "lms-pagination-nav": LMSPaginationNav;
  }
}

type ReservedParam = "_match" | "_order_by" | "_page" | "_per_page" | "q";

@customElement("lms-events-view")
export default class LMSEventsView extends LitElement {
  @property({ type: String }) borrowernumber = undefined;
  @property({ attribute: "has-hidden-facets", reflect: true }) hasHiddenFacets =
    false;
  @state() events: LMSEvent[] = [];
  @state() modalData: LMSEvent = {} as LMSEvent;
  @state() hasOpenModal = false;
  @state() _match?: string;
  @state() _order_by?: string = "start_time";
  @state() _page: number = 1;
  @state() _per_page: number = 20;
  @state() q?: string;

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

        :host([has-hidden-facets="true"]) .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
        }

        :host([has-hidden-facets="false"]) .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
        }
      }

      @media (min-width: 992px) {
        :host([has-hidden-facets="true"]) .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
        }

        :host([has-hidden-facets="false"]) .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
        }
      }

      @media (min-width: 1200px) {
        :host([has-hidden-facets="true"]) .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
        }

        :host([has-hidden-facets="false"]) .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
        }
      }

      @media (min-width: 1600px) {
        :host([has-hidden-facets="true"]) .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(16.67%, 1fr));
        }

        :host([has-hidden-facets="false"]) .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
        }
      }
    `,
  ];

  getReservedQueryParams(this: { [key in ReservedParam]?: number | string }) {
    const params = new URLSearchParams(window.location.search);

    const reservedParams: ReservedParam[] = [
      "_match",
      "_order_by",
      "_page",
      "_per_page",
      "q",
    ];
    reservedParams.forEach((reservedParam) => {
      const value = params.get(reservedParam);
      if (value) {
        this[reservedParam] = parseInt(value) || value;
      }
    });
  }

  getReservedQueryString(
    this: { [key in ReservedParam]?: number | string },
    useParams: ReservedParam[] = [
      "_match",
      "_order_by",
      "_page",
      "_per_page",
      "q",
    ]
  ) {
    const params = new URLSearchParams();

    useParams.forEach((usedParam) => {
      const value = this[usedParam];
      if (value) {
        params.set(usedParam, value.toString());
      }
    });

    return params.toString();
  }

  updateUrlWithReservedParams(reservedParams: {
    [key in ReservedParam]?: string | number;
  }) {
    const url = new URL(window.location.href);
    Object.entries(reservedParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value.toString());
      }
    });
    history.pushState(null, "", url.toString());
  }

  override connectedCallback() {
    super.connectedCallback();

    this.getReservedQueryParams();

    if (window.innerWidth < 768) {
      this.handleHide({ detail: true } as CustomEvent);
    }

    const reservedQueryString = this.getReservedQueryString();
    const response = async () =>
      await fetch(
        `/api/v1/contrib/eventmanagement/public/events${
          reservedQueryString ? `?${reservedQueryString}` : ""
        }`
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
        this.updateUrlWithReservedParams({
          _match: this._match,
          _order_by: this._order_by,
          _page: this._page,
          _per_page: this._per_page,
          q: this.q,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleFilter(event: CustomEvent) {
    const query = event.detail;
    const response = async () =>
      await fetch(
        `/api/v1/contrib/eventmanagement/public/events?${new URLSearchParams(
          query
        )}`
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
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleHide(e: CustomEvent) {
    const shouldHide = e.detail;
    this.hasHiddenFacets = shouldHide;
  }

  handleShowDetails({ lmsEvent }: { lmsEvent: LMSEvent }) {
    this.modalData = lmsEvent;
    this.hasOpenModal = true;
  }

  handleHideDetails() {
    this.modalData = {} as LMSEvent;
    this.hasOpenModal = false;
  }

  override render() {
    return html`
      <div class="container-fluid px-0">
        <div class="row">
          <div class="col-12" ?hidden=${this.events.length > 0}>
            <div class="alert alert-info" role="alert">
              ${__("There are no events to display")}!
            </div>
          </div>
          <div
            class="${classMap({
              "col-xl-3": !this.hasHiddenFacets,
              "col-xl-1": this.hasHiddenFacets,
              "col-lg-4": !this.hasHiddenFacets,
              "col-lg-2": this.hasHiddenFacets,
              "col-md-5": !this.hasHiddenFacets,
              "col-md-2": this.hasHiddenFacets,
            })} col-12"
            ?hidden=${!this.events.length}
          >
            <lms-events-filter
              @hide=${this.handleHide}
              @filter=${this.handleFilter}
              .events=${this.events}
              .isHidden=${this.hasHiddenFacets}
            ></lms-events-filter>
          </div>
          <div
            class="${classMap({
              "col-xl-9": !this.hasHiddenFacets,
              "col-xl-11": this.hasHiddenFacets,
              "col-lg-8": !this.hasHiddenFacets,
              "col-lg-10": this.hasHiddenFacets,
              "col-md-7": !this.hasHiddenFacets,
              "col-md-10": this.hasHiddenFacets,
            })} col-12"
            ?hidden=${!this.events.length}
          >
            <div class="card-deck">
              ${map(
                this.events,
                (event) => html`
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
                    .image=${{ src: event.image, alt: event.name }}
                  ></lms-card>
                `
              ) ?? nothing}
              <lms-card-details-modal
                @close=${this.handleHideDetails}
                .event=${this.modalData}
                .isOpen=${this.hasOpenModal}
              ></lms-card-details-modal>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
