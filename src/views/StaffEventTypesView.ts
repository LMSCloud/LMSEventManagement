import history from "history/browser";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { match } from "ts-pattern";
import LMSAbstractView, { DataSource } from "../components/LMSAbstractView";
import LMSAnchor from "../components/LMSAnchor";
import LMSEventTypesModal from "../extensions/LMSEventTypesModal";
import LMSEventTypesTable from "../extensions/LMSEventTypesTable";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { QueryBuilder } from "../lib/URLStateHandler/QueryBuilder";
import { merge } from "../lib/URLStateHandler/URLStateHandler";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import { URIComponents } from "../types/common";

declare global {
    interface HTMLElementTagNameMap {
        "lms-anchor": LMSAnchor;
        "lms-event-types-table": LMSEventTypesTable;
        "lms-event-types-modal": LMSEventTypesModal;
    }
}

@customElement("lms-staff-event-types-view")
export default class StaffEventTypesView extends LMSAbstractView {
    public queryBuilder = new QueryBuilder({
        query: window.location.search,
        staticParams: ["class", "method", "op"],
    });

    public override dataSources?: Record<string, DataSource> = {
        target_groups: {
            endpoint: "targetGroups",
            id: "target_groups",
            requiredForPartialContent: true,
        },
        locations: {
            endpoint: "locations",
            id: "locations",
            requiredForPartialContent: true,
        },
        images: {
            endpoint: "images",
            id: "images",
        },
        event_types: {
            endpoint: "eventTypes",
            id: "event_types",
            main: true,
        },
    };

    private href: URIComponents = {
        path: "/cgi-bin/koha/plugins/run.pl",
        query: true,
        params: {
            class: "Koha::Plugin::Com::LMSCloud::EventManagement",
            method: "configure",
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

        Promise.all([
            requestHandler.get({ endpoint: "targetGroups" }),
            requestHandler.get({ endpoint: "locations", query: { _per_page: "-1" } }),
            requestHandler.get({ endpoint: "images" }),
            requestHandler.get({
                endpoint: "eventTypes",
                query: this.queryBuilder.without({ staticParams: true }),
            }),
        ])
            .then((results) =>
                Promise.all(results.map((result) => result.json()))
            )
            .then(([target_groups, locations, images, event_types]) => {
                this.data = {};
                this.data["target_groups"] = target_groups;
                this.data["locations"] = locations;
                this.data["images"] = images;
                this.data["event_types"] = event_types;
                if (
                    this.data["target_groups"]?.length &&
                    this.data["locations"]?.length &&
                    this.data["event_types"]?.length
                ) {
                    this.state = "success";
                } else if (
                    this.data["target_groups"]?.length &&
                    this.data["locations"]?.length
                ) {
                    this.state = "partial-content";
                } else {
                    this.state = "no-content";
                }

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
                console.error(error);
            });
    }

    override render() {
        return match(this.state)
            .with(
                "initial",
                "pending",
                () =>
                    html` <div class="mx-4">
                        <div class="skeleton skeleton-floating-menu"></div>
                        <div class="skeleton skeleton-table"></div>
                    </div>`
            )
            .with(
                "no-content",
                () =>
                    html` <h1 class="text-center">
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
                    </h1>`
            )
            .with(
                "partial-content",
                () =>
                    html` <h1 class="text-center">
                            ${__(
                                "You can add a new event type by clicking the + button below"
                            )}.
                        </h1>
                        <lms-event-types-modal
                            .target_groups=${this.data["target_groups"] ?? []}
                            .locations=${this.data["locations"] ?? []}
                            .images=${this.data["images"] ?? []}
                            @created=${this.handleCreated}
                        ></lms-event-types-modal>`
            )
            .with(
                "no-results",
                "success",
                (state) =>
                    html`
                        <lms-event-types-table
                            .target_groups=${this.data["target_groups"] ?? []}
                            .locations=${this.data["locations"] ?? []}
                            .images=${this.data["images"] ?? []}
                            .event_types=${this.data["event_types"] ?? []}
                            @updated=${this.handleUpdated}
                            @deleted=${this.handleDeleted}
                            @sort=${this.handleSort}
                            @search=${this.handleSearch}
                            @page=${this.handlePageChange}
                            @per-page=${this.handlePerPageChange}
                            @prefetch=${this.prefetchUpdate}
                        ></lms-event-types-table>
                        ${this.renderNoResultsAlertMaybe(state)}
                        <lms-event-types-modal
                            .target_groups=${this.data["target_groups"] ?? []}
                            .locations=${this.data["locations"] ?? []}
                            .images=${this.data["images"] ?? []}
                            @created=${this.handleCreated}
                        ></lms-event-types-modal>
                    `
            )
            .with("error", () => html`<h1 class="text-center">Error</h1>`)
            .exhaustive();
    }
}
