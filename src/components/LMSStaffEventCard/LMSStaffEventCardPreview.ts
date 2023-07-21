import {
    faCalendarAlt,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { splitDateTime } from "../../lib/converters/datetimeConverters";
import { locale } from "../../lib/translate";
import { skeletonStyles } from "../../styles/skeleton";
import { tailwindStyles } from "../../tailwind.lit";
import { Image, LMSEventComprehensive } from "../../types/common";
import LMSCard from "../LMSCard";

declare global {
    interface HTMLElementTagNameMap {
        "lms-card": LMSCard;
    }
}

@customElement("lms-staff-event-card-preview")
export default class LMSStaffEventCardPreview extends LitElement {
    @property({ type: Array }) event: LMSEventComprehensive | undefined;

    @state() override title = "";

    @state() image: Image = {} as Image;

    @state() listItems: TemplateResult[] = [];

    static override styles = [tailwindStyles, skeletonStyles];

    override connectedCallback() {
        super.connectedCallback();
        if (!this.event) {
            return;
        }

        const { name, image, location, start_time, end_time } = this.event;

        this.title = name ?? "";
        this.image = {
            src: image ?? "",
            alt: name ?? "",
        };

        const [sDate, sTime] = splitDateTime(start_time, locale);
        const [eDate, eTime] = splitDateTime(end_time, locale);
        const isSameDay = sDate === eDate;

        this.listItems = [
            html`<span class="font-thin">
                <small>
                    ${litFontawesome(faMapMarkerAlt, {
                        className: "w-4 h-4 inline-block",
                    })}
                    ${location?.name}
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
            .title=${this.title}
            .image=${this.image}
            .listItems=${this.listItems}
            class="m-4"
        >
        </lms-card>`;
    }
}
