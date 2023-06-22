import {
    faAngleDoubleLeft,
    faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { attr__, __ } from "../lib/translate";
import { isDeepEqual } from "../lib/utilities";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import { Column } from "../types/common";
import LMSAnchor from "./LMSAnchor";

declare global {
    interface HTMLElementTagNameMap {
        "lms-anchor": LMSAnchor;
    }
}

@customElement("lms-pagination")
export default class LMSPagination extends LitElement {
    @property({ type: Array, attribute: "page-sizes" }) pageSizes = [
        10, 20, 50, 100,
    ];

    @property({ type: Boolean }) hasPrevious = false;

    @property({ type: Boolean }) hasNext: boolean | undefined = undefined;

    @property({ type: Array }) nextPage: Column[] | undefined = undefined;

    @property({ type: Number }) _page = 1;

    @property({ type: Number }) _per_page = 20;

    private url = new URL(window.location.href);

    static override styles = [tailwindStyles, skeletonStyles];

    override connectedCallback() {
        super.connectedCallback();
        this.getPaginationState();
        this.prefetchNextPage();
    }

    private prefetchNextPage() {
        this.dispatchEvent(
            new CustomEvent("prefetch", {
                detail: {
                    _page: this._page + 1,
                    _per_page: this._per_page,
                },
                bubbles: true,
                composed: true,
            })
        );
    }

    private getPaginationState() {
        const { searchParams } = this.url;

        const _page = searchParams.get("_page");
        const _per_page = searchParams.get("_per_page");

        if (_page && _page !== this._page.toString()) {
            this._page = parseInt(_page);
            this.hasPrevious = this._page > 1;
        }

        if (_per_page && _per_page !== this._per_page.toString()) {
            this._per_page = parseInt(_per_page);
        }
    }

    override updated(changedProperties: PropertyValues) {
        if (
            changedProperties.has("nextPage") &&
            this.nextPage !== undefined &&
            !isDeepEqual<Column[]>(
                changedProperties.get("nextPage"),
                this.nextPage
            )
        ) {
            this.hasNext =
                this.nextPage !== undefined && this.nextPage.length > 0;
            if (this.hasNext) {
                this.prefetchNextPage();
            }
        }

        if (
            changedProperties.has("_page") ||
            changedProperties.has("_per_page")
        ) {
            this.hasPrevious = this._page > 1;
            this.prefetchNextPage();
        }
    }

    private getLinkForPageSize(pageSize: number) {
        const urlCopy = new URL(this.url.href);
        urlCopy.searchParams.set("_per_page", pageSize.toString());
        return urlCopy.href;
    }

    private getLinkForPage(page: number, direction: "next" | "previous") {
        const urlCopy = new URL(this.url.href);
        if (direction === "next") {
            urlCopy.searchParams.set("_page", (page + 1).toString());
        }

        if (direction === "previous" && page > 1) {
            urlCopy.searchParams.set("_page", (page - 1).toString());
        }
        return urlCopy.href;
    }

    private handlePaginationChange(e: Event) {
        e.preventDefault();
        const target = e.target as HTMLAnchorElement;
        const anchor = target.closest("a");
        if (!anchor) return;

        const url = new URL(anchor.href);
        let _page: string | number | null = url.searchParams.get("_page");
        let _per_page: string | number | null =
            url.searchParams.get("_per_page");
        if (_page && _per_page) {
            _page = parseInt(_page, 10);
            _per_page = parseInt(_per_page, 10);
            this.dispatchEvent(
                new CustomEvent("page", {
                    detail: {
                        _page,
                        _per_page,
                    },
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }

    override render() {
        return html`
            <div class="join" aria-label=${attr__("Table navigation")}>
                <a
                    class="join-item btn"
                    ?disabled=${!this.hasPrevious}
                    href=${this.getLinkForPage(this._page, "previous")}
                    @click=${this.handlePaginationChange}
                    ><span class="hidden lg:inline"> ${__("Previous")} </span>
                    ${litFontawesome(faAngleDoubleLeft, {
                        className: "w-4 h-4 inline-block lg:hidden",
                    })}
                </a>
                ${map(
                    this.pageSizes,
                    (pageSize) => html`
                        <a
                            class="${classMap({
                                "bg-primary-focus": pageSize === this._per_page,
                            })} btn-square join-item btn"
                            href=${this.getLinkForPageSize(pageSize)}
                            @click=${this.handlePaginationChange}
                            >${pageSize}</a
                        >
                    `
                )}
                <a
                    class="join-item btn"
                    ?disabled=${!this.hasNext}
                    href=${this.getLinkForPage(this._page, "next")}
                    @click=${this.handlePaginationChange}
                    ><span class="hidden lg:inline"> ${__("Next")} </span>
                    ${litFontawesome(faAngleDoubleRight, {
                        className: "w-4 h-4 inline-block lg:hidden",
                    })}
                    <div
                        class="spinner-border spinner-border-sm ${classMap({
                            "d-none": this.hasNext !== undefined,
                        })} align-middle text-primary"
                        role="status"
                    >
                        <span class="sr-only">${__("Loading")}...</span>
                    </div>
                </a>
            </div>
        `;
    }
}
