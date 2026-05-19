import { html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { match } from "ts-pattern";

export type Route =
    | { kind: "events"; borrowernumber: string | null }
    | { kind: "book"; eventId: string; borrowernumber: string | null }
    | { kind: "confirm"; token: string };

/**
 * Pure router: parse a query string + borrowernumber into the route the
 * element should render. Lifted out of the class so it's unit-testable
 * without instantiating the LitElement.
 */
export function resolveRoute(
    search: string,
    borrowernumber: string | null,
): Route {
    const params = new URLSearchParams(search);
    const action = params.get("action");

    if (action === "book") {
        const eventId = params.get("event_id");
        if (eventId) {
            return { kind: "book", eventId, borrowernumber };
        }
    }
    if (action === "confirm") {
        const token = params.get("token");
        if (token) {
            return { kind: "confirm", token };
        }
    }
    return { kind: "events", borrowernumber };
}

function readBorrowernumber(): string | null {
    const el = document.querySelector(".loggedinusername");
    if (!el) return null;
    return el.getAttribute("data-borrowernumber");
}

@customElement("lms-event-management-root")
export default class LMSEventManagementRoot extends LitElement {
    @state() private route: Route = resolveRoute(
        window.location.search,
        readBorrowernumber(),
    );

    private boundHandlePopState = () => {
        this.route = resolveRoute(window.location.search, readBorrowernumber());
    };

    override connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener("popstate", this.boundHandlePopState);
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("popstate", this.boundHandlePopState);
    }

    protected override createRenderRoot(): this {
        // Render into light DOM so child custom elements participate in the
        // page's normal styling and CSS variable inheritance.
        return this;
    }

    override render() {
        return match(this.route)
            .with(
                { kind: "events" },
                (r) =>
                    html`<lms-events-view
                        borrowernumber=${r.borrowernumber ?? nothing}
                    ></lms-events-view>`,
            )
            .with(
                { kind: "book" },
                (r) =>
                    html`<lms-event-booking-page
                        event-id=${r.eventId}
                        borrowernumber=${r.borrowernumber ?? nothing}
                    ></lms-event-booking-page>`,
            )
            .with(
                { kind: "confirm" },
                (r) =>
                    html`<lms-event-booking-confirm-page
                        token=${r.token}
                    ></lms-event-booking-confirm-page>`,
            )
            .exhaustive();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "lms-event-management-root": LMSEventManagementRoot;
    }
}
