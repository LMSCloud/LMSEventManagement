import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import LMSEventTypesModal from "../extensions/LMSEventTypesModal";
import LMSEventTypesTable from "../extensions/LMSEventTypesTable";
import { Column, URIComponents } from "../sharedDeclarations";
import { __ } from "../lib/translate";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { skeletonStyles } from "../styles/skeleton";

declare global {
  interface HTMLElementTagNameMap {
    "lms-event-types-table": LMSEventTypesTable;
    "lms-event-types-modal": LMSEventTypesModal;
  }
}

@customElement("lms-staff-event-types-view")
export default class StaffEventTypesView extends LitElement {
  @state() hasLoaded = false;
  private isEmpty = false;
  private event_types: Column[] = [];
  private target_groups: Column[] = [];
  private locations: Column[] = [];
  @property({ type: Object, attribute: false }) href: URIComponents = {
    path: "/cgi-bin/koha/plugins/run.pl",
    query: true,
    params: {
      class: "Koha::Plugin::Com::LMSCloud::EventManagement",
      method: "configure",
    },
  };

  static override styles = [bootstrapStyles, skeletonStyles];

  async fetchUpdate() {
    const response = await fetch("/api/v1/contrib/eventmanagement/event_types");
    this.event_types = await response.json();
  }

  override connectedCallback() {
    super.connectedCallback();
    Promise.all([
      fetch("/api/v1/contrib/eventmanagement/target_groups"),
      fetch("/api/v1/contrib/eventmanagement/locations"),
      fetch("/api/v1/contrib/eventmanagement/event_types"),
    ])
      .then((results) => Promise.all(results.map((result) => result.json())))
      .then(([target_groups, locations, event_types]) => {
        this.target_groups = target_groups;
        this.locations = locations;
        this.event_types = event_types;
      })
      .then(() => {
        this.isEmpty = !this.hasData();
        this.hasLoaded = true;
      });
  }

  hasData() {
    return [this.target_groups, this.locations, this.event_types].every(
      (data) => data.length > 0
    );
  }

  override render() {
    if (!this.hasLoaded) {
      return html` <div class="container-fluid mx-0">
        <div class="skeleton skeleton-table"></div>
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
        >&nbsp;${__("and a")}&nbsp;
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
        &nbsp;${__("first")}.
      </h1>`;
    }

    return html`
      <lms-event-types-table
        .target_groups=${this.target_groups}
        .locations=${this.locations}
        .event_types=${this.event_types}
        @updated=${this.fetchUpdate}
        @deleted=${this.fetchUpdate}
      ></lms-event-types-table>
      <lms-event-types-modal
        @created=${this.fetchUpdate}
      ></lms-event-types-modal>
    `;
  }
}
