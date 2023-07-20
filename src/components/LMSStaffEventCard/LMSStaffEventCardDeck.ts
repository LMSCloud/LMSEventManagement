import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { searchSyntax } from "../../docs/searchSyntax";
import { InputConverter } from "../../lib/converters/InputConverter";
import { __ } from "../../lib/translate";
import { cardDeckStylesStaff } from "../../styles/cardDeck";
import { skeletonStyles } from "../../styles/skeleton";
import { utilityStyles } from "../../styles/utilities";
import { tailwindStyles } from "../../tailwind.lit";
import {
    Column,
    LMSEvent,
    LMSEventComprehensive,
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    SortableColumns,
    TaggedData,
    UploadedImage,
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

    @property({ type: Array }) images: UploadedImage[] = [];

    @property({ type: Object }) start_time: string | undefined;

    @property({ type: Array }) nextPage: Column[] | undefined = undefined;

    @property({ type: Boolean }) hasNoResults = false;

    @property({ type: Number }) _page = 1;

    @property({ type: Number }) _per_page = 20;

    private data: LMSEventComprehensive[] = [];

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
        this.data = this.events.map((event: LMSEvent) => {
            return Object.fromEntries(
                this.getColumnData(event, [
                    ["target_groups", this.target_groups],
                    ["location", this.locations],
                    ["event_type", this.event_types],
                    ["image", this.images],
                ])
            );
        });
    }

    override updated(changedProperties: Map<string, never>) {
        super.updated(changedProperties);
        if (changedProperties.has("events")) {
            this.hydrate();
            this.requestUpdate();
        }
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
        if (!doc) {
            return;
        }

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
                    .start_time=${this.start_time}
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
                    ${map(
                        this.data,
                        (datum) =>
                            html`<lms-staff-event-card
                                .datum=${datum}
                            ></lms-staff-event-card>`
                    )}
                </div>
            </div>
        `;
    }
}
