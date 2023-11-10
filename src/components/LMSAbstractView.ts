import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { provide } from "@lit/context";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import history from "history/browser";
import { CSSResult, LitElement, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { match } from "ts-pattern";
import { matchContext } from "../context/match-context";
import { nextPageContext } from "../context/next-page-context";
import { orderByContext } from "../context/order-by-context";
import { pageContext } from "../context/page-context";
import { perPageContext } from "../context/per-page-context";
import { previousPageContext } from "../context/previous-page-context";
import { qContext } from "../context/q-context";
import { searchContext } from "../context/search-context";
import { searchSyntax } from "../docs/searchSyntax";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { HashStore } from "../lib/URLStateHandler/HashStore";
import { QueryBuilder } from "../lib/URLStateHandler/QueryBuilder";
import { merge } from "../lib/URLStateHandler/URLStateHandler";

export interface DataSource {
    endpoint: string;
    id: string;
    main?: boolean;
    requiredForPartialContent?: boolean;
}

export interface Datum {
    [id: string]: Array<any>;
}

export interface UpdateParams {
    method: "push" | "replace";
    provideHash?: boolean;
}

export default abstract class LMSAbstractView extends LitElement {
    @state() state:
        | "initial"
        | "pending"
        | "success"
        | "partial-content"
        | "no-content"
        | "no-results"
        | "error" = "initial";

    @state() errors?: any;

    @state() abstract dataSources?: Record<string, DataSource>;

    protected data: Datum = {};

    @provide({ context: matchContext })
    @state()
    match?: "contains" | "exact" | "starts_with" | "ends_with";

    @provide({ context: orderByContext })
    @state()
    orderBy?: string;

    @provide({ context: pageContext })
    @state()
    page?: number;

    @provide({ context: perPageContext })
    @state()
    perPage?: number;

    @provide({ context: previousPageContext })
    @state()
    previousPage?: any[];

    @provide({ context: nextPageContext })
    @state()
    nextPage?: any[];

    @provide({ context: qContext })
    @state()
    q?: string;

    @provide({ context: searchContext })
    @state()
    search = "";

    abstract queryBuilder: QueryBuilder;

    protected hashStore = new HashStore(window.location.hash);

    protected boundHandlePopState = this.handlePopState.bind(this);

    static override styles: CSSResult | CSSResult[];

    // private mapStateToProviders() {}

    private handlePopState() {
        this.queryBuilder.query = window.location.search;
        this.orderBy = this.queryBuilder.getValue("_order_by") ?? "id";
        this.page = parseInt(this.queryBuilder.getValue("_page") ?? "1", 10);
        this.perPage = parseInt(
            this.queryBuilder.getValue("_per_page") ?? "10",
            10
        );
        this.q = this.queryBuilder.getValue("q") ?? "{}";

        this.hashStore.hash = this.hashNeeded(window.location.hash, this.q);

        this.fetchUpdate({ method: "replace" });
    }

    protected hashNeeded(searchString: string, q?: string) {
        return q !== "{}" ? searchString : "";
    }

    protected throw(response: Response) {
        throw response;
    }

    private hasMainDataSource() {
        if (!this.dataSources) {
            return false;
        }

        return Object.values(this.dataSources).some(
            (dataSource) => dataSource.main
        );
    }

    private getMainDataSource() {
        if (!this.hasMainDataSource()) {
            return;
        }

        return Object.values(this.dataSources!).find(
            (dataSource) => dataSource.main
        );
    }

    protected fetchUpdate({
        method = "push",
        provideHash = true,
    }: UpdateParams) {
        const mainDataSource = this.getMainDataSource();
        if (!mainDataSource) {
            return;
        }

        const { endpoint, id } = mainDataSource;
        requestHandler
            .get({
                endpoint,
                query: this.queryBuilder.without({ staticParams: true }),
            })
            .then((response) =>
                response.ok ? response.json() : this.throw(response)
            )
            .then((result) => {
                this.data[id] = result;
                if (!this.data[id]?.length) {
                    this.state = "no-results";
                } else {
                    this.state = "success";
                }

                history[method](
                    merge({
                        href: window.location.href,
                        searchParams: this.queryBuilder.query,
                        hash: this.hashStore.hash,
                    })
                );

                if (provideHash) {
                    this.search = this.hashStore.hash;
                }

                this.requestUpdate();
            })
            .catch((error) => {
                this.state = "error";
                error
                    .json()
                    .then((errors: any) => {
                        this.errors = errors;
                    })
                    .catch((error: Error) => {
                        console.error(error);
                    });
            });
    }

    protected prefetchUpdate(e: CustomEvent) {
        if (!this.dataSources || !this.data) {
            return;
        }

        const { direction, page } = e.detail;
        const query = this.queryBuilder.without({
            staticParams: true,
            useParams: this.queryBuilder.merge({
                _page: page,
            }),
        });

        const endpoint = this.getMainDataSource()?.endpoint;
        if (!endpoint) {
            return;
        }

        requestHandler
            .get({
                endpoint,
                query,
            })
            .then((response) => response.json())
            .then((result) =>
                match(direction)
                    .with("previous", () => {
                        this.previousPage = result;
                    })
                    .with("next", () => {
                        this.nextPage = result;
                    })
                    .otherwise(() => {})
            )
            .catch((error) => {
                console.error(error);
            });
    }

    protected handleSort(e: CustomEvent) {
        const { orderBy } = e.detail;
        this.queryBuilder.query = this.queryBuilder.merge({
            _order_by: orderBy,
        });
        this.fetchUpdate({ method: "push" });
    }

    protected handleSearch(e: CustomEvent) {
        const { q, search } = e.detail;
        this.queryBuilder.query = this.queryBuilder.merge({
            q,
        });
        this.hashStore.hash = this.hashNeeded(search, q);

        this.fetchUpdate({ method: "push", provideHash: false });
    }

    protected handlePageChange(e: CustomEvent) {
        const { page } = e.detail;
        this.page = page;
        this.queryBuilder.query = this.queryBuilder.merge({
            _page: page,
        });
        this.fetchUpdate({ method: "push" });
    }

    protected handlePerPageChange(e: CustomEvent) {
        const { perPage } = e.detail;
        this.perPage = perPage;
        this.queryBuilder.query = this.queryBuilder.merge({
            _per_page: perPage,
        });
        this.fetchUpdate({ method: "push" });
    }

    protected handleUpdated() {
        this.fetchUpdate({ method: "replace" });
    }

    protected handleDeleted() {
        this.fetchUpdate({ method: "replace" });
        this.prefetchUpdate(
            new CustomEvent("prefetch", {
                detail: {
                    page: this.page,
                    perPage: this.perPage,
                },
            })
        );
    }

    protected handleCreated() {
        this.fetchUpdate({ method: "replace" });
        this.prefetchUpdate(
            new CustomEvent("prefetch", {
                detail: {
                    page: this.page,
                    perPage: this.perPage,
                },
            })
        );
    }

    override connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener("popstate", this.boundHandlePopState);
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("popstate", this.boundHandlePopState);
    }

    private toggleDoc(e: PointerEvent) {
        const target = e.target as HTMLElement;
        const doc = target.parentElement?.nextElementSibling;
        if (!doc) {
            return;
        }

        doc.classList.toggle("hidden");
    }
    protected renderNoResultsAlertMaybe(state?: "no-results" | "success") {
        return state === "no-results"
            ? html`<div class="mx-4">
                  <div class="alert mb-4" role="alert">
                      ${litFontawesome(faInfo, {
                          className: "w-4 h-4 inline-block",
                      })}
                      <div>
                          <h4 class="font-bold">${__("No matches found")}.</h4>
                          <div class="text-xs">
                              ${__("Try refining your search.")}
                          </div>
                      </div>
                      <button
                          class="btn btn-accent btn-outline"
                          @click=${this.toggleDoc}
                      >
                          ${__("Help")}
                      </button>
                  </div>
                  <div class="card mb-4 hidden w-full bg-base-100 shadow-md">
                      <div class="prose card-body">${searchSyntax}</div>
                  </div>
              </div>`
            : nothing;
    }
}
