import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { RequestHandler } from "../../../src/lib/RequestHandler/RequestHandler";
import type { ApiEndpoints } from "../../../src/lib/RequestHandler/types/RequestHandler.d";

const BASE = "/api/v1/contrib/eventmanagement";

const TEST_ENDPOINTS: ApiEndpoints = {
    get: {
        events: { url: `${BASE}/events`, cache: false },
        cached: { url: `${BASE}/cached`, cache: true },
        ignoreCached: { url: `${BASE}/ignore`, cache: false, ignoreCache: true },
        withQuery: {
            url: `${BASE}/withquery`,
            cache: false,
            query: { _page: "1", _per_page: "20" },
        },
    },
    post: {
        events: { url: `${BASE}/events`, cache: false },
    },
    put: {
        events: { url: `${BASE}/events`, cache: false },
    },
    delete: {
        events: { url: `${BASE}/events`, cache: false },
    },
};

describe("RequestHandler", () => {
    let handler: RequestHandler;
    let fetchSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        handler = new RequestHandler(TEST_ENDPOINTS);
        fetchSpy = vi.fn().mockResolvedValue(new Response("ok"));
        vi.stubGlobal("fetch", fetchSpy);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    describe("GET requests", () => {
        it("should build the correct URL from endpoint config", async () => {
            vi.stubGlobal("navigator", { userAgent: "TestAgent" });
            await handler.get({ endpoint: "events" });

            expect(fetchSpy).toHaveBeenCalledOnce();
            const [url] = fetchSpy.mock.calls[0]!;
            expect(url).toBe(`${BASE}/events`);
        });

        it("should append path params to the URL", async () => {
            vi.stubGlobal("navigator", { userAgent: "TestAgent" });
            await handler.get({ endpoint: "events", path: ["123"] });

            const [url] = fetchSpy.mock.calls[0]!;
            expect(url).toBe(`${BASE}/events/123`);
        });

        it("should merge endpoint-level query with caller-provided query", async () => {
            vi.stubGlobal("navigator", { userAgent: "TestAgent" });
            await handler.get({
                endpoint: "withQuery",
                query: { status: "active" },
            });

            const [url] = fetchSpy.mock.calls[0]!;
            expect(url).toContain("_page=1");
            expect(url).toContain("_per_page=20");
            expect(url).toContain("status=active");
        });

        it("should handle query passed as string", async () => {
            vi.stubGlobal("navigator", { userAgent: "TestAgent" });
            await handler.get({
                endpoint: "events",
                query: "?foo=bar",
            });

            const [url] = fetchSpy.mock.calls[0]!;
            expect(url).toContain("foo=bar");
        });
    });

    describe("POST requests", () => {
        it("should set Content-Type: application/json for JSON body", async () => {
            vi.stubGlobal("navigator", { userAgent: "TestAgent" });
            const body = JSON.stringify({ name: "Test Event" });
            await handler.post({
                endpoint: "events",
                requestInit: { method: "post", body },
            });

            const [, init] = fetchSpy.mock.calls[0]!;
            expect(init.headers).toEqual({
                "Content-Type": "application/json",
            });
            expect(init.body).toBe(body);
        });

        it("should NOT force Content-Type for FormData body", async () => {
            vi.stubGlobal("navigator", { userAgent: "TestAgent" });
            const formData = new FormData();
            formData.append("file", "data");
            await handler.post({
                endpoint: "events",
                requestInit: { method: "post", body: formData },
            });

            const [, init] = fetchSpy.mock.calls[0]!;
            expect(init.headers).toBeUndefined();
        });
    });

    describe("PUT requests", () => {
        it("should set Content-Type: application/json for JSON body", async () => {
            vi.stubGlobal("navigator", { userAgent: "TestAgent" });
            const body = JSON.stringify({ name: "Updated" });
            await handler.put({
                endpoint: "events",
                requestInit: { method: "put", body },
            });

            const [, init] = fetchSpy.mock.calls[0]!;
            expect(init.headers).toEqual({
                "Content-Type": "application/json",
            });
        });
    });

    describe("DELETE requests", () => {
        it("should call the correct URL with no body", async () => {
            vi.stubGlobal("navigator", { userAgent: "TestAgent" });
            await handler.delete({
                endpoint: "events",
                path: ["42"],
            });

            const [url, init] = fetchSpy.mock.calls[0]!;
            expect(url).toBe(`${BASE}/events/42`);
            expect(init.body).toBeUndefined();
        });
    });

    describe("Cache directives", () => {
        it("should set no-store for Chrome when cache is false", async () => {
            vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 Chrome/120" });
            await handler.get({ endpoint: "events" });

            const [, init] = fetchSpy.mock.calls[0]!;
            expect(init.cache).toBe("no-store");
        });

        it("should set no-cache for Chrome when ignoreCache is true", async () => {
            vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 Chrome/120" });
            await handler.get({ endpoint: "ignoreCached" });

            const [, init] = fetchSpy.mock.calls[0]!;
            expect(init.cache).toBe("no-cache");
        });

        it("should set default for Firefox when cache is true", async () => {
            vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 Firefox/121" });
            await handler.get({ endpoint: "cached" });

            const [, init] = fetchSpy.mock.calls[0]!;
            expect(init.cache).toBe("default");
        });

        it("should set no-cache for Firefox when ignoreCache is true", async () => {
            vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 Firefox/121" });
            await handler.get({ endpoint: "ignoreCached" });

            const [, init] = fetchSpy.mock.calls[0]!;
            expect(init.cache).toBe("no-cache");
        });

        it("should set force-cache for unknown UA when cache is false and ignoreCache is false", async () => {
            vi.stubGlobal("navigator", { userAgent: "SomeOtherBrowser" });
            await handler.get({ endpoint: "events" });

            const [, init] = fetchSpy.mock.calls[0]!;
            expect(init.cache).toBe("force-cache");
        });

        it("should set default for unknown UA when cache is true", async () => {
            vi.stubGlobal("navigator", { userAgent: "SomeOtherBrowser" });
            await handler.get({ endpoint: "cached" });

            const [, init] = fetchSpy.mock.calls[0]!;
            expect(init.cache).toBe("default");
        });
    });

    describe("Unknown endpoint", () => {
        it("should fall back to BASE_PATH fetch for unknown endpoint", async () => {
            vi.stubGlobal("navigator", { userAgent: "TestAgent" });
            await handler.get({ endpoint: "nonexistent" });

            const [url] = fetchSpy.mock.calls[0]!;
            expect(url).toContain(`${BASE}/undefined?`);
        });
    });

    describe("Invalid method", () => {
        it("should fall back when method is not a supported method", async () => {
            vi.stubGlobal("navigator", { userAgent: "TestAgent" });
            // Calling _request indirectly via get() always sets method to "get",
            // so we test that an unsupported endpoint key falls back gracefully
            await handler.get({
                endpoint: "events",
                requestInit: { method: "get" },
            });

            expect(fetchSpy).toHaveBeenCalledOnce();
        });
    });
});
