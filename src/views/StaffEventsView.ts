import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import LMSStaffEventCardsDeck from "../components/LMSStaffEventCard/LMSStaffEventCardDeck";
import LMSEventsModal from "../extensions/LMSEventsModal";
import { QueryBuilder } from "../lib/QueryBuilder";
import { __ } from "../lib/translate";
import { cardDeckStylesStaff } from "../styles/cardDeck";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import { Column, URIComponents } from "../types/common";

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

    private images: Column[] = [];

    private queryBuilder = new QueryBuilder();

    private filters: NodeListOf<HTMLInputElement> | undefined = undefined;

    private href: URIComponents = {
        path: "/cgi-bin/koha/plugins/run.pl",
        query: true,
        params: {
            class: "Koha::Plugin::Com::LMSCloud::EventManagement",
            method: "configure",
        },
    };

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        cardDeckStylesStaff,
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
        this.queryBuilder.query = window.location.search;
        this.queryBuilder.staticParams = ["class", "method", "op"];
        this.queryBuilder.areRepeatable = [
            "event_type",
            "target_group",
            "location",
        ];
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
            fetch("/api/v1/contrib/eventmanagement/images"),
        ])
            .then((results) =>
                Promise.all(results.map((result) => result.json()))
            )
            .then(([events, event_types, target_groups, locations, images]) => {
                this.event_types = event_types;
                this.target_groups = target_groups;
                this.locations = locations;
                this.images = images;
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

    private hasRequiredDataToAdd() {
        return [this.event_types, this.target_groups, this.locations].every(
            (data) => data.length > 0
        );
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

    private getParamsFromActiveFilters(filters: NodeListOf<HTMLInputElement>) {
        const checkboxesArr = Array.from(filters);
        return checkboxesArr
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => ({ [checkbox.name]: checkbox.value }))
            .reduce((acc: string, filter: Record<string, unknown>, index) => {
                const [entries] = Object.entries(filter);
                const [param, value] = entries;
                acc += `${param}=${value}${
                    index < checkboxesArr.length - 1 ? "&" : ""
                }`;
                return acc;
            }, "");
    }

    private handleFilter(e: CustomEvent) {
        const { filters } = e.detail;
        this.filters = filters;
        const activeFilters = this.getParamsFromActiveFilters(filters);
        this.queryBuilder.updateQuery(activeFilters);
        this.fetchUpdate();
    }

    private handleSearch(e: CustomEvent) {
        const { q } = e.detail;
        if (this.filters) {
            const activeFilters = this.getParamsFromActiveFilters(this.filters);
            this.queryBuilder.updateQuery(`${activeFilters}&q=${q}`);
        } else {
            this.queryBuilder.updateQuery(`q=${q}`);
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
            return html` <div class="mx-8">
                <div class="card-deck">
                    ${map(
                        [...Array(10)],
                        () => html`<div class="skeleton skeleton-card"></div>`
                    )}
                </div>
            </div>`;
        }

        if (this.hasLoaded && this.isEmpty) {
            return this.hasRequiredDataToAdd()
                ? html` <h1 class="text-center">
                          ${__(
                              "You can add a new event by clicking on the + button below"
                          )}.
                      </h1>
                      <lms-events-modal
                          @created=${this.fetchUpdate}
                      ></lms-events-modal>`
                : html`
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
                  `;
        }

        return html`
            <lms-staff-event-card-deck
                .events=${this.events}
                .event_types=${this.event_types}
                .target_groups=${this.target_groups}
                .locations=${this.locations}
                .images=${this.images}
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
