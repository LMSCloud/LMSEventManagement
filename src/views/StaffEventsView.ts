import { __ } from "../lib/translate";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { Column, URIComponents } from "../sharedDeclarations";
import { customElement, state } from "lit/decorators.js";
import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import { skeletonStyles } from "../styles/skeleton";
import LMSEventsModal from "../extensions/LMSEventsModal";
import LMSStaffEventCardsDeck from "../components/LMSStaffEventCard/LMSStaffEventCardDeck";
import { QueryBuilder } from "../lib/QueryBuilder";

declare global {
  interface HTMLElementTagNameMap {
    "lms-staff-event-card-deck": LMSStaffEventCardsDeck;
    "lms-events-modal": LMSEventsModal;
  }
}

@customElement("lms-staff-events-view")
export default class StaffEventsView extends LitElement {
  @state() hasLoaded = false;

  @state() nextPage: Column[] = [];

  private _page = 1;

  private _per_page = 10;

  private isEmpty = false;

  private hasNoResults = false;

  private events: Column[] = [];

  private event_types: Column[] = [];

  private target_groups: Column[] = [];

  private locations: Column[] = [];

  private queryBuilder = new QueryBuilder();

  private href: URIComponents = {
    path: "/cgi-bin/koha/plugins/run.pl",
    query: true,
    params: {
      class: "Koha::Plugin::Com::LMSCloud::EventManagement",
      method: "configure",
    },
  };

  static override styles = [bootstrapStyles, skeletonStyles];

  constructor() {
    super();
    this.queryBuilder.reservedParams = [
      "_match",
      "_order_by",
      "_page",
      "_per_page",
      "q",
    ];
    this.queryBuilder.query = window.location.search;
    this.queryBuilder.staticParams = ["class", "method", "op"];
    this.queryBuilder.updateQuery(
      `_order_by=id&_page=${this._page}&_per_page=${this._per_page}`
    );
  }

  override connectedCallback() {
    super.connectedCallback();

    Promise.all([
      fetch(
        `/api/v1/contrib/eventmanagement/events?${this.queryBuilder.query.toString()}`
      ),
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
        this.queryBuilder.updateUrl();
        this.isEmpty = !this.hasData();
        this.hasLoaded = true;
      });
  }

  private hasData() {
    return [
      this.events,
      this.event_types,
      this.target_groups,
      this.locations,
    ].every((data) => data.length > 0);
  }

  async fetchUpdate() {
    const response = await fetch(
      `/api/v1/contrib/eventmanagement/events?${this.queryBuilder.query.toString()}`
    );
    this.events = await response.json();
    this.hasNoResults = this.events.length === 0;
    this.queryBuilder.updateUrl();
    this.requestUpdate();
  }

  async prefetchUpdate(e: CustomEvent) {
    const { _page, _per_page } = e.detail;
    this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
    const response = await fetch(
      `/api/v1/contrib/eventmanagement/events?${this.queryBuilder.query.toString()}`
    );
    this.nextPage = await response.json();
    this.queryBuilder.updateQuery(
      `_page=${this._page}&_per_page=${this._per_page}`
    );
  }

  private handleSort(e: CustomEvent) {
    const { _order_by } = e.detail;
    this.queryBuilder.updateQuery(`_order_by=${_order_by}`);
    this.fetchUpdate();
  }

  private handleSearch(e: CustomEvent) {
    const { q } = e.detail;
    this.queryBuilder.updateQuery(`q=${q}`);
    this.fetchUpdate();
  }

  private handleFilter(e: CustomEvent) {
    console.log("detail", e.detail);
    const { detail } = e;
    const currentQ = this.queryBuilder.getParamValue("q");
    const [detailKey, detailValue] = Object.entries(detail)[0];

    if (currentQ) {
      let currentQObj = JSON.parse(currentQ);

      // Normalize currentQObj to always be an array for easier manipulation
      if (!Array.isArray(currentQObj)) {
        currentQObj = [currentQObj];
      }

      // Remove empty objects from currentQObj
      currentQObj = currentQObj.filter(
        (obj: Record<string, unknown>) => Object.keys(obj).length !== 0
      );

      // Check if the detail key/value pair exists in currentQObj
      const hasDetail = currentQObj.some(
        (obj: Record<string, unknown>) => obj[detailKey] === detailValue
      );

      if (hasDetail) {
        // If the detail exists, remove it
        const newQArr = currentQObj.filter(
          (obj: Record<string, unknown>) => !(obj[detailKey] === detailValue)
        );

        // If there's only one object left, we don't need to wrap it in an array
        const finalQValue = newQArr.length === 1 ? newQArr[0] : newQArr;
        this.queryBuilder.updateQuery(`q=${JSON.stringify(finalQValue)}`);
      } else {
        // If the detail doesn't exist, add it
        const newQArr = [...currentQObj, detail];
        this.queryBuilder.updateQuery(`q=${JSON.stringify(newQArr)}`);
      }
    } else {
      // If there's no current q parameter, just add the detail
      this.queryBuilder.updateQuery(`q=${JSON.stringify(detail)}`);
    }
    this.fetchUpdate();
  }

  private handlePageChange(e: CustomEvent) {
    const { _page, _per_page } = e.detail;
    this._page = _page;
    this._per_page = _per_page;
    this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
    this.fetchUpdate();
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
        ._page=${this._page}
        ._per_page=${this._per_page}
        .nextPage=${this.nextPage}
        .hasNoResults=${this.hasNoResults}
        @updated=${this.fetchUpdate}
        @deleted=${this.fetchUpdate}
        @sort=${this.handleSort}
        @search=${this.handleSearch}
        @filter=${this.handleFilter}
        @page=${this.handlePageChange}
        @prefetch=${this.prefetchUpdate}
      ></lms-staff-event-card-deck>
      <lms-events-modal @created=${this.fetchUpdate}></lms-events-modal>
    `;
  }
}
