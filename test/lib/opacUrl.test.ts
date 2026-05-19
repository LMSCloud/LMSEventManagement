import { describe, it, expect } from "vitest";
import { buildOpacUrl } from "../../src/lib/opacUrl";

const PATH = "/cgi-bin/koha/opac-page.pl";

describe("buildOpacUrl", () => {
    it("adds routing params on top of an existing code param", () => {
        const url = buildOpacUrl(
            { action: "book", event_id: "8" },
            "?code=lmscloud-eventmanagement",
            PATH,
        );
        const parsed = new URL(url, "http://x");
        expect(parsed.pathname).toBe(PATH);
        expect(parsed.searchParams.get("code")).toBe(
            "lmscloud-eventmanagement",
        );
        expect(parsed.searchParams.get("action")).toBe("book");
        expect(parsed.searchParams.get("event_id")).toBe("8");
    });

    it("strips routing params when given an empty patch (back-to-events)", () => {
        const url = buildOpacUrl(
            {},
            "?code=lmscloud-eventmanagement&action=book&event_id=8",
            PATH,
        );
        const parsed = new URL(url, "http://x");
        expect(parsed.searchParams.get("code")).toBe(
            "lmscloud-eventmanagement",
        );
        expect(parsed.searchParams.has("action")).toBe(false);
        expect(parsed.searchParams.has("event_id")).toBe(false);
        expect(parsed.searchParams.has("token")).toBe(false);
    });

    it("strips the token routing param too", () => {
        const url = buildOpacUrl(
            {},
            "?code=lmscloud-eventmanagement&action=confirm&token=abc",
            PATH,
        );
        const parsed = new URL(url, "http://x");
        expect(parsed.searchParams.has("token")).toBe(false);
        expect(parsed.searchParams.has("action")).toBe(false);
    });

    it("returns pathname alone when no params remain", () => {
        const url = buildOpacUrl({}, "?action=book&event_id=8", PATH);
        expect(url).toBe(PATH);
    });

    it("returns pathname alone when input search is empty and patch is empty", () => {
        const url = buildOpacUrl({}, "", PATH);
        expect(url).toBe(PATH);
    });

    it("preserves arbitrary non-routing params (e.g. tracking)", () => {
        const url = buildOpacUrl(
            { action: "book", event_id: "1" },
            "?code=lmscloud-eventmanagement&utm=foo",
            PATH,
        );
        const parsed = new URL(url, "http://x");
        expect(parsed.searchParams.get("utm")).toBe("foo");
    });

    it("allows callers to clear a custom param by passing null", () => {
        const url = buildOpacUrl(
            { utm: null },
            "?code=lmscloud-eventmanagement&utm=foo",
            PATH,
        );
        const parsed = new URL(url, "http://x");
        expect(parsed.searchParams.has("utm")).toBe(false);
        expect(parsed.searchParams.get("code")).toBe(
            "lmscloud-eventmanagement",
        );
    });

    it("overwrites a stale routing param when re-targeting", () => {
        const url = buildOpacUrl(
            { action: "confirm", token: "xyz" },
            "?code=lmscloud-eventmanagement&action=book&event_id=8",
            PATH,
        );
        const parsed = new URL(url, "http://x");
        expect(parsed.searchParams.get("action")).toBe("confirm");
        expect(parsed.searchParams.get("token")).toBe("xyz");
        expect(parsed.searchParams.has("event_id")).toBe(false);
    });
});
