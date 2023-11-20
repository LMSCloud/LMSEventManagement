import {
    faCalendarAlt,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, PropertyValueMap, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { splitDateTime } from "../../lib/converters/datetimeConverters";
import { locale } from "../../lib/translate";
import { skeletonStyles } from "../../styles/skeleton";
import { tailwindStyles } from "../../tailwind.lit";
import { Image, LMSEvent, LMSLocation, TaggedData } from "../../types/common";
import LMSCard from "../LMSCard";

declare global {
    interface HTMLElementTagNameMap {
        "lms-card": LMSCard;
    }
}

@customElement("lms-staff-event-card-preview")
export default class LMSStaffEventCardPreview extends LitElement {
    @property({ type: Object }) event?: LMSEvent;

    @property({ type: Array }) taggedData: TaggedData[] = [];

    @state() caption?: string;

    @state() image?: Image;

    @state() listItems: TemplateResult[] = [];

    static override styles = [tailwindStyles, skeletonStyles];

    protected override updated(
        _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
    ): void {
        super.updated(_changedProperties);
        if (
            !_changedProperties.has("event") &&
            !_changedProperties.has("taggedData")
        ) {
            return;
        }

        if (!this.event) {
            return;
        }

        const { name, image, location, start_time, end_time } = this.event;

        this.caption = name ?? "";
        this.image = {
            src: image ?? "",
            alt: name ?? "",
        };

        const [sDate, sTime] = splitDateTime(start_time, locale);
        const [eDate, eTime] = splitDateTime(end_time, locale);
        const isSameDay = sDate === eDate;

        const taggedLocations = this.taggedData
            .filter(([tag]) => tag === "location")
            .flat();
        const locations = taggedLocations[1] as unknown as LMSLocation[];
        const locationName = locations?.find((loc) => loc.id == location)?.name;

        this.listItems = [
            html`<span class="font-thin">
                <small>
                    ${litFontawesome(faMapMarkerAlt, {
                        className: "w-4 h-4 inline-block",
                    })}
                    ${locationName}
                </small>
            </span>`,
            html`<span class="font-thin">
                <small>
                    ${litFontawesome(faCalendarAlt, {
                        className: "w-4 h-4 inline-block",
                    })}
                    ${sDate}, ${sTime} -
                    ${isSameDay ? eTime : `${eDate}, ${eTime}`}</small
                ></span
            >`,
        ];
    }

    override render() {
        return html`<lms-card
            .caption=${this.caption}
            .image=${this.image}
            .listItems=${this.listItems}
            class="m-4"
        >
        </lms-card>`;
    }
}
