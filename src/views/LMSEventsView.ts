import { LitElement, html, nothing, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import LMSCard from "../components/LMSCard";
import LMSEventsFilter from "../components/LMSEventsFilter";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LMSEvent } from "../sharedDeclarations";
import { map } from "lit/directives/map.js";
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
  @state() events: LMSEvent[] = [];
  @state() modalData: LMSEvent = {} as LMSEvent;
  @state() hasOpenModal = false;
  @state() _match?: string;
  @state() _order_by?: string = "start_time";
  @state() _page: number = 1;
  @state() _per_page: number = 20;
  @state() q?: string;
  @state() additionalParams: URLSearchParams = new URLSearchParams();
  private hasLoaded = false;

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

  private getReservedQueryParams(this: {
    [key in ReservedParam]?: number | string;
  }) {
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

  private getReservedQueryString(
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

  private getAdditionalQueryParams(query = undefined) {
    const urlParams = new URLSearchParams(window.location.search);
    let queryParams = undefined;
    let queryKeys: string[] | undefined = undefined;
    if (query) {
      queryParams = new URLSearchParams(query);
      queryKeys = [...queryParams.keys()];
    }
    const additionalParams = new URLSearchParams();

    urlParams.forEach((value, key) => {
      if (!["_match", "_order_by", "_page", "_per_page", "q"].includes(key)) {
        additionalParams.set(key, value);
      }

      if (queryKeys && !queryKeys.includes(key)) {
        additionalParams.delete(key);
      }
    });

    if (queryParams) {
      queryParams.forEach((value, key) => {
        additionalParams.set(key, value);
      });
    }

    this.additionalParams = additionalParams;
  }

  private updateUrlWithReservedParams(reservedParams: {
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

  private updateUrlWithAdditionalParams(additionalParams: URLSearchParams) {
    const url = new URL(window.location.href);
    additionalParams.forEach((value, key) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
    history.pushState(null, "", url.toString());
  }

  private getFullQueryString() {
    const reservedQueryString = this.getReservedQueryString();
    const additionalQueryString = this.additionalParams.toString();

    const hasReservedQueryParams = Boolean(reservedQueryString);
    const hasAdditionalQueryParams = Boolean(additionalQueryString);
    if (!hasReservedQueryParams && !hasAdditionalQueryParams) {
      return "";
    }
    const reservedQueryParams = hasReservedQueryParams
      ? `?${reservedQueryString}`
      : "";
    const additionalQueryParams = hasAdditionalQueryParams
      ? `&${additionalQueryString}`
      : "";
    return `${reservedQueryParams}${additionalQueryParams}`;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.getReservedQueryParams();
    this.getAdditionalQueryParams();

    const response = async () =>
      await fetch(
        `/api/v1/contrib/eventmanagement/public/events${this.getFullQueryString()}`
      );

    response()
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Something went wrong");
      })
      .then((events: LMSEvent[]) => {
        this.hasLoaded = true;
        this.events = events;
        this.updateUrlWithReservedParams({
          _match: this._match,
          _order_by: this._order_by,
          _page: this._page,
          _per_page: this._per_page,
          q: this.q,
        });
        this.updateUrlWithAdditionalParams(this.additionalParams);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private handleQuery(event: CustomEvent) {
    const query = event.detail;

    this.getReservedQueryParams();
    this.getAdditionalQueryParams(query);

    const response = async () =>
      await fetch(
        `/api/v1/contrib/eventmanagement/public/events${this.getFullQueryString()}`
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
        this.updateUrlWithAdditionalParams(this.additionalParams);
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
            </lms-events-filter>
          </div>
        </div>
      </div>
    `;
  }
}
