import {
    faArrowRight,
    faCalendar,
    faCreditCard,
    faInfoCircle,
    faMapMarker,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import DOMPurify from "dompurify";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { formatAddress, splitDateTime } from "../lib/converters";
import { __ } from "../lib/translate";
import {
    LMSEvent,
    LMSEventComprehensive,
    LMSEventTargetGroupFee,
    LMSEventType,
    LMSLocation,
} from "../sharedDeclarations";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-card-details-modal")
export default class LMSCardDetailsModal extends LitElement {
    @property({ type: Object }) event: LMSEvent | LMSEventComprehensive =
        {} as LMSEvent;

    @property({ type: Boolean }) isOpen = false;

    @state() event_types: LMSEventType[] = [];

    @state() locations: LMSLocation[] = [];

    @state() target_groups: LMSEventTargetGroupFee[] = [];

    @state() locale = "en";

    @query(".close") closeButton!: HTMLButtonElement;

    @query("#lms-modal") lmsModal!: HTMLDialogElement;

    private boundHandleKeyDown = (e: KeyboardEvent) =>
        this.handleKeyDown.bind(this)(e);

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        css`
            svg {
                display: inline-block;
                width: 1em;
                height: 1em;
                color: #6c757d;
            }
        `,
    ];

    override connectedCallback() {
        super.connectedCallback();

        const event_types = async () => {
            const response = await fetch(
                "/api/v1/contrib/eventmanagement/public/event_types"
            );
            return response.json();
        };
        event_types().then(
            (event_types: LMSEventType[]) => (this.event_types = event_types)
        );

        const locations = async () => {
            const response = await fetch(
                "/api/v1/contrib/eventmanagement/public/locations"
            );
            return response.json();
        };
        locations().then(
            (locations: LMSLocation[]) => (this.locations = locations)
        );

        const target_groups = async () => {
            const response = await fetch(
                "/api/v1/contrib/eventmanagement/public/target_groups"
            );
            return response.json();
        };
        target_groups().then(
            (target_groups: LMSEventTargetGroupFee[]) =>
                (this.target_groups = target_groups)
        );

        this.locale = document.documentElement.lang;

        document.addEventListener("keydown", this.boundHandleKeyDown);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("keydown", this.boundHandleKeyDown);
    }

    private toggleModal() {
        const { renderRoot } = this;
        this.isOpen = !this.isOpen;
        document.body.style.overflow = this.isOpen ? "hidden" : "auto";
        const lmsModal = (renderRoot as ShadowRoot).getElementById("lms-modal");
        if (lmsModal) {
            lmsModal.style.overflowY = this.isOpen ? "scroll" : "auto";
        }

        if (!this.isOpen) {
            this.dispatchEvent(
                new CustomEvent("close", {
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }

    private handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape" && this.isOpen) {
            this.toggleModal();
        }
    }

    override willUpdate() {
        const { event } = this;
        const { event_type, location } = event;

        let target_groups: LMSEventTargetGroupFee[] | null = null;
        if ({}.hasOwnProperty.call(event, "target_groups")) {
            const comprehensiveEvent = event as LMSEventComprehensive;
            target_groups = comprehensiveEvent.target_groups;
        }

        // Resolve event_type and location ids to their state representations
        if (event_type) {
            const fullEventType = this.event_types.find(
                (_event_type) => _event_type.id === event_type
            );
            this.event.event_type = fullEventType ?? ({} as LMSEventType);
        }

        if (location) {
            const fullLocation = this.locations.find(
                (_location) => _location.id === location
            );
            this.event.location = fullLocation ?? ({} as LMSLocation);
        }

        const isTruthyAndIsComprehensiveEvent =
            target_groups &&
            (target_groups as LMSEventTargetGroupFee[]).every(
                (targetGroup: LMSEventTargetGroupFee) =>
                    ({}.hasOwnProperty.call(targetGroup, "target_group_id"))
            );
        if (isTruthyAndIsComprehensiveEvent) {
            const eventComprehensive = this.event as LMSEventComprehensive;
            const selectedTargetGroups = this.target_groups.filter(
                (target_group) =>
                    target_groups?.some(
                        (targetGroup: LMSEventTargetGroupFee) =>
                            targetGroup.target_group_id === target_group.id
                    )
            );

            eventComprehensive.target_groups = selectedTargetGroups.map(
                (selectedTargetGroup) => ({
                    ...selectedTargetGroup,
                    selected:
                        target_groups?.find(
                            (eventTargetGroup) =>
                                eventTargetGroup.target_group_id ===
                                selectedTargetGroup.id
                        )?.selected ?? false,
                    fee:
                        target_groups?.find(
                            (eventTargetGroup) =>
                                eventTargetGroup.target_group_id ===
                                selectedTargetGroup.id
                        )?.fee ?? 0,
                })
            ) as LMSEventTargetGroupFee[];
        }
    }

    override updated() {
        if (this.isOpen && this.closeButton) {
            this.closeButton.focus();
        }
    }

    private getSelectedQuantity(
        targetGroupFees: LMSEventTargetGroupFee[] | null
    ) {
        if (!targetGroupFees) return 0;
        return targetGroupFees?.filter(
            (targetGroupFee) => targetGroupFee.selected
        ).length;
    }

    private renderTargetGroupInfo(
        targetGroupFees: LMSEventTargetGroupFee[],
        noFees: boolean
    ) {
        const quantity = this.getSelectedQuantity(targetGroupFees);
        return targetGroupFees
            ? targetGroupFees.map((targetGroupFee, index) => {
                const hasTargetGroupId = {}.hasOwnProperty.call(
                    targetGroupFee,
                    "target_group_id"
                );
                if (hasTargetGroupId) return nothing;

                const { name, min_age, max_age, fee, selected } =
                    targetGroupFee as LMSEventTargetGroupFee;

                if (!selected) return nothing;
                return noFees
                    ? html`<span
                            >${name}${index + 1 < quantity ? ", " : ""}</span
                        >`
                    : html`
                            <tr>
                                <td>${name}</td>
                                <td>${min_age} - ${max_age}</td>
                                <td>${fee}</td>
                            </tr>
                        `;
            })
            : nothing;
    }

    override render() {
        const {
            name,
            description,
            location,
            image,
            registration_link,
            start_time,
            end_time,
        } = this.event;

        let target_groups = null;
        if ({}.hasOwnProperty.call(this.event, "target_groups")) {
            const eventComprehensive = this.event as LMSEventComprehensive;
            target_groups = eventComprehensive.target_groups;
        }

        let noFees = true;
        if (target_groups) {
            noFees =
                target_groups?.every(
                    (target_group) => target_group.fee === 0
                ) ?? true;
        }

        const [sDate, sTime] = splitDateTime(start_time, this.locale);
        const [eDate, eTime] = splitDateTime(end_time, this.locale);
        const isSameDay = sDate === eDate;

        if (this.isOpen && !this.lmsModal.open) this.lmsModal.showModal();
        return html`
            <dialog
                class="modal"
                id="lms-modal"
                aria-labelledby="lms-modal-title"
            >
                <form method="dialog" class="modal-box w-11/12 max-w-5xl">
                    <h5 class="text-lg font-bold" id="lms-modal-title">
                        ${name ?? "Event"}
                    </h5>
                    <button
                        @click=${this.toggleModal}
                        class="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="flex">
                        <div class="w-1/2">
                            <p>
                                <span>${litFontawesome(faCalendar)}</span>
                                <strong>${__("Date and Time")}</strong>
                            </p>
                            <p>
                                ${sDate}, ${sTime}
                                ${isSameDay
                ? html`- ${eTime}`
                : html` <span
                                              >${litFontawesome(
                    faArrowRight
                )}</span
                                          >
                                          ${eDate}, ${eTime}`}
                            </p>

                            <p class="wrapper">
                                <span>${litFontawesome(faInfoCircle)}</span>
                                <strong>${__("Description")}</strong>
                            </p>
                            <p>
                                ${unsafeHTML(
                    DOMPurify.sanitize(description ?? "")
                )}
                            </p>
                        </div>
                        <div class="w-1/2">
                            <img
                                src=${ifDefined(image ?? undefined)}
                                ?hidden=${!image}
                                class="mb-4 aspect-video w-full rounded object-cover"
                            />

                            <div>
                                <p>
                                    <span>${litFontawesome(faCreditCard)}</span>
                                    <strong>${__("Fees")}</strong>
                                </p>
                                <div
                                    class=${classMap({
                    hidden: !noFees,
                })}
                                >
                                    <p>${__("No fees")}</p>
                                    <p>
                                        <span>${litFontawesome(faUsers)}</span>
                                        <strong>${__("Target Groups")}</strong>
                                    </p>
                                    <p>
                                        ${this.renderTargetGroupInfo(
                    target_groups as LMSEventTargetGroupFee[],
                    noFees
                )}
                                    </p>
                                </div>
                                <table
                                    class="${classMap({
                    hidden: noFees,
                })} table"
                                >
                                    <thead>
                                        <tr>
                                            <th>${__("Target Group")}</th>
                                            <th>${__("Age Range")}</th>
                                            <th>${__("Fee")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${this.renderTargetGroupInfo(
                    target_groups as LMSEventTargetGroupFee[],
                    noFees
                )}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <p>
                                    <span>${litFontawesome(faMapMarker)}</span>
                                    <strong>${__("Location")}</strong>
                                </p>
                                <p>${formatAddress(location)}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-action">
                        <button
                            class="btn-secondary btn"
                            @click=${this.toggleModal}
                        >
                            ${__("Close")}
                        </button>
                        <a
                            class="btn-primary btn"
                            ?hidden=${!registration_link}
                            href=${ifDefined(registration_link ?? undefined)}
                        >
                            ${__("Register")}
                        </a>
                    </div>
                </form>
            </dialog>
        `;
    }
}
