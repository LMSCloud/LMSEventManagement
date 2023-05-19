import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import LMSTargetGroupsModal from "../extensions/LMSTargetGroupsModal";
import LMSTargetGroupsTable from "../extensions/LMSTargetGroupsTable";
import { Column } from "../sharedDeclarations";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { QueryBuilder } from "../lib/QueryBuilder";

declare global {
  interface HTMLElementTagNameMap {
    "lms-target-groups-table": LMSTargetGroupsTable;
    "lms-target-groups-modal": LMSTargetGroupsModal;
  }
}

@customElement("lms-staff-target-groups-view")
export default class StaffEventTypesView extends LitElement {
  @state() hasLoaded = false;

  @state() nextPage: Column[] = [];

  private _page = 1;

  private _per_page = 10;

  private isEmpty = false;

  private hasNoResults = false;

  private target_groups: Column[] = [];

  private queryBuilder = new QueryBuilder();

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
    const target_groups = fetch(
      `/api/v1/contrib/eventmanagement/target_groups?${this.queryBuilder.query.toString()}`
    );
    target_groups
      .then((response) => response.json())
      .then((result) => {
        this.target_groups = result;
      })
      .then(() => {
        this.queryBuilder.updateUrl();
        this.isEmpty = this.target_groups.length === 0;
        this.hasLoaded = true;
      });
  }

  async fetchUpdate() {
    const response = await fetch(
      `/api/v1/contrib/eventmanagement/target_groups?${this.queryBuilder.query.toString()}`
    );
    this.target_groups = await response.json();
    const noItems = this.target_groups.length === 0;
    this.isEmpty = noItems;
    this.hasNoResults = noItems;
    this.queryBuilder.updateUrl();
    this.requestUpdate();
  }

  async prefetchUpdate(e: CustomEvent) {
    const { _page, _per_page } = e.detail;
    this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
    const response = await fetch(
      `/api/v1/contrib/eventmanagement/target_groups?${this.queryBuilder.query.toString()}`
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

  override render() {
    if (!this.hasLoaded) {
      return html` <div class="container-fluid mx-0">
        <div class="skeleton skeleton-table"></div>
      </div>`;
    }

    if (this.hasLoaded && this.isEmpty) {
      return html` <h1 class="text-center">${__("No data to display")}.</h1>
        <lms-target-groups-modal @created=${this.fetchUpdate}></lms-target-groups-modal>`;
    }

    return html`
      <lms-target-groups-table
        .target_groups=${this.target_groups}
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
      ></lms-target-groups-table>
      <lms-target-groups-modal
        @created=${this.fetchUpdate}
      ></lms-target-groups-modal>
    `;
  }
}
