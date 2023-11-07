import {
    faCalendarAlt,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { repeat } from "lit/directives/repeat.js";
import LMSCardDetailsModal from "../components/custom/LMSCardDetailsModal";
import LMSEventsFilter from "../components/custom/LMSEventsFilter";
import LMSCard from "../components/LMSCard";
import { splitDateTime } from "../lib/converters/datetimeConverters";
import { QueryBuilder } from "../lib/QueryBuilder";
import { requestHandler } from "../lib/RequestHandler";
import { locale, __ } from "../lib/translate";
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
    @property({ type: String }) borrowernumber = undefined;

    @state() events: LMSEvent[] = [];

    @state() events_count: number | undefined;

    @state() locations: LMSLocation[] = [];

    @state() modalData: LMSEvent = {} as LMSEvent;

    @state() hasOpenModal = false;

    @query(".load-more") loadMore!: HTMLButtonElement;

    private hasLoaded = false;

    private queryBuilder = new QueryBuilder();

    private boundHandlePopState = this.handlePopState.bind(this);

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        cardDeckStylesOpac,
    ];

    constructor() {
        super();

        this.queryBuilder.reservedParams = [
            "_match",
            "_order_by",
            "_page",
            "_per_page",
            "q",
        ];
        this.queryBuilder.areRepeatable = [
            "event_type",
            "target_group",
            "location",
        ];
        this.queryBuilder.query = window.location.search;
        this.queryBuilder.updateQuery(
            "_order_by=id&_page=1&_per_page=20&open_registration=true"
        );
    }

    override connectedCallback() {
        super.connectedCallback();

        window.addEventListener("popstate", this.boundHandlePopState);

        Promise.all([
            requestHandler.get(
                "eventsPublic",
                this.queryBuilder.query.toString()
            ),
            requestHandler.get("locationsPublic"),
        ])
            .then(([eventsResponse, locationsResponse]) =>
                Promise.all([
                    eventsResponse.json(),
                    this.composeTotalCountPromise(eventsResponse),
                    locationsResponse.json(),
                ])
            )
            .then(([events, events_count, locations]) => {
                this.hasLoaded = true;
                this.events = events;
                this.events_count = events_count;
                this.locations = locations;
                this.queryBuilder.updateUrl();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("popstate", this.boundHandlePopState);
    }

    private composeTotalCountPromise(response: Response) {
        return new Promise<number>((resolve) =>
            resolve(parseInt(response.headers.get("X-Total-Count")!, 10))
        );
    }

    private handlePopState(e: PopStateEvent) {
        const { state } = e;
        const url = new URL(state?.url || window.location.href);
        this.handleQuery(
            new CustomEvent("query", { detail: url.search }),
            false
        );
    }

    private handleQuery(e: CustomEvent, updateUrl = true) {
        const query = e.detail;
        this.queryBuilder.updateQuery(query);

        requestHandler
            .get("eventsPublic", this.queryBuilder.query.toString())
            .then((response) =>
                Promise.all([
                    response.json(),
                    this.composeTotalCountPromise(response),
                ])
            )
            .then(([events, events_count]) => {
                this.events = events;
                this.events_count = events_count;
                if (updateUrl) {
                    this.queryBuilder.updateUrl();
                }
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
        this.modalData = {} as LMSEvent;
        this.hasOpenModal = false;
    }

    private handleLoadMore() {
        const params = new URLSearchParams(this.queryBuilder.query);

        const currentSize = params.get("_per_page");
        if (!currentSize) {
            return;
        }
        const nextSize = parseInt(currentSize, 10) + 20;
        params.set("_per_page", nextSize.toString());

        this.queryBuilder.updateQuery(params);
        requestHandler
            .get("eventsPublic", this.queryBuilder.query.toString())
            .then((response) =>
                Promise.all([
                    response.json(),
                    this.composeTotalCountPromise(response),
                ])
            )
            .then(([events, events_count]) => {
                this.queryBuilder.updateUrl();
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
        return ![null, "{}"].includes(this.queryBuilder.getParamValue("q"));
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
            return this.queryBuilder.getParamValue(key) !== null;
        });
    }

    override render() {
        return html`
            <div class="mx-4">
                <div class="flex">
                    <div class="mb-4 w-full">
                        <lms-events-filter
                            @filter=${this.handleQuery}
                            @search=${this.handleQuery}
                            .events=${this.events}
                            .shouldUpdateFacets=${Boolean(
                                !this.isQueryParamSet() &&
                                    !this.isObjectAccessorSet()
                            )}
                        >
                            ${!this.hasLoaded
                                ? html`<div class="card-deck">
                                      ${map(
                                          [...Array(10)],
                                          () =>
                                              html`<div
                                                  class="skeleton skeleton-card"
                                              ></div>`
                                      )}
                                  </div>`
                                : nothing}
                            ${this.hasLoaded && !this.events.length
                                ? html`<div
                                      class="${classMap({
                                          hidden: this.events.length > 0,
                                      })} w-full"
                                  >
                                      <div class="alert alert-info">
                                          ${__(
                                              "There are no events to display"
                                          )}
                                      </div>
                                  </div>`
                                : nothing}
                            <div class="w-full" ?hidden=${!this.events.length}>
                                <div class="card-deck">
                                    ${repeat(
                                        this.events,
                                        (event) => event["id"],
                                        (event) => {
                                            const [sDate, sTime] =
                                                splitDateTime(
                                                    event.start_time,
                                                    locale
                                                );
                                            const [eDate, eTime] =
                                                splitDateTime(
                                                    event.end_time,
                                                    locale
                                                );
                                            const isSameDay = sDate === eDate;
                                            return html`
                                                <lms-card
                                                    tabindex="0"
                                                    @keyup=${(
                                                        e: KeyboardEvent
                                                    ) => {
                                                        if (e.key === "Enter") {
                                                            this.handleShowDetails(
                                                                {
                                                                    lmsEvent:
                                                                        event,
                                                                }
                                                            );
                                                        }
                                                    }}
                                                    @click=${() => {
                                                        this.handleShowDetails({
                                                            lmsEvent: event,
                                                        });
                                                    }}
                                                    .title=${event.name}
                                                    .listItems=${[
                                                        html`<span
                                                            class="text-muted font-thin"
                                                        >
                                                            <small>
                                                                ${litFontawesome(
                                                                    faMapMarkerAlt,
                                                                    {
                                                                        className:
                                                                            "w-4 h-4 inline-block",
                                                                    }
                                                                )}
                                                                ${this.locations.find(
                                                                    (
                                                                        location
                                                                    ) =>
                                                                        location.id ===
                                                                        event.location
                                                                )?.name ||
                                                                __(
                                                                    "Location not found"
                                                                )}
                                                            </small>
                                                        </span>`,
                                                        html`<span
                                                            class="text-muted font-thin"
                                                        >
                                                            <small>
                                                                ${litFontawesome(
                                                                    faCalendarAlt,
                                                                    {
                                                                        className:
                                                                            "w-4 h-4 inline-block",
                                                                    }
                                                                )}
                                                                ${sDate},
                                                                ${sTime} -
                                                                ${isSameDay
                                                                    ? eTime
                                                                    : `${eDate}, ${eTime}`}</small
                                                            ></span
                                                        >`,
                                                    ]}
                                                    .image=${{
                                                        src: event.image,
                                                        alt: event.name,
                                                    }}
                                                ></lms-card>
                                            `;
                                        }
                                    ) ?? nothing}
                                    <lms-card-details-modal
                                        @close=${this.handleHideDetails}
                                        .event=${this.modalData}
                                        .isOpen=${this.hasOpenModal}
                                    ></lms-card-details-modal>
                                </div>
                                <div
                                    class="load-more ${classMap({
                                        hidden: this.shouldHideLoadMore(),
                                    })} flex justify-center"
                                >
                                    <span class="mt-4 hidden text-center"
                                        >${__("You've reached the end")}</span
                                    >
                                    <button
                                        class="btn btn-primary mt-4 w-1/4"
                                        @click=${this.handleLoadMore}
                                    >
                                        ${__("Load more")}
                                    </button>
                                </div>
                            </div>
                        </lms-events-filter>
                    </div>
                </div>
            </div>
        `;
    }
}
