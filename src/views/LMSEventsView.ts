import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import LMSCard from "../components/LMSCard";
import LMSEventsFilter from "../components/LMSEventsFilter";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LMSEvent } from "../interfaces";

declare global {
  interface HTMLElementTagNameMap {
    "lms-card": LMSCard;
    "lms-events-filter": LMSEventsFilter;
  }
}

@customElement("lms-events-view")
export default class LMSEventsView extends LitElement {
  @property({ type: String }) borrowernumber = undefined;
  @property({ type: Array, attribute: false }) events: LMSEvent[] = [];

  static override styles = [bootstrapStyles];

  private _getEvents() {
    fetch("/api/v1/contrib/eventmanagement/events")
      .then((response) => response.json())
      .then((events) => {
        this.events = events;
      });
  }

  override connectedCallback() {
    super.connectedCallback();
    this._getEvents();
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
            class="col-lg-3 col-md-2 col-sm-12"
            ?hidden=${!this.events.length}
          >
            <lms-events-filter></lms-events-filter>
          </div>
          <div
            class="col-lg-9 col-md-10 col-sm-12"
            ?hidden=${!this.events.length}
          >
            <div class="card-deck">
              ${this.events?.map(
                (event) => html`
                  <lms-card
                    .title=${event.name}
                    .text=${event.notes}
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
