import {
    faArrowLeft,
    faCalendarAlt,
    faExclamationCircle,
    faMapMarkerAlt,
    faPlus,
    faTrash,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { match } from "ts-pattern";
import { splitDateTime } from "../lib/converters/datetimeConverters";
import { formatMonetaryAmountByLocale } from "../lib/converters/displayConverters";
import { buildOpacUrl } from "../lib/opacUrl";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { __, attr__ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import { LMSLocation, LMSTargetGroup } from "../types/common";

const MAX_ATTENDEES = 10;

type FeeRow = {
    id: number;
    event_id: number;
    target_group_id: number;
    selected: boolean | number;
    fee: number | null;
};

type EventResponse = {
    id: number;
    name: string | null;
    description: string | null;
    start_time: string | Date | null;
    end_time: string | Date | null;
    location: number | null;
    image: string | null;
    status: string | null;
    max_participants: number | null;
    open_registration: boolean | number | null;
    target_groups: Array<FeeRow>;
};

type HouseholdMember = {
    borrowernumber: number;
    name: string;
    dob: string | null;
    age: number | null;
    suggested_target_group: { id: number; name: string } | null;
};

type AttendeeRow = {
    uid: string;
    source: "household" | "adhoc";
    selected: boolean;
    name: string;
    borrowernumber: number | null;
    dob: string | null;
    age: number | null;
    target_group_id: number | null;
};

let _uid = 0;
const nextUid = () => `a${++_uid}`;

@customElement("lms-event-booking-page")
export default class LMSEventBookingPage extends LitElement {
    @property({ type: String, attribute: "event-id" }) eventId?: string;

    @property({ type: String }) borrowernumber?: string;

    @state() private state:
        | "loading"
        | "loaded"
        | "submitting"
        | "submitted"
        | "load-error" = "loading";

    @state() private event?: EventResponse;

    @state() private targetGroups: Array<LMSTargetGroup> = [];

    @state() private location?: LMSLocation;

    @state() private attendees: Array<AttendeeRow> = [];

    @state() private bookerName = "";

    @state() private bookerEmail = "";

    @state() private submitError: string | null = null;

    @state() private locale = "en";

    @state() private localeFull = "en-US";

    static override styles = [tailwindStyles, skeletonStyles];

    private get isAuthenticated(): boolean {
        return Boolean(this.borrowernumber);
    }

    private get selectedAttendees(): Array<AttendeeRow> {
        return this.attendees.filter((a) => a.selected);
    }

    private get total(): number {
        return this.selectedAttendees.reduce(
            (sum, a) => sum + this.feeFor(a.target_group_id),
            0,
        );
    }

    private get hasPaidSeats(): boolean {
        return this.selectedAttendees.some(
            (a) => this.feeFor(a.target_group_id) > 0,
        );
    }

    private get canSubmit(): boolean {
        if (this.state !== "loaded") return false;
        if (!this.eventId || !this.event) return false;
        if (this.selectedAttendees.length === 0) return false;
        if (this.selectedAttendees.length > MAX_ATTENDEES) return false;
        if (this.selectedAttendees.some((a) => !a.name || !a.target_group_id)) {
            return false;
        }
        if (!this.isAuthenticated) {
            if (!this.bookerName || !this.bookerEmail) return false;
            if (this.hasPaidSeats) return false;
        }
        return true;
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.locale = document.documentElement.lang.slice(0, 2);
        this.localeFull =
            document.documentElement.lang === "en"
                ? "en-US"
                : document.documentElement.lang;
        this.loadAll();
    }

    private async loadAll(): Promise<void> {
        if (!this.eventId) {
            this.state = "load-error";
            return;
        }
        this.state = "loading";
        try {
            const eventResp = await requestHandler.get({
                endpoint: "eventPublic",
                path: [this.eventId],
            });
            if (!eventResp.ok) {
                throw new Error(`event fetch failed: ${eventResp.status}`);
            }
            this.event = (await eventResp.json()) as EventResponse;

            const offeredIds = new Set(
                this.event.target_groups
                    .filter((tg) => Boolean(tg.selected))
                    .map((tg) => tg.target_group_id),
            );

            const tgResp = await requestHandler.get({
                endpoint: "targetGroupsPublic",
            });
            if (!tgResp.ok) {
                throw new Error(`target groups fetch failed: ${tgResp.status}`);
            }
            const allTgs = (await tgResp.json()) as Array<LMSTargetGroup>;
            this.targetGroups = allTgs.filter((tg) => offeredIds.has(tg.id));

            if (this.event.location !== null) {
                try {
                    const locResp = await requestHandler.get({
                        endpoint: "locationsPublic",
                    });
                    if (locResp.ok) {
                        const locs =
                            (await locResp.json()) as Array<LMSLocation>;
                        this.location = locs.find(
                            (l) => l.id === this.event!.location,
                        );
                    }
                } catch (_e) {
                    // Location is decorative; ignore failures.
                }
            }

            if (this.isAuthenticated) {
                const householdResp = await requestHandler.get({
                    endpoint: "bookingHouseholdPublic",
                    query: { event_id: this.eventId },
                });
                if (householdResp.ok) {
                    const members =
                        (await householdResp.json()) as Array<HouseholdMember>;
                    this.attendees = members.map((m, i) => ({
                        uid: nextUid(),
                        source: "household",
                        selected: i === 0,
                        name: m.name,
                        borrowernumber: m.borrowernumber,
                        dob: m.dob,
                        age: m.age,
                        target_group_id: m.suggested_target_group?.id ?? null,
                    }));
                }
            }

            this.state = "loaded";
        } catch (err) {
            console.error(err);
            this.state = "load-error";
        }
    }

    private feeFor(targetGroupId: number | null): number {
        if (!targetGroupId || !this.event) return 0;
        const row = this.event.target_groups.find(
            (tg) =>
                tg.target_group_id === targetGroupId && Boolean(tg.selected),
        );
        return row?.fee ?? 0;
    }

    private updateAttendee(uid: string, patch: Partial<AttendeeRow>): void {
        this.attendees = this.attendees.map((a) =>
            a.uid === uid ? { ...a, ...patch } : a,
        );
    }

    private handleToggle(uid: string, e: Event): void {
        const checked = (e.target as HTMLInputElement).checked;
        this.updateAttendee(uid, { selected: checked });
    }

    private handleNameInput(uid: string, e: Event): void {
        const value = (e.target as HTMLInputElement).value;
        this.updateAttendee(uid, { name: value });
    }

    private handleDobInput(uid: string, e: Event): void {
        const value = (e.target as HTMLInputElement).value || null;
        this.updateAttendee(uid, { dob: value });
    }

    private handleTargetGroupChange(uid: string, e: Event): void {
        const raw = (e.target as HTMLSelectElement).value;
        const id = raw ? Number(raw) : null;
        this.updateAttendee(uid, { target_group_id: id });
    }

    private addAdhoc(): void {
        if (this.attendees.length >= MAX_ATTENDEES) return;
        const defaultTg = this.targetGroups[0]?.id ?? null;
        this.attendees = [
            ...this.attendees,
            {
                uid: nextUid(),
                source: "adhoc",
                selected: true,
                name: "",
                borrowernumber: null,
                dob: null,
                age: null,
                target_group_id: defaultTg,
            },
        ];
    }

    private removeAdhoc(uid: string): void {
        this.attendees = this.attendees.filter((a) => a.uid !== uid);
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();
        if (!this.canSubmit || !this.event) return;
        this.state = "submitting";
        this.submitError = null;

        const body: Record<string, unknown> = {
            event_id: this.event.id,
            attendees: this.selectedAttendees.map((a) => ({
                name: a.name,
                target_group_id: a.target_group_id,
                borrowernumber: a.borrowernumber,
                dob: a.dob,
            })),
        };
        if (!this.isAuthenticated) {
            body["booker"] = {
                name: this.bookerName,
                email: this.bookerEmail,
            };
        }

        try {
            const resp = await requestHandler.post({
                endpoint: "bookingsPublic",
                requestInit: {
                    method: "post",
                    body: JSON.stringify(body),
                },
            });
            if (!resp.ok) {
                const data = (await resp.json().catch(() => ({}))) as {
                    error?: string;
                };
                this.submitError = data.error ?? `error ${resp.status}`;
                this.state = "loaded";
                return;
            }
            this.state = "submitted";
        } catch (err) {
            console.error(err);
            this.submitError = `${err}`;
            this.state = "loaded";
        }
    }

    private renderEventHeader() {
        if (!this.event) return nothing;
        const [sDate, sTime] = splitDateTime(
            this.event.start_time,
            this.locale,
        );
        const [eDate, eTime] = splitDateTime(this.event.end_time, this.locale);
        const sameDay = sDate === eDate;
        return html`
            <header class="mb-6">
                <a
                    href=${buildOpacUrl({})}
                    class="link-hover link-neutral link mb-2 inline-flex items-center gap-1 text-sm"
                >
                    ${litFontawesome(faArrowLeft, {
                        className: "w-3 h-3 inline-block",
                    })}
                    ${__("Back to events")}
                </a>
                <h1 class="text-2xl font-bold">${this.event.name}</h1>
                <div
                    class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/70"
                >
                    <span class="inline-flex items-center gap-1">
                        ${litFontawesome(faCalendarAlt, {
                            className: "w-4 h-4 inline-block",
                        })}
                        ${sDate}, ${sTime}
                        ${sameDay
                            ? html`– ${eTime}`
                            : html`– ${eDate}, ${eTime}`}
                    </span>
                    ${this.location
                        ? html`<span class="inline-flex items-center gap-1">
                              ${litFontawesome(faMapMarkerAlt, {
                                  className: "w-4 h-4 inline-block",
                              })}
                              ${this.location.name}
                          </span>`
                        : nothing}
                </div>
            </header>
        `;
    }

    private renderAttendeeRow(a: AttendeeRow) {
        const fee = this.feeFor(a.target_group_id);
        const isHousehold = a.source === "household";
        const ageSuffix =
            isHousehold && a.age !== null
                ? html` <span class="text-xs text-base-content/60"
                      >· ${a.age} ${__("years")}</span
                  >`
                : nothing;
        return html`
            <div
                class="flex flex-col gap-3 rounded-lg border border-base-300 p-3 sm:flex-row sm:items-center sm:gap-4"
            >
                <label class="flex flex-1 items-center gap-3">
                    <input
                        type="checkbox"
                        class="checkbox checkbox-sm"
                        .checked=${a.selected}
                        @change=${(e: Event) => this.handleToggle(a.uid, e)}
                    />
                    ${isHousehold
                        ? html`<div class="flex flex-col">
                              <span class="font-medium">${a.name}</span>
                              ${ageSuffix}
                          </div>`
                        : html`<div
                              class="flex w-full flex-col gap-2 sm:flex-row"
                          >
                              <input
                                  type="text"
                                  class="input input-bordered input-sm flex-1"
                                  placeholder=${attr__("Attendee name")}
                                  aria-label=${attr__("Attendee name")}
                                  .value=${a.name}
                                  @input=${(e: Event) =>
                                      this.handleNameInput(a.uid, e)}
                                  required
                              />
                              <input
                                  type="date"
                                  class="input input-bordered input-sm"
                                  aria-label=${attr__("Date of birth")}
                                  .value=${a.dob ?? ""}
                                  @input=${(e: Event) =>
                                      this.handleDobInput(a.uid, e)}
                              />
                          </div>`}
                </label>
                <select
                    class="select select-bordered select-sm"
                    aria-label=${attr__("Target group")}
                    .value=${a.target_group_id?.toString() ?? ""}
                    @change=${(e: Event) =>
                        this.handleTargetGroupChange(a.uid, e)}
                    ?disabled=${!a.selected}
                >
                    <option value="" disabled>
                        ${__("Select target group")}
                    </option>
                    ${repeat(
                        this.targetGroups,
                        (tg) => tg.id,
                        (tg) =>
                            html`<option
                                value=${tg.id}
                                ?selected=${tg.id === a.target_group_id}
                            >
                                ${tg.name}
                            </option>`,
                    )}
                </select>
                <span class="min-w-[5rem] text-right text-sm tabular-nums">
                    ${fee > 0
                        ? formatMonetaryAmountByLocale(this.localeFull, fee)
                        : __("Free")}
                </span>
                ${!isHousehold
                    ? html`<button
                          type="button"
                          class="btn btn-ghost btn-sm"
                          aria-label=${attr__("Remove attendee")}
                          title=${attr__("Remove attendee")}
                          @click=${() => this.removeAdhoc(a.uid)}
                      >
                          ${litFontawesome(faTrash, {
                              className: "w-4 h-4",
                          })}
                      </button>`
                    : nothing}
            </div>
        `;
    }

    private renderBookerFields() {
        if (this.isAuthenticated) return nothing;
        return html`
            <fieldset class="mb-6 rounded-lg border border-base-300 p-4">
                <legend class="px-2 text-sm font-semibold">
                    ${__("Your contact details")}
                </legend>
                <div class="mt-2 grid gap-3 sm:grid-cols-2">
                    <label class="form-control">
                        <span class="label-text mb-1">${__("Name")}</span>
                        <input
                            type="text"
                            class="input input-bordered input-sm"
                            .value=${this.bookerName}
                            @input=${(e: Event) =>
                                (this.bookerName = (
                                    e.target as HTMLInputElement
                                ).value)}
                            required
                        />
                    </label>
                    <label class="form-control">
                        <span class="label-text mb-1">${__("Email")}</span>
                        <input
                            type="email"
                            class="input input-bordered input-sm"
                            .value=${this.bookerEmail}
                            @input=${(e: Event) =>
                                (this.bookerEmail = (
                                    e.target as HTMLInputElement
                                ).value)}
                            required
                        />
                    </label>
                </div>
                ${this.hasPaidSeats
                    ? html`<div class="alert alert-warning mt-3 text-sm">
                          ${litFontawesome(faExclamationCircle, {
                              className: "w-4 h-4",
                          })}
                          <span
                              >${__(
                                  "Anonymous bookings cannot include paid attendees. Log in or select a free target group.",
                              )}</span
                          >
                      </div>`
                    : nothing}
            </fieldset>
        `;
    }

    private renderForm() {
        if (!this.event) return nothing;
        const cap = this.event.max_participants;
        return html`
            <form @submit=${this.handleSubmit} class="space-y-6">
                ${this.renderEventHeader()} ${this.renderBookerFields()}
                <section>
                    <div class="mb-3 flex items-center justify-between">
                        <h2 class="text-lg font-semibold">
                            ${__("Attendees")}
                        </h2>
                        <span class="text-xs text-base-content/60">
                            ${this.selectedAttendees.length} / ${MAX_ATTENDEES}
                            ${cap
                                ? html`· ${__("event capacity")} ${cap}`
                                : nothing}
                        </span>
                    </div>
                    ${this.attendees.length === 0
                        ? html`<p class="text-sm text-base-content/60">
                              ${__(
                                  "Add at least one attendee to book this event.",
                              )}
                          </p>`
                        : html`<div class="space-y-2">
                              ${repeat(
                                  this.attendees,
                                  (a) => a.uid,
                                  (a) => this.renderAttendeeRow(a),
                              )}
                          </div>`}
                    <button
                        type="button"
                        class="btn btn-ghost btn-sm mt-3"
                        @click=${this.addAdhoc}
                        ?disabled=${this.attendees.length >= MAX_ATTENDEES}
                    >
                        ${litFontawesome(faPlus, {
                            className: "w-3 h-3 mr-1",
                        })}
                        ${__("Add another attendee")}
                    </button>
                </section>
                <section
                    class="flex flex-col items-stretch gap-3 border-t border-base-300 pt-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div class="text-sm">
                        <span class="text-base-content/70"
                            >${__("Total")}:</span
                        >
                        <span class="ml-2 text-lg font-semibold tabular-nums">
                            ${this.total > 0
                                ? formatMonetaryAmountByLocale(
                                      this.localeFull,
                                      this.total,
                                  )
                                : __("Free")}
                        </span>
                    </div>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        ?disabled=${!this.canSubmit ||
                        this.state === "submitting"}
                    >
                        ${litFontawesome(faUserPlus, {
                            className: "w-4 h-4 mr-2",
                        })}
                        ${this.state === "submitting"
                            ? __("Booking…")
                            : __("Book")}
                    </button>
                </section>
                ${this.submitError
                    ? html`<div class="alert alert-error">
                          ${litFontawesome(faExclamationCircle, {
                              className: "w-4 h-4",
                          })}
                          <span>${this.submitError}</span>
                      </div>`
                    : nothing}
            </form>
        `;
    }

    private renderSubmitted() {
        return html`
            <div class="mx-auto max-w-xl text-center">
                <h1 class="mb-3 text-2xl font-bold">
                    ${__("Booking received")}
                </h1>
                <p class="text-base-content/80">
                    ${this.isAuthenticated
                        ? __(
                              "Check your email to confirm the booking. Once confirmed, your seats are reserved.",
                          )
                        : __(
                              "We sent a confirmation link to your email. Open it to lock in your seats.",
                          )}
                </p>
                <a href=${buildOpacUrl({})} class="btn btn-primary mt-6">
                    ${__("Back to events")}
                </a>
            </div>
        `;
    }

    private renderLoadError() {
        return html`
            <div class="mx-auto max-w-xl text-center">
                <h1 class="mb-3 text-2xl font-bold">
                    ${__("Could not load this event")}
                </h1>
                <p class="text-base-content/70">
                    ${__("Try again, or go back to the events list.")}
                </p>
                <div class="mt-4 flex justify-center gap-3">
                    <button
                        class="btn btn-ghost"
                        @click=${() => this.loadAll()}
                    >
                        ${__("Retry")}
                    </button>
                    <a href=${buildOpacUrl({})} class="btn btn-primary">
                        ${__("Back to events")}
                    </a>
                </div>
            </div>
        `;
    }

    private renderSkeleton() {
        return html`
            <div class="space-y-4">
                <div class="skeleton skeleton-text h-8 w-2/3"></div>
                <div class="skeleton skeleton-text h-4 w-1/2"></div>
                <div class="skeleton h-32 w-full rounded-lg"></div>
                <div class="skeleton h-32 w-full rounded-lg"></div>
            </div>
        `;
    }

    override render() {
        return html`
            <div
                class="${classMap({
                    "mx-auto": true,
                    "max-w-3xl": true,
                    "p-4": true,
                })}"
            >
                ${match(this.state)
                    .with("loading", () => this.renderSkeleton())
                    .with("load-error", () => this.renderLoadError())
                    .with("submitted", () => this.renderSubmitted())
                    .with("loaded", "submitting", () => this.renderForm())
                    .exhaustive()}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "lms-event-booking-page": LMSEventBookingPage;
    }
}
