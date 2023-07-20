import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { TemplateResultConverter } from "../../lib/converters/TemplateResultConverter";
import { __ } from "../../lib/translate";
import { tailwindStyles } from "../../tailwind.lit";
import { LMSEventComprehensive } from "../../types/common";

@customElement("lms-staff-event-card")
export default class LMSStaffEventCard extends LitElement {
    @property({ type: Object }) datum: LMSEventComprehensive | undefined;

    @state() state: "data" | "attendees" | "preview" = "data";

    private trc = new TemplateResultConverter(undefined);

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

        const { content, id } = tab.dataset;
        if (!content || !id) {
            return;
        }

        this.state = content as "data" | "attendees" | "preview";
        this.requestUpdate();
    }

    override render() {
        if (!this.datum) {
            return nothing;
        }

        const { name, image } = this.datum;

        this.trc.templateResult = name;
        const [title] = this.trc.getRenderValues();

        this.trc.templateResult = image;
        const src = this.trc.getRenderValues().pop();
        return html`
            <div class="card bg-base-100 shadow-md">
                <div>
                    <div class="tabs w-full">
                        <a
                            class="tab-bordered tab tab-active tab-lg flex-auto text-base"
                            data-content="data"
                            data-id=${this.datum.id}
                            @click=${this.handleTabClick}
                            >${__("Data")}</a
                        >
                        <a
                            class="tab-bordered tab tab-lg flex-auto text-base"
                            data-content="attendees"
                            data-id=${this.datum.id}
                            @click=${this.handleTabClick}
                        >
                            ${__("Waitlist")}</a
                        >
                        <a
                            class="tab-bordered tab tab-lg flex-auto text-base"
                            data-content="preview"
                            data-id=${this.datum.id}
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
                        <h3 class="rounded-lg bg-base-100 p-2 text-xl">
                            ${title}
                        </h3>
                    </div>
                    <lms-staff-event-card-form
                        .datum=${this.datum}
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
                        class=${classMap({
                            hidden: this.state !== "preview",
                        })}
                        .datum=${this.datum}
                    ></lms-staff-event-card-preview>
                </div>
            </div>
        `;
    }
}
