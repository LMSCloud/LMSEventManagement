import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { __ } from "../../lib/translate";
import { cardDeckStylesStaff } from "../../styles/cardDeck";
import { skeletonStyles } from "../../styles/skeleton";
import { utilityStyles } from "../../styles/utilities";
import { tailwindStyles } from "../../tailwind.lit";
import {
    LMSEvent,
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    SortableColumns,
    TaggedData,
    UploadedImage,
} from "../../types/common";
import LMSAnchor from "../LMSAnchor";
import LMSPagination from "../LMSPagination";
import LMSSearch from "../LMSSearch";
import LMSStaffEventCard from "./LMSStaffEventCard";
import LMSStaffEventCardAttendees from "./LMSStaffEventCardAttendees";
import LMSStaffEventCardForm from "./LMSStaffEventCardForm";
import LMSStaffEventCardPreview from "./LMSStaffEventCardPreview";
import LMSStaffEventsFilter from "./LMSStaffEventsFilter";

declare global {
    interface HTMLElementTagNameMap {
        "lms-anchor": LMSAnchor;
        "lms-pagination": LMSPagination;
        "lms-search": LMSSearch;
        "lms-staff-event-card": LMSStaffEventCard;
        "lms-staff-event-card-attendees": LMSStaffEventCardAttendees;
        "lms-staff-event-card-form": LMSStaffEventCardForm;
        "lms-staff-event-card-preview": LMSStaffEventCardPreview;
        "lms-staff-events-filter": LMSStaffEventsFilter;
    }
}

@customElement("lms-staff-event-card-deck")
export default class LMSStaffEventCardDeck extends LitElement {
    @property({ type: Array }) events: LMSEvent[] = [];

    @property({ type: Array }) event_types: LMSEventType[] = [];

    @property({ type: Array }) target_groups: LMSTargetGroup[] = [];

    @property({ type: Array }) locations: LMSLocation[] = [];

    @property({ type: Array }) images: UploadedImage[] = [];

    @property({ type: String }) start_time?: string;

    @state() taggedData: TaggedData[] = [];

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

    protected override updated(
        _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
    ): void {
        super.updated(_changedProperties);

        if (
            _changedProperties.has("target_groups") ||
            _changedProperties.has("locations") ||
            _changedProperties.has("event_types")
        ) {
            this.taggedData = [
                ["target_groups", this.target_groups],
                ["location", this.locations],
                ["event_type", this.event_types],
                ["image", this.images],
                [
                    "status",
                    [
                        { id: 1, name: __("pending") },
                        { id: 2, name: __("confirmed") },
                        { id: 3, name: __("canceled") },
                        { id: 4, name: __("sold_out") },
                    ],
                ],
            ];
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

    override render() {
        return html`
            <div class="mx-4">
                <lms-staff-events-filter
                    .sortableColumns=${this.sortableColumns}
                    .target_groups=${this.target_groups}
                    .locations=${this.locations}
                    .event_types=${this.event_types}
                    .start_time=${this.start_time}
                >
                    <lms-search
                        slot="navbar-center"
                        @search=${this.handleSearch}
                        .sortableColumns=${this.sortableColumns}
                    ></lms-search>
                    <lms-pagination slot="navbar-end"></lms-pagination>
                </lms-staff-events-filter>
                <div class="card-deck">
                    ${repeat(
                        this.events,
                        (event) => event.id,
                        (event) =>
                            html`<lms-staff-event-card
                                .event=${event}
                                .taggedData=${this.taggedData}
                            ></lms-staff-event-card>`
                    )}
                </div>
            </div>
        `;
    }
}
