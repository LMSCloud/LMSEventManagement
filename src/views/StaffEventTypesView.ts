import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import LMSEventTypesModal from "../extensions/LMSEventTypesModal";
import LMSEventTypesTable from "../extensions/LMSEventTypesTable";
import { __ } from "../lib/translate";
import { Column, URIComponents } from "../types/common";

import { QueryBuilder } from "../lib/QueryBuilder";
import { requestHandler } from "../lib/RequestHandler";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";

declare global {
    interface HTMLElementTagNameMap {
        "lms-event-types-table": LMSEventTypesTable;
        "lms-event-types-modal": LMSEventTypesModal;
    }
}

@customElement("lms-staff-event-types-view")
export default class StaffEventTypesView extends LitElement {
    @property({ type: Object, attribute: false }) href: URIComponents = {
        path: "/cgi-bin/koha/plugins/run.pl",
        query: true,
        params: {
            class: "Koha::Plugin::Com::LMSCloud::EventManagement",
            method: "configure",
        },
    };

    @state() hasLoaded = false;

    @state() nextPage: Column[] = [];

    private _page = 1;

    private _per_page = 10;

    private isEmpty = false;

    private hasNoResults = false;

    private event_types: Column[] = [];

    private target_groups: Column[] = [];

    private locations: Column[] = [];

    private images: Column[] = [];

    private queryBuilder = new QueryBuilder();

    static override styles = [tailwindStyles, skeletonStyles];

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
            requestHandler.get("targetGroups"),
            requestHandler.get("locations"),
            requestHandler.get("images"),
            requestHandler.get(
                "eventTypes",
                this.queryBuilder.query.toString()
            ),
        ])
            .then((results) =>
                Promise.all(results.map((result) => result.json()))
            )
            .then(([target_groups, locations, images, event_types]) => {
                this.target_groups = target_groups;
                this.locations = locations;
                this.images = images;
                this.event_types = event_types;
            })
            .then(() => {
                this.queryBuilder.updateUrl();
                this.isEmpty = !this.hasData();
                this.hasLoaded = true;
            });
    }

    async fetchUpdate() {
        const response = await requestHandler.get(
            "eventTypes",
            this.queryBuilder.query.toString()
        );
        this.event_types = await response.json();
        const isEmptyOrNoResults = this.event_types.length === 0;
        this.isEmpty = isEmptyOrNoResults;
        this.hasNoResults = isEmptyOrNoResults;
        this.queryBuilder.updateUrl();
        this.requestUpdate();
    }

    async prefetchUpdate(e: CustomEvent) {
        const { _page, _per_page } = e.detail;
        this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
        const response = await requestHandler.get(
            "eventTypes",
            this.queryBuilder.query.toString()
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
        console.log(e.detail);
    }

    private handlePageChange(e: CustomEvent) {
        const { _page, _per_page } = e.detail;
        this._page = _page;
        this._per_page = _per_page;
        this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
        this.fetchUpdate();
    }

    private hasData() {
        return [this.target_groups, this.locations, this.event_types].every(
            (data) => data.length > 0
        );
    }

    private hasRequiredDataToAdd() {
        return [this.target_groups, this.locations].every(
            (data) => data.length > 0
        );
    }

    override render() {
        if (!this.hasLoaded) {
            return html` <div class="mx-8">
                <div class="skeleton skeleton-table"></div>
            </div>`;
        }

        if (this.hasLoaded && this.isEmpty) {
            return this.hasRequiredDataToAdd()
                ? html` <h1 class="text-center">
                          ${__(
                              "You can add a new event type by clicking the + button below"
                          )}.
                      </h1>
                      <lms-event-types-modal
                          .target_groups=${this.target_groups}
                          .locations=${this.locations}
                          .images=${this.images}
                          @created=${this.fetchUpdate}
                      ></lms-event-types-modal>`
                : html` <h1 class="text-center">
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
                .images=${this.images}
                .event_types=${this.event_types}
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
            ></lms-event-types-table>
            <lms-event-types-modal
                .target_groups=${this.target_groups}
                .locations=${this.locations}
                .images=${this.images}
                @created=${this.fetchUpdate}
            ></lms-event-types-modal>
        `;
    }
}
