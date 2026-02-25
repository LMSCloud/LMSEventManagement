import { describe, it, expect } from "vitest";
import { merge } from "../../../src/lib/URLStateHandler/URLStateHandler";

describe("merge (URLStateHandler)", () => {
    const baseUrl = "https://example.com:8080/path?key=value#section";

    it("should merge all URL parts into the base URL", () => {
        const result = merge({
            href: baseUrl,
            protocol: "http:",
            hostname: "other.com",
            port: "3000",
            pathname: "/new/path",
            searchParams: new URLSearchParams({ q: "test" }),
            hash: "#top",
        });

        const parsed = new URL(result);
        expect(parsed.protocol).toBe("http:");
        expect(parsed.hostname).toBe("other.com");
        expect(parsed.port).toBe("3000");
        expect(parsed.pathname).toBe("/new/path");
        expect(parsed.searchParams.get("q")).toBe("test");
        expect(parsed.hash).toBe("#top");
    });

    it("should apply partial overrides (only pathname)", () => {
        const result = merge({
            href: baseUrl,
            pathname: "/updated",
        });

        const parsed = new URL(result);
        expect(parsed.pathname).toBe("/updated");
        expect(parsed.hostname).toBe("example.com");
        expect(parsed.port).toBe("8080");
        expect(parsed.hash).toBe("#section");
    });

    it("should handle searchParams as a string", () => {
        const result = merge({
            href: baseUrl,
            searchParams: "foo=bar&baz=1",
        });

        const parsed = new URL(result);
        expect(parsed.searchParams.get("foo")).toBe("bar");
        expect(parsed.searchParams.get("baz")).toBe("1");
    });

    it("should handle searchParams as URLSearchParams", () => {
        const params = new URLSearchParams();
        params.set("x", "1");
        params.set("y", "2");

        const result = merge({
            href: "https://example.com",
            searchParams: params,
        });

        const parsed = new URL(result);
        expect(parsed.searchParams.get("x")).toBe("1");
        expect(parsed.searchParams.get("y")).toBe("2");
    });

    it("should preserve original URL when no overrides given", () => {
        const result = merge({ href: "https://example.com/path?a=1#hash" });
        expect(result).toBe("https://example.com/path?a=1#hash");
    });
});
