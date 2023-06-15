import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { searchSyntax } from "../../docs/searchSyntax";
import { InputConverter, TemplateResultConverter } from "../../lib/converters";
import { __ } from "../../lib/translate";
import { cardDeckStylesStaff } from "../../styles/cardDeck";
import { skeletonStyles } from "../../styles/skeleton";
import { utilityStyles } from "../../styles/utilities";
import { tailwindStyles } from "../../tailwind.lit";
import {
    Column,
    LMSEvent,
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    SortableColumns,
    TaggedColumn,
    TaggedData,
} from "../../types/common";
import LMSAnchor from "../LMSAnchor";
import LMSSearch from "../LMSSearch";
import LMSStaffEventCardAttendees from "./LMSStaffEventCardAttendees";
import LMSStaffEventCardForm from "./LMSStaffEventCardForm";
import LMSStaffEventCardPreview from "./LMSStaffEventCardPreview";
import LMSStaffEventsFilter from "./LMSStaffEventsFilter";

declare global {
    interface HTMLElementTagNameMap {
        "lms-staff-event-card-form": LMSStaffEventCardForm;
        "lms-staff-event-card-attendees": LMSStaffEventCardAttendees;
        "lms-staff-event-card-preview": LMSStaffEventCardPreview;
        "lms-staff-events-filter": LMSStaffEventsFilter;
        "lms-anchor": LMSAnchor;
        "lms-search": LMSSearch;
    }
}

@customElement("lms-staff-event-card-deck")
export default class LMSStaffEventCardDeck extends LitElement {
    @property({ type: Array }) events: LMSEvent[] = [];

    @property({ type: Array }) event_types: LMSEventType[] = [];

    @property({ type: Array }) target_groups: LMSTargetGroup[] = [];

    @property({ type: Array }) locations: LMSLocation[] = [];

    @property({ type: Array }) nextPage: Column[] | undefined = undefined;

    @property({ type: Boolean }) hasNoResults = false;

    @property({ type: Number }) _page = 1;

    @property({ type: Number }) _per_page = 20;

    private data: TaggedColumn[] = [];

    private cardStates: Map<string, string[]> = new Map();

    private inputConverter = new InputConverter();

    private sortableColumns: SortableColumns = ["id"];

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        utilityStyles,
        cardDeckStylesStaff,
    ];

    constructor() {
        super();
        this.sortableColumns = [
            ...(this.sortableColumns as ["id"]),
            "name",
            "event_type",
            "min_age",
            "max_age",
            "max_participants",
            "start_time",
            "end_time",
            "registration_start",
            "registration_end",
            "location",
            "image",
            "status",
            "registration_link",
            "open_registration",
            "description",
        ];
    }

    override connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    protected *getColumnData(query: LMSEvent, data?: TaggedData[]) {
        for (const [name, value] of Object.entries(query)) {
            yield [
                name,
                this.inputConverter.getInputTemplate({ name, value, data }),
            ];
        }
    }

    private hydrate() {
        /** Here we initialize the card states so we can track them
         *  individually going forward. */
        this.events.forEach(() => {
            this.cardStates.set(
                crypto.getRandomValues(new Uint32Array(2)).join("-"),
                ["data"]
            );
        });

        const data = this.events.map((event: LMSEvent) => {
            return Object.fromEntries(
                this.getColumnData(event, [
                    ["target_groups", this.target_groups],
                    ["location", this.locations],
                    ["event_type", this.event_types],
                ])
            );
        });

        /** Here we tag every datum with the uuid we generated earlier. */
        this.data = data.map((datum, index) => {
            const [uuid] = [...this.cardStates][index];
            return {
                ...datum,
                uuid,
            };
        });
    }

    override updated(changedProperties: Map<string, never>) {
        super.updated(changedProperties);
        if (changedProperties.has("events")) {
            this.hydrate();
            this.requestUpdate();
        }
    }

    private handleTabClick(event: Event) {
        event.preventDefault();
        const tab = event.target as HTMLElement;
        if (!tab) return;

        const previousActiveTab = tab
            .closest("div")
            ?.querySelector(".tab-active");
        if (!previousActiveTab) return;
        previousActiveTab.classList.remove("tab-active");

        tab.classList.add("tab-active");

        const { content, uuid } = tab.dataset;
        if (!content || !uuid) return;
        this.cardStates.set(uuid, [content]);
        this.requestUpdate();
    }

    private handleSearch(e: CustomEvent) {
        const { detail } = e;
        this.dispatchEvent(
            new CustomEvent("search", {
                detail,
                composed: true,
                bubbles: true,
            })
        );
    }

    private toggleDoc(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const doc = target.nextElementSibling;
        if (!doc) return;

        doc.classList.toggle("hidden");
    }

    override render() {
        return html`
            <div class="mx-4">
                <lms-staff-events-filter
                    .sortableColumns=${this.sortableColumns}
                    .event_types=${this.event_types}
                    .target_groups=${this.target_groups}
                    .locations=${this.locations}
                >
                    <lms-search
                        slot="navbar-center"
                        @search=${this.handleSearch}
                        .sortableColumns=${this.sortableColumns}
                    ></lms-search>
                    <lms-pagination
                        slot="navbar-end"
                        .nextPage=${this.nextPage}
                        ._page=${this._page}
                        ._per_page=${this._per_page}
                    ></lms-pagination>
                </lms-staff-events-filter>
                <div
                    class="${classMap({
                        hidden: !this.hasNoResults,
                    })} alert alert-info text-center"
                    role="alert"
                >
                    <h4>${__("No matches found")}.</h4>
                    <p>${__("Try refining your search.")}</p>
                    <button
                        class="btn-info btn-outline btn"
                        @click=${this.toggleDoc}
                    >
                        ${__("Help")}
                    </button>
                    <div class="hidden text-left">
                        <hr />
                        ${searchSyntax}
                    </div>
                </div>
                <div class="card-deck">
                    ${map(this.data, (datum) => {
                        const { name, image, uuid } = datum;
                        const [title] = new TemplateResultConverter(
                            name
                        ).getRenderValues();
                        const [src] = new TemplateResultConverter(
                            image
                        ).getRenderValues();
                        const [state] = this.cardStates.get(uuid) || "data";
                        return html`
                            <div class="card bg-base-100 shadow-md">
                                <div>
                                    <div class="tabs w-full">
                                        <a
                                            class="tab-bordered tab tab-active tab-lg flex-auto text-base"
                                            data-content="data"
                                            data-uuid=${datum.uuid}
                                            @click=${this.handleTabClick}
                                            >${__("Data")}</a
                                        >
                                        <a
                                            class="tab-bordered tab tab-lg flex-auto text-base"
                                            data-content="attendees"
                                            data-uuid=${datum.uuid}
                                            @click=${this.handleTabClick}
                                        >
                                            ${__("Waitlist")}</a
                                        >
                                        <a
                                            class="tab-bordered tab tab-lg flex-auto text-base"
                                            data-content="preview"
                                            data-uuid=${datum.uuid}
                                            @click=${this.handleTabClick}
                                        >
                                            ${__("Preview")}</a
                                        >
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div
                                        class="card-title flex h-24 items-center justify-center rounded-md bg-cover bg-center"
                                        style="background-image: url(${src});"
                                    >
                                        <h3
                                            class="rounded-lg bg-base-100 p-2 text-xl"
                                        >
                                            ${title}
                                        </h3>
                                    </div>
                                    <lms-staff-event-card-form
                                        .datum=${datum}
                                        class=${classMap({
                                            hidden: !(state === "data"),
                                        })}
                                    ></lms-staff-event-card-form>
                                    <lms-staff-event-card-attendees
                                        class=${classMap({
                                            hidden: !(state === "attendees"),
                                        })}
                                    ></lms-staff-event-card-attendees>
                                    <lms-staff-event-card-preview
                                        class=${classMap({
                                            hidden: !(state === "preview"),
                                        })}
                                        .datum=${datum}
                                    ></lms-staff-event-card-preview>
                                </div>
                            </div>
                        `;
                    })}
                </div>
            </div>
        `;
    }
}
