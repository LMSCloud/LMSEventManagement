import history from "history/browser";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { match } from "ts-pattern";
import LMSAbstractView, { DataSource } from "../components/LMSAbstractView";
import LMSOpenApiErrors from "../components/LMSOpenApiErrors";
import LMSLocationsModal from "../extensions/LMSLocationsModal";
import LMSLocationsTable from "../extensions/LMSLocationsTable";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { QueryBuilder } from "../lib/URLStateHandler/QueryBuilder";
import { merge } from "../lib/URLStateHandler/URLStateHandler";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import { Column } from "../types/common";

declare global {
    interface HTMLElementTagNameMap {
        "lms-open-api-errors": LMSOpenApiErrors;
        "lms-locations-table": LMSLocationsTable;
        "lms-locations-modal": LMSLocationsModal;
    }
}

@customElement("lms-staff-locations-view")
export default class StaffLocationsView extends LMSAbstractView {
    public queryBuilder = new QueryBuilder({
        query: window.location.search,
        staticParams: ["class", "method", "op"],
    });

    public override dataSources?: Record<string, DataSource> = {
        locations: {
            endpoint: "locations",
            id: "locations",
            main: true,
        },
    };

    static override styles = [tailwindStyles, skeletonStyles];

    override connectedCallback() {
        super.connectedCallback();

        let [orderBy, page, perPage, q] = this.queryBuilder.getValues(
            "_order_by",
            "_page",
            "_per_page",
            "q"
        );

        this.orderBy = orderBy ?? "id";
        this.page = page ? parseInt(page, 10) : 1;
        this.perPage = perPage ? parseInt(perPage, 10) : 10;
        this.q = q ?? "{}";

        this.queryBuilder.query = this.queryBuilder.merge({
            _order_by: this.orderBy,
            _page: this.page,
            _per_page: this.perPage,
            q: this.q,
        });

        requestHandler
            .get({
                endpoint: "locations",
                query: this.queryBuilder.without({ staticParams: true }),
            })
            .then((response) =>
                response.ok ? response.json() : this.throw(response)
            )
            .then((locations) => {
                this.data = {};
                this.data["locations"] = locations as Column[];
                this.state = !this.data["locations"].length
                    ? "no-content"
                    : "success";

                this.hashStore.hash = this.hashNeeded(
                    this.hashStore.hash,
                    this.q
                );
                history.replace(
                    merge({
                        href: window.location.href,
                        searchParams: this.queryBuilder.query,
                        hash: this.hashStore.hash,
                    })
                );
                this.search = this.hashStore.hash;
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

    override render() {
        return match(this.state)
            .with(
                "initial",
                "pending",
                () =>
                    html` <div class="mx-4">
                        <div class="skeleton-floating-menu skeleton"></div>
                        <div class="skeleton-table skeleton"></div>
                    </div>`
            )
            .with("partial-content", () => html`<h1>Unimplemented</h1>`)
            .with(
                "no-content",
                () =>
                    html` <h1 class="text-center">
                            ${__("No data to display")}.
                        </h1>
                        <lms-locations-modal
                            @created=${this.handleCreated}
                        ></lms-locations-modal>`
            )
            .with(
                "no-results",
                "success",
                (state) => html`
                    <lms-locations-table
                        .locations=${this.data["locations"] ?? []}
                        @updated=${this.handleUpdated}
                        @deleted=${this.handleDeleted}
                        @sort=${this.handleSort}
                        @search=${this.handleSearch}
                        @page=${this.handlePageChange}
                        @per-page=${this.handlePerPageChange}
                        @prefetch=${this.prefetchUpdate}
                    ></lms-locations-table>
                    ${this.renderNoResultsAlertMaybe(state)}
                    <lms-locations-modal
                        @created=${this.handleCreated}
                    ></lms-locations-modal>
                `
            )
            .with(
                "error",
                () => html`<lms-open-api-errors
                    .openApiErrors=${this.errors}
                ></lms-open-api-errors>`
            )
            .exhaustive();
    }
}
