import {
    faCalendarAlt,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { splitDateTime } from "../../lib/converters/datetimeConverters";
import { TemplateResultConverter } from "../../lib/converters/TemplateResultConverter";
import { locale } from "../../lib/translate";
import { skeletonStyles } from "../../styles/skeleton";
import { tailwindStyles } from "../../tailwind.lit";
import { Column, Image } from "../../types/common";
import LMSCard from "../LMSCard";

declare global {
    interface HTMLElementTagNameMap {
        "lms-card": LMSCard;
    }
}

@customElement("lms-staff-event-card-preview")
export default class LMSStaffEventCardPreview extends LitElement {
    @property({ type: Array }) datum: Column = {} as Column;

    @state() override title = "";

    @state() image: Image = {} as Image;

    @state() listItems: TemplateResult[] = [];

    private trc = new TemplateResultConverter(undefined);

    static override styles = [tailwindStyles, skeletonStyles];

    override connectedCallback() {
        super.connectedCallback();

        const { name, image, location, start_time, end_time } = this.datum;

        this.title = this.trc.getValueByIndex(
            name as TemplateResult,
            0
        ) as string;

        const imageRenderValues = this.trc.getRenderValues(
            image as TemplateResult
        );
        const src = imageRenderValues[imageRenderValues.length - 1] as string;

        this.image = {
            src,
            alt: this.title,
        };

        const locationTemplateValues = this.trc.getRenderValues(
            location
        ) as Array<[number, boolean, string]>;
        const [, , loc] = locationTemplateValues
            .filter(([, selected]) => selected)
            .flat();

        const startTime = this.trc.getValueByIndex(
            start_time as TemplateResult,
            0
        ) as string;

        const endTime = this.trc.getValueByIndex(
            end_time as TemplateResult,
            0
        ) as string;

        const [sDate, sTime] = splitDateTime(startTime, locale);
        const [eDate, eTime] = splitDateTime(endTime, locale);
        const isSameDay = sDate === eDate;

        this.listItems = [
            html`<span class="font-thin">
                <small>
                    ${litFontawesome(faMapMarkerAlt, {
                        className: "w-4 h-4 inline-block",
                    })}
                    ${loc}
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
