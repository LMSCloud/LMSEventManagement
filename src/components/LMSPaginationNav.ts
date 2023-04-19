import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { __ } from "../lib/TranslationHandler";

@customElement("lms-pagination-nav")
export default class LMSPaginationNav extends LitElement {
  @property({ type: Array, attribute: "page-sizes" }) pageSizes = [
    10, 20, 50, 100,
  ];
  @property({ type: Boolean, attribute: "has-pages" }) hasPages = false;
  @property({ type: Boolean }) hasPrevious = false;
  @property({ type: Boolean }) hasNext = false;
  @state() _page = 1;
  @state() _per_page = 20;

  static override styles = [bootstrapStyles];

  override connectedCallback() {
    super.connectedCallback();

    const params = new URLSearchParams(window.location.search);
    const _page = params.get("page");
    const _per_page = params.get("pageSize");
    if (_page) {
      this._page = parseInt(_page);
    }
    if (_per_page) {
      this._per_page = parseInt(_per_page);
    }
  }

  getPaginatedHref(pageSize: number) {
    const { pathname, search, hash } = window.location;
    const params = new URLSearchParams(search);

    if (params) {
      const queryString = Array.from(params.entries())
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const paginationString = this.hasPages ? `&_page=${this._page}` : "";
      const pageSizeString = `&_per_page=${pageSize}`;

      const updatedQueryString = `${queryString}${paginationString}${pageSizeString}`;
      return `${pathname}?${updatedQueryString}${hash ? `#${hash}` : ""}`;
    }

    const paginationString = this.hasPages ? `_page=${this._page}&` : "";
    const pageSizeString = `_per_page=${pageSize}`;
    return `${pathname}?${paginationString}${pageSizeString}${
      hash ? `#${hash}` : ""
    }`;
  }

  override render() {
    return html` <nav aria-label="Page navigation">
      <ul class="pagination justify-content-end">
        <li
          class="page-item ${classMap({
            disabled: !this.hasPrevious,
          })}"
          ?hidden=${!this.hasPages}
        >
          <a class="page-link">${__("Previous")}</a>
        </li>
        ${map(
          this.pageSizes,
          (pageSize) => html`
            <li class="page-item">
              <a
                class="page-link ${classMap({
                  active: pageSize === this._per_page,
                })}"
                href=${this.getPaginatedHref(pageSize)}
                >${pageSize}</a
              >
            </li>
          `
        )}
        <li
          class="page-item
          ${classMap({
            disabled: !this.hasNext,
          })}"
          ?hidden=${!this.hasPages}
        >
          <a class="page-link" href="#">${__("Next")}</a>
        </li>
      </ul>
    </nav>`;
  }
}
