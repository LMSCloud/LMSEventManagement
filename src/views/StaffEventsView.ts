import history from "history/browser";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { match } from "ts-pattern";
import LMSAbstractView, { DataSource } from "../components/LMSAbstractView";
import LMSAnchor from "../components/LMSAnchor";
import LMSStaffEventCardsDeck from "../components/LMSStaffEventCard/LMSStaffEventCardDeck";
import LMSEventsModal from "../extensions/LMSEventsModal";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { QueryBuilder } from "../lib/URLStateHandler/QueryBuilder";
import { merge } from "../lib/URLStateHandler/URLStateHandler";
import { normalizeForInput } from "../lib/converters/datetimeConverters";
import { __ } from "../lib/translate";
import { cardDeckStylesStaff } from "../styles/cardDeck";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import { URIComponents } from "../types/common";

declare global {
    interface HTMLElementTagNameMap {
        "lms-anchor": LMSAnchor;
        "lms-events-modal": LMSEventsModal;
        "lms-staff-event-card-deck": LMSStaffEventCardsDeck;
    }
}

@customElement("lms-staff-events-view")
export default class StaffEventsView extends LMSAbstractView {
    public queryBuilder = new QueryBuilder({
        query: window.location.search,
        repeatableParams: ["event_type", "target_group", "location"],
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
        event_types: {
            endpoint: "eventTypes",
            id: "event_types",
            requiredForPartialContent: true,
        },
        images: {
            endpoint: "images",
            id: "images",
        },
        events: {
            endpoint: "events",
            id: "events",
            main: true,
        },
    };

    private start_time?: string;

    private filters?: NodeListOf<HTMLInputElement>;

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

    override connectedCallback() {
        super.connectedCallback();

        let [orderBy, page, perPage, q, start_time] =
            this.queryBuilder.getValues(
                "_order_by",
                "_page",
                "_per_page",
                "q",
                "start_time"
            );

        // const searchParams = new URLSearchParams(this.queryBuilder.query);
        // const targetGroups = searchParams.getAll("target_group");
        // const locations = searchParams.getAll("location");
        // const eventTypes = searchParams.getAll("event_type");

        this.orderBy = orderBy ?? "id";
        this.page = page ? parseInt(page, 10) : 1;
        this.perPage = perPage ? parseInt(perPage, 10) : 10;
        this.q = q ?? "{}";
        this.start_time =
            start_time ??
            normalizeForInput(new Date().toString(), "datetime-local");

        this.queryBuilder.query = this.queryBuilder.merge({
            _order_by: this.orderBy,
            _page: this.page,
            _per_page: this.perPage,
            q: this.q,
            start_time: this.start_time,
        });

        // if (targetGroups.length) {
        //     this.queryBuilder.query = this.queryBuilder.merge({
        //         target_group: targetGroups,
        //     });
        // }

        // if (locations.length) {
        //     this.queryBuilder.query = this.queryBuilder.merge({
        //         location: locations,
        //     });
        // }

        // if (eventTypes.length) {
        //     this.queryBuilder.query = this.queryBuilder.merge({
        //         event_type: eventTypes,
        //     });
        // }

        Promise.all([
            requestHandler.get({ endpoint: "targetGroups" }),
            requestHandler.get({ endpoint: "locations" }),
            requestHandler.get({ endpoint: "images" }),
            requestHandler.get({ endpoint: "eventTypes" }),
            requestHandler.get({
                endpoint: "events",
                query: this.queryBuilder.without({ staticParams: true }),
            }),
        ])
            .then((results) =>
                Promise.all(results.map((result) => result.json()))
            )
            .then(([target_groups, locations, images, event_types, events]) => {
                this.data["target_groups"] = target_groups;
                this.data["locations"] = locations;
                this.data["images"] = images;
                this.data["event_types"] = event_types;
                this.data["events"] = events;
                if (
                    this.data["target_groups"]?.length &&
                    this.data["locations"]?.length &&
                    this.data["event_types"]?.length &&
                    this.data["events"]?.length
                ) {
                    this.state = "success";
                } else if (
                    this.data["target_groups"]?.length &&
                    this.data["locations"]?.length &&
                    this.data["event_types"]?.length
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

                // this.setActiveFiltersFromParams();
            })
            .catch((error) => {
                this.state = "error";
                console.error(error);
            });
    }

    private getParamsFromActiveFilters(filters: NodeListOf<HTMLInputElement>) {
        const checkboxesArr = Array.from(filters);
        return checkboxesArr
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => [checkbox.name, checkbox.value]);
    }

    private setActiveFiltersFromParams() {
        const searchParams = new URLSearchParams(this.queryBuilder.query);
        this.filters?.forEach((filter) => {
            filter.checked = Boolean(searchParams.get(filter.name));
        });
    }

    private handleFilter(e: CustomEvent) {
        const { filters } = e.detail;
        this.filters = filters;
        this.queryBuilder.query = this.queryBuilder.merge(
            this.getParamsFromActiveFilters(filters)
        );
        this.fetchUpdate({ method: "push", provideHash: false });
    }

    override handleSearch(e: CustomEvent) {
        const { q } = e.detail;
        if (this.filters?.length) {
            this.queryBuilder.query = this.queryBuilder.merge([
                ...this.getParamsFromActiveFilters(this.filters),
                ["q", q],
            ]);
        } else {
            this.queryBuilder.query = this.queryBuilder.merge({
                q,
            });
        }
        this.fetchUpdate({ method: "push", provideHash: false });
    }

    private handleStartTimeChange(e: CustomEvent) {
        const { start_time } = e.detail;
        this.start_time = start_time;
        this.queryBuilder.query = this.queryBuilder.merge({
            start_time,
        });
        this.fetchUpdate({ method: "push" });
    }

    private handleReset() {
        this.queryBuilder.query = this.queryBuilder.merge({
            _order_by: "id",
            _page: this.page,
            _per_page: this.perPage,
            q: "{}",
            start_time: normalizeForInput(
                new Date().toString(),
                "datetime-local"
            ),
        });
        this.setActiveFiltersFromParams();
        this.fetchUpdate({ method: "push" });
    }

    override render() {
        return match(this.state)
            .with(
                "initial",
                "pending",
                () =>
                    html` <div class="mx-4">
                        <div class="skeleton skeleton-floating-menu"></div>
                        <div class="card-deck">
                            ${map(
                                [...Array(10)],
                                () =>
                                    html`<div
                                        class="skeleton skeleton-card"
                                    ></div>`
                            )}
                        </div>
                    </div>`
            )
            .with(
                "no-content",
                () =>
                    html`
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
                    `
            )
            .with(
                "partial-content",
                () =>
                    html` <h1 class="text-center">
                            ${__(
                                "You can add a new event by clicking on the + button below"
                            )}.
                        </h1>
                        <lms-events-modal
                            .target_groups=${this.data["target_groups"] ?? []}
                            .locations=${this.data["locations"] ?? []}
                            .images=${this.data["images"] ?? []}
                            .event_types=${this.data["event_types"] ?? []}
                            @created=${this.handleCreated}
                        ></lms-events-modal>`
            )
            .with(
                "no-results",
                "success",
                (state) =>
                    html`
                        <lms-staff-event-card-deck
                            .target_groups=${this.data["target_groups"] ?? []}
                            .locations=${this.data["locations"] ?? []}
                            .images=${this.data["images"] ?? []}
                            .event_types=${this.data["event_types"] ?? []}
                            .events=${this.data["events"] ?? []}
                            .start_time=${this.start_time}
                            @updated=${this.handleUpdated}
                            @deleted=${this.handleDeleted}
                            @sort=${this.handleSort}
                            @search=${this.handleSearch}
                            @filter=${this.handleFilter}
                            @start-time-change=${this.handleStartTimeChange}
                            @page=${this.handlePageChange}
                            @per-page=${this.handlePerPageChange}
                            @prefetch=${this.prefetchUpdate}
                            @reset=${this.handleReset}
                        ></lms-staff-event-card-deck>
                        ${this.renderNoResultsAlertMaybe(state)}
                        <lms-events-modal
                            .target_groups=${this.data["target_groups"] ?? []}
                            .locations=${this.data["locations"] ?? []}
                            .images=${this.data["images"] ?? []}
                            .event_types=${this.data["event_types"] ?? []}
                            @created=${this.handleCreated}
                        ></lms-events-modal>
                    `
            )
            .with("error", () => html`<h1 class="text-center">Error</h1>`)
            .exhaustive();
    }
}
