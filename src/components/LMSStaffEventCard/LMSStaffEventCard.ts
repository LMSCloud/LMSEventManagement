import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { __ } from "../../lib/translate";
import { tailwindStyles } from "../../tailwind.lit";
import { LMSEventComprehensive, TaggedData } from "../../types/common";

@customElement("lms-staff-event-card")
export default class LMSStaffEventCard extends LitElement {
    @property({ type: Object }) event: LMSEventComprehensive | undefined;

    @property({ type: Array }) taggedData: TaggedData[] = [];

    @state() state: "data" | "attendees" | "preview" = "data";

    static override styles = [
        tailwindStyles,
        css`
            :host {
                background: transparent;
            }
        `,
    ];

    private handleTabClick(event: Event) {
        event.preventDefault();
        const tab = event.target as HTMLElement;
        if (!tab) {
            return;
        }

        const previousActiveTab = tab
            .closest("div")
            ?.querySelector(".tab-active");
        if (!previousActiveTab) {
            return;
        }

        previousActiveTab.classList.remove("tab-active");
        tab.classList.add("tab-active");

        const { content } = tab.dataset;
        if (!content) {
            return;
        }

        this.state = content as "data" | "attendees" | "preview";
    }

    override render() {
        if (!this.event) {
            return nothing;
        }

        const { name, image } = this.event;
        return html`
            <div class="card bg-base-100 shadow-md">
                <div>
                    <div class="tabs w-full">
                        <a
                            class="tab-bordered tab tab-active tab-lg flex-auto text-base"
                            data-content="data"
                            @click=${this.handleTabClick}
                            >${__("Data")}</a
                        >
                        <a
                            class="tab-bordered tab tab-lg flex-auto text-base"
                            data-content="attendees"
                            @click=${this.handleTabClick}
                        >
                            ${__("Waitlist")}</a
                        >
                        <a
                            class="tab-bordered tab tab-lg flex-auto text-base"
                            data-content="preview"
                            @click=${this.handleTabClick}
                        >
                            ${__("Preview")}</a
                        >
                    </div>
                </div>
                <div class="card-body">
                    <div
                        class="card-title flex h-24 items-center justify-center rounded-md bg-cover bg-center"
                        style="background-image: url(${image});"
                    >
                        <h3 class="rounded-lg bg-base-100 p-2 text-xl">
                            ${name}
                        </h3>
                    </div>
                    <lms-staff-event-card-form
                        .event=${this.event}
                        .taggedData=${this.taggedData}
                        class=${classMap({
                            hidden: this.state !== "data",
                        })}
                    ></lms-staff-event-card-form>
                    <lms-staff-event-card-attendees
                        class=${classMap({
                            hidden: this.state !== "attendees",
                        })}
                    ></lms-staff-event-card-attendees>
                    <lms-staff-event-card-preview
                        .event=${this.event}
                        .taggedData=${this.taggedData}
                        class=${classMap({
                            hidden: this.state !== "preview",
                        })}
                    ></lms-staff-event-card-preview>
                </div>
            </div>
        `;
    }
}
