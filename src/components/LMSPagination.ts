import {
    faAngleDoubleLeft,
    faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import { consume } from "@lit/context";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, PropertyValueMap, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";
import { P, match } from "ts-pattern";
import { nextPageContext } from "../context/next-page-context";
import { pageContext } from "../context/page-context";
import { perPageContext } from "../context/per-page-context";
import { previousPageContext } from "../context/previous-page-context";
import { __, attr__ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-pagination")
export default class LMSPagination extends LitElement {
    @property({ type: Array, attribute: "page-sizes" }) pageSizes = [
        10, 20, 50, 100,
    ];

    @consume({ context: pageContext, subscribe: true })
    @property({ type: Number })
    page?: number;

    @consume({ context: perPageContext, subscribe: true })
    @property({ type: Number, attribute: "per-page" })
    perPage?: number;

    @consume({ context: previousPageContext, subscribe: true })
    @state()
    previousPage?: any;

    @consume({ context: nextPageContext, subscribe: true })
    @state()
    nextPage?: any;

    @query("#previous-page-anchor") previousPageAnchor!: HTMLAnchorElement;

    @query("#next-page-anchor") nextPageAnchor!: HTMLAnchorElement;

    static override styles = [tailwindStyles, skeletonStyles];

    private prefetchPage(direction: "previous" | "next", page?: number) {
        if (!page || (direction === "previous" && page === 1)) {
            this.previousPage = undefined;
            return;
        }

        this.dispatchEvent(
            new CustomEvent("prefetch", {
                detail: match(direction)
                    .with("previous", () => ({ direction, page: page - 1 }))
                    .with("next", () => ({ direction, page: page + 1 }))
                    .exhaustive(),
                bubbles: true,
                composed: true,
            })
        );
    }

    protected override updated(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        if (
            _changedProperties.has("page") ||
            _changedProperties.has("perPage")
        ) {
            this.previousPageAnchor.classList.add("btn-disabled");
            this.nextPageAnchor.classList.add("btn-disabled");
            this.prefetchPage("previous", this.page);
            this.prefetchPage("next", this.page);
        }

        if (_changedProperties.has("previousPage")) {
            this.previousPageAnchor.classList[
                this.shouldBeDisabled(this.previousPage) ? "add" : "remove"
            ]("btn-disabled");
        }

        if (_changedProperties.has("nextPage")) {
            this.nextPageAnchor.classList[
                this.shouldBeDisabled(this.nextPage) ? "add" : "remove"
            ]("btn-disabled");
        }
    }

    private getLinkForPageSize(pageSize?: number) {
        if (!pageSize) {
            return;
        }

        const urlCopy = new URL(window.location.href);
        urlCopy.searchParams.set("_per_page", pageSize.toString());
        return urlCopy.href;
    }

    private getLinkForPage(direction: "next" | "previous", page?: number) {
        if (!page || (direction === "previous" && page === 1)) {
            return;
        }

        const urlCopy = new URL(window.location.href);
        return match(direction)
            .with("previous", () => {
                if (page > 1) {
                    urlCopy.searchParams.set("_page", (page - 1).toString());
                    return urlCopy.href;
                }

                return;
            })
            .with("next", () => {
                urlCopy.searchParams.set("_page", (page + 1).toString());
                return urlCopy.href;
            })
            .exhaustive();
    }

    private handlePageChange(e: Event) {
        if (!this.page) {
            return;
        }

        e.preventDefault();
        const target = e.target as HTMLAnchorElement;
        const anchor = target.closest("a");
        if (!anchor?.href) {
            return;
        }

        const url = new URL(anchor.href);
        let page: string | number | null = url.searchParams.get("_page");
        if (page) {
            page = parseInt(page, 10);
            this.dispatchEvent(
                new CustomEvent("page", {
                    detail: {
                        page,
                    },
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }

    private handlePerPageChange(e: Event) {
        if (!this.perPage) {
            return;
        }

        e.preventDefault();
        const target = e.target as HTMLAnchorElement;
        const anchor = target.closest("a");
        if (!anchor) {
            return;
        }

        const url = new URL(anchor.href);
        let perPage: string | number | null = url.searchParams.get("_per_page");
        if (perPage) {
            perPage = parseInt(perPage, 10);
            this.dispatchEvent(
                new CustomEvent("per-page", {
                    detail: {
                        perPage,
                    },
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }

    private shouldBeDisabled(any: any) {
        return match(any)
            .with(P.nullish, () => true)
            .with(P.instanceOf(Array), (a) => !a.length)
            .with(P.instanceOf(Object), () => false)
            .otherwise(() => true);
    }

    override render() {
        return html`
            <div class="join" aria-label=${attr__("Table navigation")}>
                <a
                    id="previous-page-anchor"
                    class="btn btn-disabled join-item"
                    href=${ifDefined(
                        this.getLinkForPage("previous", this.page)
                    )}
                    @click=${this.handlePageChange}
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
                                "bg-primary-focus": pageSize === this.perPage,
                            })} btn btn-square join-item"
                            href=${ifDefined(this.getLinkForPageSize(pageSize))}
                            @click=${this.handlePerPageChange}
                            >${pageSize}</a
                        >
                    `
                )}
                <a
                    id="next-page-anchor"
                    class="btn btn-disabled join-item"
                    href=${ifDefined(this.getLinkForPage("next", this.page))}
                    @click=${this.handlePageChange}
                    ><span class="hidden lg:inline"> ${__("Next")} </span>
                    ${litFontawesome(faAngleDoubleRight, {
                        className: "w-4 h-4 inline-block lg:hidden",
                    })}
                </a>
            </div>
        `;
    }
}
