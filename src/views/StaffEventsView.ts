import { __ } from "../lib/translate";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { Column, URIComponents } from "../sharedDeclarations";
import { customElement, state } from "lit/decorators.js";
import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import { skeletonStyles } from "../styles/skeleton";
import LMSEventsModal from "../extensions/LMSEventsModal";
import LMSStaffEventCardsDeck from "../components/LMSStaffEventCardDeck";

declare global {
  interface HTMLElementTagNameMap {
    "lms-staff-event-card-deck": LMSStaffEventCardsDeck;
    "lms-events-modal": LMSEventsModal;
  }
}

@customElement("lms-staff-events-view")
export default class StaffEventsView extends LitElement {
  @state() hasLoaded = false;
  private isEmpty = false;
  private events: Column[] = [];
  private event_types: Column[] = [];
  private target_groups: Column[] = [];
  private locations: Column[] = [];
  private href: URIComponents = {
    path: "/cgi-bin/koha/plugins/run.pl",
    query: true,
    params: {
      class: "Koha::Plugin::Com::LMSCloud::EventManagement",
      method: "configure",
    },
  };

  static override styles = [bootstrapStyles, skeletonStyles];

  async fetchUpdate() {
    const response = await fetch("/api/v1/contrib/eventmanagement/events");
    this.events = await response.json();
    this.requestUpdate();
  }

  override connectedCallback() {
    super.connectedCallback();

    Promise.all([
      fetch("/api/v1/contrib/eventmanagement/events"),
      fetch("/api/v1/contrib/eventmanagement/event_types"),
      fetch("/api/v1/contrib/eventmanagement/target_groups"),
      fetch("/api/v1/contrib/eventmanagement/locations"),
    ])
      .then((results) => Promise.all(results.map((result) => result.json())))
      .then(([events, event_types, target_groups, locations]) => {
        this.event_types = event_types;
        this.target_groups = target_groups;
        this.locations = locations;
        this.events = events;
      })
      .then(() => {
        this.isEmpty = !this.hasData();
        this.hasLoaded = true;
      });
  }

  hasData() {
    return [
      this.events,
      this.event_types,
      this.target_groups,
      this.locations,
    ].every((data) => data.length > 0);
  }

  override render() {
    if (!this.hasLoaded) {
      return html` <div class="d-flex justify-content-around flex-wrap">
        ${map(
          [...Array(10)],
          () => html`<div class="skeleton skeleton-card"></div>`
        )}
      </div>`;
    }

    if (this.hasLoaded && this.isEmpty) {
      return html` <h1 class="text-center">
        ${__("You have to create a")}&nbsp;
        <lms-anchor
          .href=${{
            ...this.href,
            params: {
              ...this.href.params,
              op: "target-groups",
            },
          }}
          >${__("target group")}</lms-anchor
        >, ${__("a")}&nbsp;
        <lms-anchor
          .href=${{
            ...this.href,
            params: {
              ...this.href.params,
              op: "locations",
            },
          }}
          >${__("location")}</lms-anchor
        >
        &nbsp;${__("and an")}&nbsp;
        <lms-anchor
          .href=${{
            ...this.href,
            params: {
              ...this.href.params,
              op: "event-types",
            },
          }}
          >${__("event type")}</lms-anchor
        >
        &nbsp;${__("first")}.
      </h1>`;
    }

    return html`
      <lms-staff-event-card-deck
        .events=${this.events}
        .event_types=${this.event_types}
        .target_groups=${this.target_groups}
        .locations=${this.locations}
        @updated=${this.fetchUpdate}
        @deleted=${this.fetchUpdate}
      ></lms-staff-event-card-deck>
      <lms-events-modal @created=${this.fetchUpdate}></lms-events-modal>
    `;
  }
}
