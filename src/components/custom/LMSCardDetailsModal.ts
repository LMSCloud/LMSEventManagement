import {
    faArrowRight,
    faCalendar,
    faCalendarPlus,
    faCreditCard,
    faInfoCircle,
    faMapMarker,
    faUserPlus,
    faUsers,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import DOMPurify from "dompurify";
import { LitElement, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { match } from "ts-pattern";
import { requestHandler } from "../../lib/RequestHandler/RequestHandler";
import { splitDateTime } from "../../lib/converters/datetimeConverters";
import {
    formatAddress,
    formatMonetaryAmountByLocale,
} from "../../lib/converters/displayConverters";
import { __, attr__ } from "../../lib/translate";
import { skeletonStyles } from "../../styles/skeleton";
import { tailwindStyles } from "../../tailwind.lit";
import {
    LMSEvent,
    LMSEventComprehensive,
    LMSEventTargetGroupFee,
    LMSEventType,
    LMSLocation,
} from "../../types/common";

@customElement("lms-card-details-modal")
export default class LMSCardDetailsModal extends LitElement {
    @property({ type: Object }) event?: LMSEvent | LMSEventComprehensive;

    @property({ type: Boolean }) isOpen = false;

    @state() state: "initial" | "pending" | "success" | "error" = "initial";

    @state() event_types?: Array<LMSEventType>;

    @state() locations?: Array<LMSLocation>;

    @state() target_groups?: Array<LMSEventTargetGroupFee>;

    @state() locale = "en";

    @state() localeFull = "en-US";

    @query(".close") closeButton!: HTMLButtonElement;

    @query("#lms-modal") lmsModal!: HTMLDialogElement;

    private boundHandleKeyDown = (e: KeyboardEvent) =>
        this.handleKeyDown.bind(this)(e);

    static override styles = [tailwindStyles, skeletonStyles];

    override connectedCallback() {
        super.connectedCallback();

        Promise.all([
            requestHandler
                .get({ endpoint: "eventTypesPublic" })
                .then((response) => response.json()),
            requestHandler
                .get({ endpoint: "locationsPublic" })
                .then((response) => response.json()),
            requestHandler
                .get({ endpoint: "targetGroupsPublic" })
                .then((response) => response.json()),
        ])
            .then(([eventTypes, locations, targetGroups]) => {
                this.event_types = eventTypes as LMSEventType[];
                this.locations = locations as LMSLocation[];
                this.target_groups = targetGroups as LMSEventTargetGroupFee[];

                this.locale = document.documentElement.lang;
                this.localeFull =
                    document.documentElement.lang === "en"
                        ? "en-US"
                        : document.documentElement.lang;
                this.state = "success";
            })
            .catch((error) => {
                this.state = "error";
                console.error(error);
            });

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
        if (!this.event) {
            return;
        }

        const { event_type, location } = this.event;
        if (
            !(event_type && typeof event_type === "number") ||
            !(location && typeof location === "number")
        ) {
            return;
        }

        this.updateEventType(event_type);
        this.updateLocation(location);
        this.updateTargetGroups();
    }

    private updateEventType(event_type: number) {
        if (!event_type || !this.event_types) {
            return;
        }

        const fullEventType = this.event_types.find(
            (_event_type) => _event_type.id === event_type
        );
        if (fullEventType && this.event) {
            this.event.event_type = fullEventType;
        }
    }

    private updateLocation(location: number) {
        if (!location || !this.locations) {
            return;
        }

        const fullLocation = this.locations.find(
            (_location) => _location.id === location
        );
        if (fullLocation && this.event) {
            this.event.location = fullLocation;
        }
    }

    private updateTargetGroups() {
        if (!this.event?.hasOwnProperty("target_groups")) {
            return;
        }

        const comprehensiveEvent = this.event as LMSEventComprehensive;
        const target_groups = comprehensiveEvent.target_groups;

        if (!target_groups || !this.target_groups) {
            return;
        }

        const selectedTargetGroups = this.target_groups.filter((target_group) =>
            target_groups.some(
                (targetGroup: LMSEventTargetGroupFee) =>
                    targetGroup.target_group_id === target_group.id
            )
        );

        comprehensiveEvent.target_groups = selectedTargetGroups.map(
            (selectedTargetGroup) => {
                const targetGroup = target_groups.find(
                    (eventTargetGroup) =>
                        eventTargetGroup.target_group_id ===
                        selectedTargetGroup.id
                );
                return {
                    ...selectedTargetGroup,
                    selected: targetGroup?.selected ?? false,
                    fee: targetGroup?.fee ?? 0,
                };
            }
        ) as LMSEventTargetGroupFee[];
    }

    override updated() {
        if (this.isOpen && this.closeButton) {
            this.closeButton.focus();
        }
    }

    private getSelectedQuantity(
        targetGroupFees: LMSEventTargetGroupFee[] | null
    ) {
        if (!targetGroupFees) {
            return 0;
        }

        return targetGroupFees?.filter(
            (targetGroupFee) => targetGroupFee.selected
        ).length;
    }

    private renderTargetGroupInfo(
        targetGroupFees: LMSEventTargetGroupFee[],
        hasNoFees: boolean
    ) {
        if (!targetGroupFees) {
            return nothing;
        }

        const quantity = this.getSelectedQuantity(targetGroupFees);
        return targetGroupFees
            .filter(
                (targetGroupFee) =>
                    targetGroupFee.selected &&
                    !targetGroupFee["target_group_id"]
            )
            .map((targetGroupFee, index) => {
                const { name, min_age, max_age, fee } = targetGroupFee;
                return hasNoFees
                    ? html`<span
                          >${name}${index + 1 < quantity ? ", " : ""}</span
                      >`
                    : html`
                          <tr>
                              <td>${name}</td>
                              <td>${min_age} - ${max_age}</td>
                              <td>
                                  ${formatMonetaryAmountByLocale(
                                      this.localeFull,
                                      fee
                                  )}
                              </td>
                          </tr>
                      `;
            });
    }

    private renderDateAndTime(start_time: Date | null, end_time: Date | null) {
        const [sDate, sTime] = splitDateTime(start_time, this.locale);
        const [eDate, eTime] = splitDateTime(end_time, this.locale);
        const isSameDay = sDate === eDate;
        return html`${sDate}, ${sTime}
        ${isSameDay
            ? html`- ${eTime}`
            : html` <span
                      >${litFontawesome(faArrowRight, {
                          className: "w-4 h-4 inline-block",
                      })}</span
                  >
                  ${eDate}, ${eTime}`}`;
    }

    private renderLocationLink(location: LMSLocation | number | null) {
        if (typeof location === "number") {
            return nothing;
        }

        const link = location?.link;
        if (!link) {
            return nothing;
        }

        const protocol = "https";
        const urlRegex = new RegExp(
            `^${protocol}:\\/\\/[\\S\\/.$?#][\\S]*$`,
            "i"
        );

        const isValid = urlRegex.test(link);
        const isValidWithProtocol = urlRegex.test(`${protocol}://${link}`);
        if (!isValid && !isValidWithProtocol) {
            return nothing;
        }

        const url =
            !isValid && isValidWithProtocol
                ? new URL(`${protocol}://${link}`)
                : new URL(link);
        return html`<a
            class="link-hover link-neutral link text-sm"
            href=${url?.href}
            target="_blank"
            >${__("Directions to the venue by")} ${url?.hostname}</a
        >`;
    }

    private hasNoFees(targetGroups: LMSEventTargetGroupFee[]) {
        return (
            targetGroups?.every((targetGroup) => targetGroup.fee === 0) ?? true
        );
    }

    private extractTargetGroups(event: LMSEvent | LMSEventComprehensive) {
        return {}.hasOwnProperty.call(event, "target_groups")
            ? (event as LMSEventComprehensive).target_groups
            : undefined;
    }

    private async handleExportIcal() {
        if (!this.event?.id) {
            return;
        }

        try {
            const response = await requestHandler.get({
                endpoint: "eventIcalPublic",
                path: [this.event.id.toString(), "ical"],
            });

            if (!response.ok) {
                throw new Error("Failed to export calendar event");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `event-${this.event.id}.ics`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error exporting calendar event:", error);
        }
    }

    override render() {
        const targetGroups = this.event
            ? this.extractTargetGroups(this.event)
            : undefined;
        const hasNoFees = targetGroups ? this.hasNoFees(targetGroups) : true;
        if (this.isOpen && !this.lmsModal?.open) {
            this.lmsModal?.showModal();
        }

        return html`
            <dialog
                class="modal"
                id="lms-modal"
                aria-labelledby="lms-modal-title"
            >
                ${match(this.state)
                    .with(
                        "initial",
                        "pending",
                        () =>
                            html`
                                <form
                                    method="dialog"
                                    class="modal-box w-11/12 max-w-5xl"
                                >
                                    <h5
                                        class="text-lg font-bold"
                                        id="lms-modal-title"
                                    >
                                        ${__("Loading Details...")}
                                    </h5>
                                    <button
                                        @click=${this.toggleModal}
                                        class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <div
                                        class="flex items-center justify-center"
                                    >
                                        <span
                                            class="loading loading-spinner loading-lg"
                                        ></span>
                                    </div>
                                    <div class="modal-action">
                                        <button
                                            class="btn btn-secondary"
                                            @click=${this.toggleModal}
                                        >
                                            ${__("Close")}
                                        </button>
                                    </div>
                                </form>
                            `
                    )
                    .with(
                        "success",
                        () => html`
                            <form
                                method="dialog"
                                class="modal-box w-11/12 max-w-5xl prose"
                            >
                                <h5
                                    class="text-lg font-bold"
                                    id="lms-modal-title"
                                >
                                    ${this.event?.name ?? "Event"}
                                </h5>
                                <button
                                    @click=${this.toggleModal}
                                    class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <div class="flex flex-col md:flex-row">
                                    <!-- Left Column -->
                                    <div class="w-full md:w-1/2">
                                        <!-- Date and Time -->
                                        <div class="p-4">
                                            <p class="mb-2 flex items-center gap-1">
                                                <span
                                                    >${litFontawesome(
                                                        faCalendar,
                                                        {
                                                            className:
                                                                "w-4 h-4",
                                                        }
                                                    )}</span
                                                >
                                                <strong
                                                    >${__(
                                                        "Date and Time"
                                                    )}</strong
                                                >
                                            </p>
                                            <p>
                                                ${this.event
                                                    ? this.renderDateAndTime(
                                                          this.event.start_time,
                                                          this.event.end_time
                                                      )
                                                    : nothing}
                                            </p>
                                        </div>

                                        <!-- Description -->
                                        <div class="p-4">
                                            <p class="mb-2 flex items-center gap-1">
                                                <span
                                                    >${litFontawesome(
                                                        faInfoCircle,
                                                        {
                                                            className:
                                                                "w-4 h-4",
                                                        }
                                                    )}</span
                                                >
                                                <strong
                                                    >${__(
                                                        "Description"
                                                    )}</strong
                                                >
                                            </p>
                                            <div>
                                                ${unsafeHTML(
                                                    DOMPurify.sanitize(
                                                        this.event
                                                            ?.description ?? ""
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Right Column -->
                                    <div class="w-full md:w-1/2">
                                        <img
                                            src=${ifDefined(
                                                this.event?.image ?? undefined
                                            )}
                                            class="${classMap({
                                                hidden: !this.event?.image,
                                            })} aspect-video w-full rounded object-cover"
                                        />

                                        <!-- Fees -->
                                        <div class="p-4">
                                            <p class="mb-2 flex items-center gap-1">
                                                <span
                                                    >${litFontawesome(
                                                        faCreditCard,
                                                        {
                                                            className:
                                                                "w-4 h-4",
                                                        }
                                                    )}</span
                                                >
                                                <strong>${__("Fees")}</strong>
                                            </p>

                                            <div
                                                class="${classMap({
                                                    hidden: !hasNoFees,
                                                })}"
                                            >
                                                <p class="mb-2">
                                                    ${__("No fees")}
                                                </p>
                                                <p class="mb-2 flex items-center gap-1">
                                                    <span
                                                        >${litFontawesome(
                                                            faUsers,
                                                            {
                                                                className:
                                                                    "w-4 h-4",
                                                            }
                                                        )}</span
                                                    >
                                                    <strong
                                                        >${__(
                                                            "Target Groups"
                                                        )}</strong
                                                    >
                                                </p>
                                                <p>
                                                    ${this.renderTargetGroupInfo(
                                                        targetGroups as LMSEventTargetGroupFee[],
                                                        hasNoFees
                                                    )}
                                                </p>
                                            </div>

                                            <table
                                                class="${classMap({
                                                    hidden: hasNoFees,
                                                })} table table-xs"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            ${__(
                                                                "Target Group"
                                                            )}
                                                        </th>
                                                        <th>
                                                            ${__("Age Range")}
                                                        </th>
                                                        <th>${__("Fee")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${this.renderTargetGroupInfo(
                                                        targetGroups as LMSEventTargetGroupFee[],
                                                        hasNoFees
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="p-4">
                                            <p class="mb-2 flex items-center gap-1">
                                                <span
                                                    >${litFontawesome(
                                                        faMapMarker,
                                                        {
                                                            className:
                                                                "w-4 h-4",
                                                        }
                                                    )}</span
                                                >
                                                <strong
                                                    >${__("Location")}</strong
                                                >
                                            </p>
                                            <p class="mb-2">
                                                ${this.event
                                                    ? formatAddress(
                                                          this.event.location
                                                      )
                                                    : nothing}
                                            </p>
                                            <p>
                                                ${this.event
                                                    ? this.renderLocationLink(
                                                          this.event.location
                                                      )
                                                    : nothing}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-action flex-wrap">
                                    <button
                                        class="btn btn-secondary"
                                        @click=${this.toggleModal}
                                        title=${attr__("Close")}
                                        aria-label=${attr__("Close")}
                                    >
                                        ${litFontawesome(faXmark, {
                                            className: "w-4 h-4 sm:mr-2",
                                        })}
                                        <span class="hidden sm:inline"
                                            >${__("Close")}</span
                                        >
                                    </button>
                                    <button
                                        class="btn btn-neutral"
                                        @click=${this.handleExportIcal}
                                        title=${attr__("Export to Calendar")}
                                        aria-label=${attr__("Export to Calendar")}
                                    >
                                        ${litFontawesome(faCalendarPlus, {
                                            className: "w-4 h-4 sm:mr-2",
                                        })}
                                        <span class="hidden sm:inline"
                                            >${__("Export to Calendar")}</span
                                        >
                                    </button>
                                    <a
                                        class="${classMap({
                                            hidden: !this.event
                                                ?.registration_link,
                                        })} btn btn-primary"
                                        href=${ifDefined(
                                            this.event?.registration_link ??
                                                undefined
                                        )}
                                        title=${attr__("Register")}
                                        aria-label=${attr__("Register")}
                                    >
                                        ${litFontawesome(faUserPlus, {
                                            className: "w-4 h-4 sm:mr-2",
                                        })}
                                        <span class="hidden sm:inline"
                                            >${__("Register")}</span
                                        >
                                    </a>
                                </div>
                            </form>
                        `
                    )
                    .with(
                        "error",
                        () => html` <form
                            method="dialog"
                            class="modal-box w-11/12 max-w-5xl"
                        >
                            <h5 class="text-lg font-bold" id="lms-modal-title">
                                ${__("There's been an error")}..
                            </h5>
                            <button
                                @click=${this.toggleModal}
                                class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <div class="modal-action">
                                <button
                                    class="btn btn-secondary"
                                    @click=${this.toggleModal}
                                >
                                    ${__("Close")}
                                </button>
                            </div>
                        </form>`
                    )
                    .exhaustive()}
            </dialog>
        `;
    }
}
