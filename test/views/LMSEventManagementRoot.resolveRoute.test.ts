import { describe, it, expect } from "vitest";
import { resolveRoute } from "../../src/views/LMSEventManagementRoot";

describe("resolveRoute", () => {
    it("defaults to the events view when no action is set", () => {
        const r = resolveRoute("", "42");
        expect(r.kind).toBe("events");
        if (r.kind === "events") {
            expect(r.borrowernumber).toBe("42");
        }
    });

    it("routes ?action=book&event_id=N to the booking page", () => {
        const r = resolveRoute("?action=book&event_id=8", "42");
        expect(r.kind).toBe("book");
        if (r.kind === "book") {
            expect(r.eventId).toBe("8");
            expect(r.borrowernumber).toBe("42");
        }
    });

    it("falls back to events when action=book but event_id is missing", () => {
        const r = resolveRoute("?action=book", "42");
        expect(r.kind).toBe("events");
    });

    it("routes ?action=confirm&token=… to the confirm page", () => {
        const r = resolveRoute("?action=confirm&token=abc123", null);
        expect(r.kind).toBe("confirm");
        if (r.kind === "confirm") {
            expect(r.token).toBe("abc123");
        }
    });

    it("falls back to events when action=confirm but token is missing", () => {
        const r = resolveRoute("?action=confirm", null);
        expect(r.kind).toBe("events");
    });

    it("propagates null borrowernumber for anonymous visitors", () => {
        const r = resolveRoute("?action=book&event_id=1", null);
        expect(r.kind).toBe("book");
        if (r.kind === "book") {
            expect(r.borrowernumber).toBeNull();
        }
    });

    it("ignores unrelated query params on the events route", () => {
        const r = resolveRoute("?code=lmscloud-eventmanagement", "1");
        expect(r.kind).toBe("events");
    });

    it("ignores unrelated query params on the book route", () => {
        const r = resolveRoute(
            "?code=lmscloud-eventmanagement&action=book&event_id=8",
            "1",
        );
        expect(r.kind).toBe("book");
        if (r.kind === "book") {
            expect(r.eventId).toBe("8");
        }
    });

    it("ignores unknown actions", () => {
        const r = resolveRoute("?action=foobar", null);
        expect(r.kind).toBe("events");
    });
});
