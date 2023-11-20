import {
    faCalendarAlt,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import history from "history/browser";
import { LitElement, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { repeat } from "lit/directives/repeat.js";
import { match } from "ts-pattern";
import LMSCard from "../components/LMSCard";
import LMSCardDetailsModal from "../components/custom/LMSCardDetailsModal";
import LMSEventsFilter from "../components/custom/LMSEventsFilter";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { QueryBuilder } from "../lib/URLStateHandler/QueryBuilder";
import { merge } from "../lib/URLStateHandler/URLStateHandler";
import { splitDateTime } from "../lib/converters/datetimeConverters";
import { __, locale } from "../lib/translate";
import { cardDeckStylesOpac } from "../styles/cardDeck";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import { LMSEvent, LMSLocation } from "../types/common";

declare global {
    interface HTMLElementTagNameMap {
        "lms-card": LMSCard;
        "lms-events-filter": LMSEventsFilter;
        "lms-card-details-modal": LMSCardDetailsModal;
    }
}

@customElement("lms-events-view")
export default class LMSEventsView extends LitElement {
    @property({ type: String }) borrowernumber?: string;

    @state() state: "initial" | "pending" | "success" | "no-results" | "error" =
        "initial";

    @state() events?: Array<LMSEvent>;

    @state() events_count?: number;

    @state() locations?: Array<LMSLocation>;

    @state() modalData?: LMSEvent;

    @state() hasOpenModal = false;

    @query(".load-more") loadMore!: HTMLButtonElement;

    private queryBuilder = new QueryBuilder({
        query: window.location.search,
        optionalParams: ["min_age", "max_age", "start_time", "end_time", "fee"],
        repeatableParams: ["event_type", "target_group", "location"],
        staticParams: ["class", "method", "op"],
    });

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        cardDeckStylesOpac,
    ];

    override connectedCallback(): void {
        super.connectedCallback();

        //TODO: clean this up
        let [orderBy, page, perPage, q, openRegistration] =
            this.queryBuilder.getValues(
                "_order_by",
                "_page",
                "_per_page",
                "q",
                "open_registration"
            );

        orderBy ??= "start_time";
        page ??= "1";
        perPage ??= "20";
        q ??= "{}";
        openRegistration ??= "true";

        this.queryBuilder.query = this.queryBuilder.merge({
            _order_by: "start_time",
            _page: page,
            _per_page: perPage,
            q,
            open_registration: openRegistration,
        });

        Promise.all([
            requestHandler.get({
                endpoint: "eventsPublic",
                query: this.queryBuilder.without({ staticParams: true }),
            }),
            requestHandler.get({ endpoint: "locationsPublic" }),
        ])
            .then(([eventsResponse, locationsResponse]) =>
                Promise.all([
                    eventsResponse.json(),
                    this.composeTotalCountPromise(eventsResponse),
                    locationsResponse.json(),
                ])
            )
            .then(([events, events_count, locations]) => {
                this.events = events;
                this.events_count = events_count;
                this.locations = locations;
                if (
                    this.events?.length &&
                    this.events_count &&
                    this.locations?.length
                ) {
                    this.state = "success";
                } else {
                    this.state = "no-results";
                }

                history.replace(
                    merge({
                        href: window.location.href,
                        searchParams: this.queryBuilder.query,
                    })
                );
            })
            .catch((error) => {
                this.state = "error";
                console.error(error);
            });
    }

    private composeTotalCountPromise(response: Response) {
        return new Promise<number>((resolve) =>
            resolve(parseInt(response.headers.get("X-Total-Count")!, 10))
        );
    }

    private handleFilter(e: CustomEvent) {
        const { filters } = e.detail;

        this.queryBuilder.query = this.queryBuilder.merge(filters);

        requestHandler
            .get({
                endpoint: "eventsPublic",
                query: this.queryBuilder.without({ staticParams: true }),
            })
            .then((response) =>
                Promise.all([
                    response.json(),
                    this.composeTotalCountPromise(response),
                ])
            )
            .then(([events, events_count]) => {
                history.replace(
                    merge({
                        href: window.location.href,
                        searchParams: this.queryBuilder.query,
                    })
                );
                this.events = events;
                this.events_count = events_count;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    private handleSearch(e: CustomEvent) {
        const { filters, q } = e.detail;

        this.queryBuilder.query = this.queryBuilder.merge(
            filters.concat([["q", q]])
        );

        requestHandler
            .get({
                endpoint: "eventsPublic",
                query: this.queryBuilder.without({ staticParams: true }),
            })
            .then((response) =>
                Promise.all([
                    response.json(),
                    this.composeTotalCountPromise(response),
                ])
            )
            .then(([events, events_count]) => {
                history.replace(
                    merge({
                        href: window.location.href,
                        searchParams: this.queryBuilder.query,
                    })
                );
                this.events = events;
                this.events_count = events_count;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    private handleShowDetails({ lmsEvent }: { lmsEvent: LMSEvent }) {
        this.modalData = { ...lmsEvent };
        this.hasOpenModal = true;
    }

    private handleHideDetails() {
        this.modalData = undefined;
        this.hasOpenModal = false;
    }

    private handleLoadMore() {
        const currentSize = this.queryBuilder.getValue("_per_page");
        if (!currentSize) {
            return;
        }

        const nextSize = parseInt(currentSize, 10) + 20;
        this.queryBuilder.query = this.queryBuilder.merge({
            _per_page: nextSize,
        });

        requestHandler
            .get({
                endpoint: "eventsPublic",
                query: this.queryBuilder.without({ staticParams: true }),
            })
            .then((response) =>
                Promise.all([
                    response.json(),
                    this.composeTotalCountPromise(response),
                ])
            )
            .then(([events, events_count]) => {
                history.replace(
                    merge({
                        href: window.location.href,
                        searchParams: this.queryBuilder.query,
                    })
                );
                this.events = events;
                this.events_count = events_count;

                const hasNext = events_count > events.length;
                if (!hasNext) {
                    this.loadMore
                        .querySelector("button")
                        ?.classList.add("hidden");
                    this.loadMore.firstElementChild?.classList.remove("hidden");
                    return;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    private isEventsSizeEqualCount() {
        return (this.events?.length ?? 0) >= (this.events_count ?? 0);
    }

    private isQueryParamSet() {
        return ![null, "{}"].includes(this.queryBuilder.getValue("q"));
    }

    private shouldHideLoadMore() {
        return this.isEventsSizeEqualCount() || this.isQueryParamSet();
    }

    private isObjectAccessorSet() {
        return [
            "name",
            "event_type",
            "target_group",
            "min_age",
            "max_age",
            "fee",
            "location",
            "start_time",
            "end_time",
        ].some((key) => {
            return this.queryBuilder.getValue(key) !== null;
        });
    }

    private renderCard(event: LMSEvent) {
        const [sDate, sTime] = splitDateTime(event.start_time, locale);
        const [eDate, eTime] = splitDateTime(event.end_time, locale);
        const isSameDay = sDate === eDate;
        return html`
            <lms-card
                tabindex="0"
                @keyup=${(e: KeyboardEvent) => {
                    if (e.key === "Enter") {
                        this.handleShowDetails({
                            lmsEvent: event,
                        });
                    }
                }}
                @click=${() => {
                    this.handleShowDetails({
                        lmsEvent: event,
                    });
                }}
                .caption=${event?.name ?? ""}
                .listItems=${[
                    html`<span class="text-muted font-thin">
                        <small>
                            ${litFontawesome(faMapMarkerAlt, {
                                className: "w-4 h-4 inline-block",
                            })}
                            ${this.locations?.find(
                                (location) => location.id === event.location
                            )?.name || __("Location not found")}
                        </small>
                    </span>`,
                    html`<span class="text-muted font-thin">
                        <small>
                            ${litFontawesome(faCalendarAlt, {
                                className: "w-4 h-4 inline-block",
                            })}
                            ${sDate}, ${sTime} -
                            ${isSameDay ? eTime : `${eDate}, ${eTime}`}</small
                        ></span
                    >`,
                ]}
                .image=${event.image && event.name
                    ? {
                          src: event.image,
                          alt: event.name,
                      }
                    : undefined}
            ></lms-card>
        `;
    }

    override render() {
        return html`
            <div class="mx-4">
                <div class="flex">
                    <div class="mb-4 w-full">
                        <lms-events-filter
                            @filter=${this.handleFilter}
                            @search=${this.handleSearch}
                            .events=${this.events ?? []}
                            .shouldUpdateFacets=${Boolean(
                                !this.isQueryParamSet() &&
                                    !this.isObjectAccessorSet()
                            )}
                        >
                            ${match(this.state)
                                .with(
                                    "initial",
                                    "pending",
                                    () =>
                                        html`<div class="card-deck">
                                            ${map(
                                                [...Array(10)],
                                                () =>
                                                    html`<div
                                                        class="skeleton skeleton-card"
                                                    ></div>`
                                            )}
                                        </div>`
                                )
                                .with(
                                    "no-results",
                                    () =>
                                        html`<div
                                            class="${classMap({
                                                hidden:
                                                    this.events?.length ??
                                                    -1 > 0,
                                            })} w-full"
                                        >
                                            <div class="alert alert-info">
                                                ${__(
                                                    "There are no events to display"
                                                )}
                                            </div>
                                        </div>`
                                )
                                .with(
                                    "success",
                                    () =>
                                        html` <div class="w-full">
                                            <div class="card-deck">
                                                ${repeat(
                                                    this.events ?? [],
                                                    (event) => event["id"],
                                                    (event) =>
                                                        this.renderCard(event)
                                                )}
                                                <lms-card-details-modal
                                                    .event=${this.modalData}
                                                    .isOpen=${this.hasOpenModal}
                                                    @close=${this
                                                        .handleHideDetails}
                                                ></lms-card-details-modal>
                                            </div>
                                            <div
                                                class="load-more ${classMap({
                                                    hidden: this.shouldHideLoadMore(),
                                                })} flex justify-center"
                                            >
                                                <span
                                                    class="mt-4 hidden text-center"
                                                    >${__(
                                                        "You've reached the end"
                                                    )}</span
                                                >
                                                <button
                                                    class="btn btn-primary mt-4 w-1/4"
                                                    @click=${this
                                                        .handleLoadMore}
                                                >
                                                    ${__("Load more")}
                                                </button>
                                            </div>
                                        </div>`
                                )
                                .with(
                                    "error",
                                    () =>
                                        html`<h1 class="text-center">
                                            ${__("There's been an error")}..
                                        </h1> `
                                )
                                .exhaustive()}
                        </lms-events-filter>
                    </div>
                </div>
            </div>
        `;
    }
}
