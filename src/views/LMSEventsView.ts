import {
    faCalendarAlt,
    faListUl,
    faMapMarkerAlt,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import history from "history/browser";
import { css, html, LitElement, nothing } from "lit";
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
import { __, attr__, locale } from "../lib/translate";
import { cardDeckStylesOpac } from "../styles/cardDeck";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import { LMSEvent, LMSLocation, LMSSettingResponse } from "../types/common";

const COMPACT_LIST_STORAGE_KEY = "lms-event-management:opac-compact-list-open";

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

    @state() allEvents?: Array<LMSEvent>;

    @state() events_count?: number;

    @state() locations?: Array<LMSLocation>;

    @state() modalData?: LMSEvent;

    @state() hasOpenModal = false;

    @state() compactListEnabled = false;

    @state() compactListOpen = false;

    @state() imageCropEnabled = false;

    @query(".load-more") loadMore!: HTMLButtonElement;

    private queryBuilder = new QueryBuilder({
        query: window.location.search,
        optionalParams: ["min_age", "max_age", "start_time", "end_time", "fee"],
        repeatableParams: ["event_type", "target_group", "location"],
        staticParams: ["class", "method", "op", "code"],
    });

    private static compactListStyles = css`
        .opac-layout {
            display: block;
        }

        .opac-layout__main {
            min-width: 0;
        }

        .compact-list {
            margin-bottom: 1rem;
            border-radius: 0.75rem;
            border: 1px solid rgb(226 232 240);
            background: rgb(255 255 255);
            box-shadow: 0 8px 24px -18px rgb(15 23 42 / 0.45);
            overflow: hidden;
        }

        .compact-list__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid rgb(241 245 249);
            background: rgb(248 250 252);
        }

        .compact-list__title {
            font-weight: 700;
            font-size: 0.95rem;
            line-height: 1.2;
        }

        .compact-list__body {
            padding: 0.5rem 0;
            max-height: 70vh;
            overflow-y: auto;
        }

        .compact-list__item {
            display: block;
            width: 100%;
            text-align: left;
            padding: 0.5rem 1rem;
            background: none;
            border: none;
            border-bottom: 1px solid rgb(241 245 249);
            cursor: pointer;
            font-size: 0.85rem;
            line-height: 1.35;
            color: inherit;
        }

        .compact-list__item:last-child {
            border-bottom: none;
        }

        .compact-list__item:hover,
        .compact-list__item:focus-visible {
            background: rgb(241 245 249);
            outline: none;
        }

        .compact-list__when {
            display: block;
            color: rgb(71 85 105);
            font-size: 0.8rem;
        }

        .compact-list__name {
            display: block;
            margin-top: 0.15rem;
            font-weight: 500;
        }

        .compact-list-toggle {
            display: none;
        }

        /*
         * Sticky-sidebar offsets. The sidebar sits below the filter bar
         * (which is sticky-top:0 in its own shadow DOM); these knobs are
         * tuned to clear the filter's rendered height in each state.
         * Override via OPACUserCSS to fit a different filter layout.
         *
         *   --lms-events-sidebar-top: applied to .compact-list top /
         *       max-height and to .opac-layout--with-sidebar's row min,
         *       so the grid row hosting the sidebar is always tall enough
         *       for sticky to engage even with a short main column.
         */
        :host {
            --lms-events-sidebar-top-without-chips: 11rem;
            --lms-events-sidebar-top-with-chips: 14rem;
        }

        lms-events-filter:not([has-active-filters]) .opac-layout--with-sidebar {
            --lms-events-sidebar-top: var(
                --lms-events-sidebar-top-without-chips
            );
        }

        lms-events-filter[has-active-filters] .opac-layout--with-sidebar {
            --lms-events-sidebar-top: var(--lms-events-sidebar-top-with-chips);
        }

        @media (min-width: 1024px) {
            .opac-layout--with-sidebar {
                display: grid;
                grid-template-columns: 18rem minmax(0, 1fr);
                gap: 1.25rem;
                align-items: start;
                grid-auto-rows: minmax(
                    calc(100vh - var(--lms-events-sidebar-top)),
                    auto
                );
            }

            .compact-list {
                position: sticky;
                top: var(--lms-events-sidebar-top);
                max-height: calc(100vh - var(--lms-events-sidebar-top));
                margin-bottom: 0;
            }

            .compact-list-toggle {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                margin-bottom: 0.75rem;
            }
        }

        @media (max-width: 1023px) {
            .compact-list,
            .compact-list-toggle {
                display: none;
            }
        }
    `;

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        cardDeckStylesOpac,
        LMSEventsView.compactListStyles,
    ];

    override connectedCallback(): void {
        super.connectedCallback();

        this.initCompactListState();

        //TODO: clean this up
        let [orderBy, page, perPage, q, openRegistration] =
            this.queryBuilder.getValues(
                "_order_by",
                "_page",
                "_per_page",
                "q",
                "open_registration",
            );

        orderBy ??= "start_time";
        page ??= "1";
        perPage ??= "20";
        q ??= "{}";
        openRegistration ??= "true";

        this.queryBuilder.query = this.queryBuilder.merge({
            _order_by: orderBy,
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
                ]),
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
                    }),
                );

                // Check if we should auto-open an event from the hash
                this.checkHashForEvent();
            })
            .catch((error) => {
                this.state = "error";
                console.error(error);
            })
            .then(() => {
                if (!this.events_count) {
                    return;
                }

                const params = this.queryBuilder.merge({
                    _order_by: "id",
                    _page: 1,
                    _per_page: this.events_count,
                    q: "{}",
                    open_registration: "true",
                });
                requestHandler
                    .get({
                        endpoint: "eventsPublic",
                        query: this.queryBuilder.without({
                            staticParams: true,
                            useParams: params,
                        }),
                    })
                    .then((response) => response.json())
                    .then((allEvents) => {
                        this.allEvents = allEvents;
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    private composeTotalCountPromise(response: Response) {
        return new Promise<number>((resolve) =>
            resolve(parseInt(response.headers.get("X-Total-Count")!, 10)),
        );
    }

    private initCompactListState() {
        let stored: string | null = null;
        try {
            stored = window.localStorage.getItem(COMPACT_LIST_STORAGE_KEY);
        } catch {
            stored = null;
        }
        this.compactListOpen = stored === null ? true : stored === "1";

        requestHandler
            .get({ endpoint: "settingsPublic" })
            .then((response) => response.json())
            .then((settings: LMSSettingResponse[]) => {
                this.compactListEnabled = this.readBoolSetting(
                    settings,
                    "opac_compact_list_enabled",
                );
                this.imageCropEnabled = this.readBoolSetting(
                    settings,
                    "opac_image_crop_enabled",
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }

    private readBoolSetting(
        settings: LMSSettingResponse[],
        key: LMSSettingResponse["plugin_key"],
    ): boolean {
        const setting = settings.find((s) => s.plugin_key === key);
        if (!setting) {
            return false;
        }

        let value: unknown = setting.plugin_value;
        try {
            value = JSON.parse(String(value));
        } catch {
            /* leave as-is */
        }
        return Boolean(Number(value));
    }

    private toggleCompactList(open: boolean) {
        this.compactListOpen = open;
        try {
            window.localStorage.setItem(
                COMPACT_LIST_STORAGE_KEY,
                open ? "1" : "0",
            );
        } catch {
            /* ignore storage errors */
        }
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
                ]),
            )
            .then(([events, events_count]) => {
                history.replace(
                    merge({
                        href: window.location.href,
                        searchParams: this.queryBuilder.query,
                    }),
                );
                this.events = events;
                this.events_count = events_count;

                // Sync "Show more" button / "You've reached the end" visibility with current state
                const hasMore = events_count > events.length;
                const button = this.loadMore.querySelector("button");
                const endMessage = this.loadMore.firstElementChild;
                if (hasMore) {
                    button?.classList.remove("hidden");
                    endMessage?.classList.add("hidden");
                } else {
                    button?.classList.add("hidden");
                    endMessage?.classList.remove("hidden");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    private handleSearch(e: CustomEvent) {
        const { filters, q } = e.detail;

        this.queryBuilder.query = this.queryBuilder.merge(
            filters?.concat([["q", q]]) ?? { q },
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
                ]),
            )
            .then(([events, events_count]) => {
                history.replace(
                    merge({
                        href: window.location.href,
                        searchParams: this.queryBuilder.query,
                    }),
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

    private checkHashForEvent() {
        const hash = window.location.hash;
        if (!hash || !hash.startsWith("#event-")) {
            return;
        }

        const eventId = parseInt(hash.replace("#event-", ""), 10);
        if (isNaN(eventId)) {
            return;
        }

        const event = this.events?.find((e) => e.id === eventId);
        if (event) {
            this.handleShowDetails({ lmsEvent: event });
        }
    }

    private handleLoadMore() {
        const currentSize = this.queryBuilder.getValue("_per_page");
        if (!currentSize) {
            return;
        }

        const nextSize = parseInt(currentSize, 10) + 20;

        // Preserve current filter params when loading more
        // The merge() method treats absence of repeatable/optional params as removal,
        // so we must explicitly include all current filter values
        const currentParams: [string, string][] = [
            ["_per_page", String(nextSize)],
        ];

        this.queryBuilder.repeatableParams.forEach((param) => {
            this.queryBuilder.paramMap.getAll(param).forEach((value) => {
                currentParams.push([param, value]);
            });
        });

        this.queryBuilder.optionalParams.forEach((param) => {
            const value = this.queryBuilder.paramMap.get(param);
            if (value) {
                currentParams.push([param, value]);
            }
        });

        this.queryBuilder.query = this.queryBuilder.merge(currentParams);

        requestHandler
            .get({
                endpoint: "eventsPublic",
                query: this.queryBuilder.without({ staticParams: true }),
            })
            .then((response) =>
                Promise.all([
                    response.json(),
                    this.composeTotalCountPromise(response),
                ]),
            )
            .then(([events, events_count]) => {
                history.replace(
                    merge({
                        href: window.location.href,
                        searchParams: this.queryBuilder.query,
                    }),
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

    private isQueryParamSet() {
        return ![null, "{}"].includes(this.queryBuilder.getValue("q"));
    }

    private shouldHideLoadMore() {
        return this.isQueryParamSet();
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

    private renderCompactListItem(event: LMSEvent) {
        const [sDate, sTime] = splitDateTime(event.start_time, locale);
        const [, eTime] = splitDateTime(event.end_time, locale);
        return html`
            <button
                type="button"
                class="compact-list__item"
                @click=${() => this.handleShowDetails({ lmsEvent: event })}
            >
                <span class="compact-list__when">
                    ${sDate}, ${sTime}${eTime ? ` - ${eTime}` : nothing}
                </span>
                <span class="compact-list__name">${event.name}</span>
            </button>
        `;
    }

    private renderCompactList() {
        if (!this.compactListEnabled || !this.compactListOpen) {
            return nothing;
        }

        return html`
            <aside class="compact-list" aria-label=${attr__("Upcoming events")}>
                <header class="compact-list__header">
                    <span class="compact-list__title">
                        ${__("Upcoming events")}
                    </span>
                    <button
                        type="button"
                        class="btn btn-ghost btn-xs"
                        @click=${() => this.toggleCompactList(false)}
                        aria-label=${attr__("Hide upcoming events list")}
                    >
                        ${litFontawesome(faXmark, {
                            className: "w-3 h-3",
                        })}
                    </button>
                </header>
                <div class="compact-list__body">
                    ${repeat(
                        this.events ?? [],
                        (event) => event["id"],
                        (event) => this.renderCompactListItem(event),
                    )}
                </div>
            </aside>
        `;
    }

    private renderCompactListToggle() {
        if (!this.compactListEnabled || this.compactListOpen) {
            return nothing;
        }

        return html`
            <button
                type="button"
                class="compact-list-toggle btn btn-outline btn-sm"
                @click=${() => this.toggleCompactList(true)}
            >
                ${litFontawesome(faListUl, { className: "w-4 h-4" })}
                <span>${__("Show upcoming events")}</span>
            </button>
        `;
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
                    html`<span class="text-muted">
                        <small>
                            ${litFontawesome(faMapMarkerAlt, {
                                className: "w-4 h-4 inline-block",
                            })}
                            ${this.locations?.find(
                                (location) => location.id === event.location,
                            )?.name || __("Location not found")}
                        </small>
                    </span>`,
                    html`<span class="text-muted">
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
                .status=${event.status}
                ?crop-images=${this.imageCropEnabled}
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
                            .events=${this.allEvents ?? this.events ?? []}
                            .shouldUpdateFacets=${Boolean(
                                !this.isQueryParamSet() &&
                                    !this.isObjectAccessorSet(),
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
                                                    ></div>`,
                                            )}
                                        </div>`,
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
                                                    "There are no events to display",
                                                )}
                                            </div>
                                        </div>`,
                                )
                                .with(
                                    "success",
                                    () =>
                                        html` <div
                                            class="opac-layout ${classMap({
                                                "opac-layout--with-sidebar":
                                                    this.compactListEnabled &&
                                                    this.compactListOpen,
                                            })} w-full"
                                        >
                                            ${this.renderCompactList()}
                                            <div class="opac-layout__main">
                                                ${this.renderCompactListToggle()}
                                                <div class="card-deck">
                                                    ${repeat(
                                                        this.events ?? [],
                                                        (event) => event["id"],
                                                        (event) =>
                                                            this.renderCard(
                                                                event,
                                                            ),
                                                    )}
                                                    <lms-card-details-modal
                                                        .event=${this.modalData}
                                                        .isOpen=${this
                                                            .hasOpenModal}
                                                        ?crop-images=${this
                                                            .imageCropEnabled}
                                                        @close=${this
                                                            .handleHideDetails}
                                                    ></lms-card-details-modal>
                                                </div>
                                                <div
                                                    class="load-more ${classMap(
                                                        {
                                                            hidden: this.shouldHideLoadMore(),
                                                        },
                                                    )} flex justify-center"
                                                >
                                                    <span
                                                        class="mt-4 hidden text-center"
                                                        >${__(
                                                            "You've reached the end",
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
                                            </div>
                                        </div>`,
                                )
                                .with(
                                    "error",
                                    () =>
                                        html`<h1 class="text-center">
                                            ${__("There's been an error")}..
                                        </h1> `,
                                )
                                .exhaustive()}
                        </lms-events-filter>
                    </div>
                </div>
            </div>
        `;
    }
}
