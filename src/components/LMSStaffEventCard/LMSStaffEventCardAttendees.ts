import { html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { match } from "ts-pattern";
import { requestHandler } from "../../lib/RequestHandler/RequestHandler";
import { __, attr__ } from "../../lib/translate";
import { skeletonStyles } from "../../styles/skeleton";
import { tailwindStyles } from "../../tailwind.lit";
import { LMSEventComprehensive, LMSTargetGroup } from "../../types/common";

type AttendeeStatus =
    | "pending"
    | "confirmed"
    | "waitlisted"
    | "canceled"
    | "attended"
    | "no_show";

type Attendee = {
    id: number;
    booking_id: number;
    event_id: number;
    attendee_borrowernumber: number | null;
    attendee_name: string;
    attendee_dob: string | null;
    target_group_id: number;
    fee_at_booking: string;
    status: AttendeeStatus;
    attended_at: string | null;
    canceled_at: string | null;
    created_at: string;
    updated_at: string;
};

type SortKey = "name" | "status" | "created_at";

const ALL_STATUSES: Array<AttendeeStatus> = [
    "pending",
    "confirmed",
    "waitlisted",
    "canceled",
    "attended",
    "no_show",
];

const NEXT_STATUSES: Record<AttendeeStatus, Array<AttendeeStatus>> = {
    pending: ["confirmed", "canceled"],
    confirmed: ["canceled", "attended", "no_show", "waitlisted"],
    waitlisted: ["confirmed", "canceled"],
    canceled: [],
    attended: [],
    no_show: [],
};

@customElement("lms-staff-event-card-attendees")
export default class LMSStaffEventCardAttendees extends LitElement {
    @property({ type: Object }) event?: LMSEventComprehensive;

    @state() private state: "loading" | "loaded" | "error" = "loading";

    @state() private attendees: Array<Attendee> = [];

    @state() private targetGroups: Array<LMSTargetGroup> = [];

    @state() private statusFilter: Set<AttendeeStatus> = new Set(ALL_STATUSES);

    @state() private sortKey: SortKey = "created_at";

    @state() private sortDir: "asc" | "desc" = "asc";

    @state() private mutatingId: number | null = null;

    @state() private errorMessage: string | null = null;

    static override styles = [tailwindStyles, skeletonStyles];

    override updated(changed: PropertyValues<this>): void {
        if (changed.has("event") && this.event?.id) {
            this.loadAll();
        }
    }

    private async loadAll(): Promise<void> {
        if (!this.event?.id) return;
        this.state = "loading";
        this.errorMessage = null;
        try {
            const [attResp, tgResp] = await Promise.all([
                requestHandler.get({
                    endpoint: "eventAttendees",
                    path: [this.event.id.toString(), "attendees"],
                }),
                requestHandler.get({ endpoint: "targetGroups" }),
            ]);
            if (!attResp.ok) {
                throw new Error(`attendees fetch failed: ${attResp.status}`);
            }
            if (!tgResp.ok) {
                throw new Error(`target groups fetch failed: ${tgResp.status}`);
            }
            this.attendees = (await attResp.json()) as Array<Attendee>;
            this.targetGroups = (await tgResp.json()) as Array<LMSTargetGroup>;
            this.state = "loaded";
        } catch (err) {
            console.error(err);
            this.errorMessage = `${err}`;
            this.state = "error";
        }
    }

    private get filteredSorted(): Array<Attendee> {
        const filtered = this.attendees.filter((a) =>
            this.statusFilter.has(a.status),
        );
        const dir = this.sortDir === "asc" ? 1 : -1;
        const key = this.sortKey;
        return [...filtered].sort((a, b) => {
            const av =
                key === "name"
                    ? a.attendee_name
                    : key === "status"
                      ? a.status
                      : a.created_at;
            const bv =
                key === "name"
                    ? b.attendee_name
                    : key === "status"
                      ? b.status
                      : b.created_at;
            return av < bv ? -dir : av > bv ? dir : 0;
        });
    }

    private targetGroupName(id: number): string {
        return this.targetGroups.find((tg) => tg.id === id)?.name ?? `#${id}`;
    }

    private toggleStatusFilter(s: AttendeeStatus): void {
        const next = new Set(this.statusFilter);
        if (next.has(s)) next.delete(s);
        else next.add(s);
        this.statusFilter = next;
    }

    private setSort(key: SortKey): void {
        if (this.sortKey === key) {
            this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
        } else {
            this.sortKey = key;
            this.sortDir = "asc";
        }
    }

    private async changeStatus(
        attendee: Attendee,
        next: AttendeeStatus,
    ): Promise<void> {
        this.mutatingId = attendee.id;
        this.errorMessage = null;
        try {
            const resp = await requestHandler.patch({
                endpoint: "attendee",
                path: [attendee.id.toString()],
                requestInit: {
                    method: "patch",
                    body: JSON.stringify({ status: next }),
                },
            });
            if (!resp.ok) {
                const data = (await resp.json().catch(() => ({}))) as {
                    error?: string;
                };
                this.errorMessage = data.error ?? `error ${resp.status}`;
                return;
            }
            const updated = (await resp.json()) as Attendee;
            this.attendees = this.attendees.map((a) =>
                a.id === updated.id ? updated : a,
            );
        } catch (err) {
            console.error(err);
            this.errorMessage = `${err}`;
        } finally {
            this.mutatingId = null;
        }
    }

    private handleStatusSelect(attendee: Attendee, e: Event): void {
        const select = e.target as HTMLSelectElement;
        const value = select.value as AttendeeStatus | "";
        if (!value || value === attendee.status) return;
        const previous = attendee.status;
        select.value = previous; // optimistic reset; will reflect actual state after refetch
        void this.changeStatus(attendee, value);
    }

    private renderFilters() {
        return html`
            <div class="mb-3 flex flex-wrap gap-2">
                ${repeat(
                    ALL_STATUSES,
                    (s) => s,
                    (s) => {
                        const active = this.statusFilter.has(s);
                        return html`<button
                            type="button"
                            class="${active
                                ? "badge-primary"
                                : "badge-outline"} badge cursor-pointer"
                            @click=${() => this.toggleStatusFilter(s)}
                            aria-pressed=${active ? "true" : "false"}
                        >
                            ${__(s)}
                        </button>`;
                    },
                )}
            </div>
        `;
    }

    private renderHeader(label: string, key: SortKey) {
        const active = this.sortKey === key;
        const arrow = active ? (this.sortDir === "asc" ? " ▲" : " ▼") : "";
        return html`<th>
            <button
                type="button"
                class="link-hover link"
                @click=${() => this.setSort(key)}
            >
                ${__(label)}${arrow}
            </button>
        </th>`;
    }

    private renderStatusControl(attendee: Attendee) {
        const transitions = NEXT_STATUSES[attendee.status];
        if (transitions.length === 0) {
            return html`<span class="text-xs text-base-content/60"
                >${__("terminal")}</span
            >`;
        }
        return html`<select
            class="select select-bordered select-sm"
            aria-label=${attr__("Change status")}
            ?disabled=${this.mutatingId === attendee.id}
            @change=${(e: Event) => this.handleStatusSelect(attendee, e)}
        >
            <option value="" selected>${__("Change to…")}</option>
            ${repeat(
                transitions,
                (s) => s,
                (s) => html`<option value=${s}>${__(s)}</option>`,
            )}
        </select>`;
    }

    private renderRow(a: Attendee) {
        return html`
            <tr>
                <td>
                    <div class="font-medium">${a.attendee_name}</div>
                    ${a.attendee_borrowernumber
                        ? html`<div class="text-xs text-base-content/60">
                              #${a.attendee_borrowernumber}
                          </div>`
                        : html`<div class="text-xs text-base-content/60">
                              ${__("ad-hoc")}
                          </div>`}
                </td>
                <td>${this.targetGroupName(a.target_group_id)}</td>
                <td>
                    <span class="badge">${__(a.status)}</span>
                </td>
                <td class="text-xs">${a.created_at}</td>
                <td>${this.renderStatusControl(a)}</td>
            </tr>
        `;
    }

    private renderTable() {
        const rows = this.filteredSorted;
        if (rows.length === 0) {
            return html`<div class="alert alert-info">
                ${__("No attendees match the current filter.")}
            </div>`;
        }
        return html`
            <div class="overflow-x-auto">
                <table class="not-prose table table-zebra">
                    <thead>
                        <tr>
                            ${this.renderHeader("Name", "name")}
                            <th>${__("Target group")}</th>
                            ${this.renderHeader("Status", "status")}
                            ${this.renderHeader("Created", "created_at")}
                            <th>${__("Action")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${repeat(
                            rows,
                            (a) => a.id,
                            (a) => this.renderRow(a),
                        )}
                    </tbody>
                </table>
            </div>
        `;
    }

    private renderSkeleton() {
        return html`
            <div class="space-y-2">
                <div class="skeleton h-6 w-1/3 rounded"></div>
                <div class="skeleton h-32 w-full rounded"></div>
            </div>
        `;
    }

    override render() {
        return html`
            <div>
                ${this.errorMessage
                    ? html`<div class="alert alert-error mb-3">
                          ${this.errorMessage}
                      </div>`
                    : nothing}
                ${this.renderFilters()}
                ${match(this.state)
                    .with("loading", () => this.renderSkeleton())
                    .with(
                        "error",
                        () =>
                            html`<div class="alert alert-error">
                                ${__("Could not load attendees.")}
                                <button
                                    class="btn btn-ghost btn-sm"
                                    @click=${() => this.loadAll()}
                                >
                                    ${__("Retry")}
                                </button>
                            </div>`,
                    )
                    .with("loaded", () => this.renderTable())
                    .exhaustive()}
            </div>
        `;
    }
}
