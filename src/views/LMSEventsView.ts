import { LitElement, html, nothing, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import LMSCard from "../components/LMSCard";
import LMSEventsFilter from "../components/LMSEventsFilter";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LMSEvent } from "../sharedDeclarations";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";
import LMSCardDetailsModal from "../components/LMSCardDetailsModal";

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
  @property({ attribute: "has-hidden-facets", reflect: true }) hasHiddenFacets =
    false;
  @state() events: LMSEvent[] = [];
  @state() modalData: LMSEvent = {} as LMSEvent;
  @state() hasOpenModal = false;

  static override styles = [
    bootstrapStyles,
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

  override connectedCallback() {
    super.connectedCallback();

    if (window.innerWidth < 768) {
      console.log("window.innerWidth < 768");
      this.handleHide({ detail: true } as CustomEvent);
    }

    const response = async () =>
      await fetch("/api/v1/contrib/eventmanagement/public/events");

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

  handleFilter(event: CustomEvent) {
    const query = event.detail;
    console.log("query in ev: ", query);
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
              There are no events to display!
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
