import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import LMSStaffEventCardsDeck from "../components/LMSStaffEventCardDeck";
import LMSEventsModal from "../extensions/LMSEventsModal";
import { Column, URIComponents } from "../sharedDeclarations";
import { __ } from "../lib/translate";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { TranslationController } from "../lib/TranslationController";

declare global {
  interface HTMLElementTagNameMap {
    "lms-staff-event-card-deck": LMSStaffEventCardsDeck;
    "lms-events-modal": LMSEventsModal;
  }
}

@customElement("lms-staff-events-view")
export default class StaffEventsView extends LitElement {
  @state() events: Column[] = [];
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

  static override styles = [bootstrapStyles];

  override connectedCallback() {
    super.connectedCallback();

    TranslationController.getInstance().loadTranslations(() => {
      console.log("Translations loaded");
    });

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
        this.events = events; // Assigning events last to trigger a rerender
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
    if (!this.hasData()) {
      return html`
        <h1 class="text-center">
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
        </h1>
      </div>`;
    }

    return html`
      <lms-staff-event-card-deck
        .events=${this.events}
        .event_types=${this.event_types}
        .target_groups=${this.target_groups}
        .locations=${this.locations}
      ></lms-staff-event-card-deck>
      <lms-events-modal></lms-events-modal>
    `;
  }
}
