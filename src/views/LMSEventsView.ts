import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import LMSCard from "../components/LMSCard";
import LMSEventsFilter from "../components/LMSEventsFilter";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LMSEvent } from "../sharedDeclarations";
import { map } from "lit/directives/map";

declare global {
  interface HTMLElementTagNameMap {
    "lms-card": LMSCard;
    "lms-events-filter": LMSEventsFilter;
  }
}

@customElement("lms-events-view")
export default class LMSEventsView extends LitElement {
  @property({ type: String }) borrowernumber = undefined;
  @state() events: LMSEvent[] = [];

  static override styles = [bootstrapStyles];

  override connectedCallback() {
    super.connectedCallback();

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

  handleFilter = (event: CustomEvent) => {
    const query = event.detail;
    console.log("query in ev: ", query);
    const response = async () =>
      await fetch(
        `/api/v1/contrib/eventmanagement/public/events?${new URLSearchParams(query)}`
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
  };

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
            class="col-lg-3 col-md-2 col-sm-12"
            ?hidden=${!this.events.length}
          >
            <lms-events-filter
              @filter=${this.handleFilter}
              .events=${this.events}
            ></lms-events-filter>
          </div>
          <div
            class="col-lg-9 col-md-10 col-sm-12"
            ?hidden=${!this.events.length}
          >
            <div class="card-deck">
              ${map(
                this.events,
                (event) => html`
                  <lms-card
                    .title=${event.name}
                    .text=${event.description}
                    .image=${{ src: event.image, alt: event.name }}
                  ></lms-card>
                `
              ) ?? nothing}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
