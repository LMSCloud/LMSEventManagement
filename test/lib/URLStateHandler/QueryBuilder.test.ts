import { describe, it, expect } from "vitest";
import { QueryBuilder } from "../../../src/lib/URLStateHandler/QueryBuilder";

describe("QueryBuilder", () => {
    describe("constructor", () => {
        it("should populate paramMap from initial query", () => {
            const qb = new QueryBuilder({ query: "foo=bar&baz=qux" });
            expect(qb.getValue("foo")).toBe("bar");
            expect(qb.getValue("baz")).toBe("qux");
        });

        it("should have empty paramMap when no query provided", () => {
            const qb = new QueryBuilder();
            expect(qb.paramMap.toString()).toBe("");
        });
    });

    describe("forbiddenParams", () => {
        it("should store and return forbidden params", () => {
            const qb = new QueryBuilder({
                forbiddenParams: ["secret"],
            });
            expect(qb.forbiddenParams).toEqual(["secret"]);
        });

        it("should allow updating forbidden params via setter", () => {
            const qb = new QueryBuilder();
            qb.forbiddenParams = ["a", "b"];
            expect(qb.forbiddenParams).toEqual(["a", "b"]);
        });

        it("should default to empty array when not set", () => {
            const qb = new QueryBuilder();
            expect(qb.forbiddenParams).toEqual([]);
        });
    });

    describe("repeatableParams", () => {
        it("should append repeatable params instead of overwriting", () => {
            const qb = new QueryBuilder({
                repeatableParams: ["tag"],
            });
            qb.query = "tag=a&tag=b&tag=c";
            expect(qb.paramMap.getAll("tag")).toEqual(["a", "b", "c"]);
        });
    });

    describe("staticParams", () => {
        it("should initialize static param keys with empty values via setter", () => {
            const qb = new QueryBuilder();
            qb.staticParams = ["version"];
            expect(qb.paramMap.has("version")).toBe(true);
            expect(qb.getValue("version")).toBe("");
        });

        it("should store and return static params", () => {
            const qb = new QueryBuilder({ staticParams: ["version"] });
            expect(qb.staticParams).toEqual(["version"]);
        });
    });

    describe("getValue / getValues", () => {
        it("should return correct values", () => {
            const qb = new QueryBuilder({ query: "a=1&b=2&c=3" });
            expect(qb.getValue("a")).toBe("1");
            expect(qb.getValues("a", "b", "c")).toEqual(["1", "2", "3"]);
        });

        it("should return null for missing keys", () => {
            const qb = new QueryBuilder({ query: "a=1" });
            expect(qb.getValue("missing")).toBeNull();
        });
    });

    describe("without", () => {
        it("should strip static params when staticParams option is true", () => {
            const qb = new QueryBuilder({
                staticParams: ["_page"],
                query: "_page=1&name=test",
            });

            const result = qb.without({ staticParams: true });
            expect(result).not.toContain("_page");
            expect(result).toContain("name=test");
        });

        it("should use custom useParams string when provided", () => {
            const qb = new QueryBuilder({
                staticParams: ["_page"],
            });

            const result = qb.without({
                staticParams: true,
                useParams: "_page=5&color=red",
            });
            expect(result).not.toContain("_page");
            expect(result).toContain("color=red");
        });
    });

    describe("merge", () => {
        it("should merge repeatable params correctly (append new, remove deleted)", () => {
            const qb = new QueryBuilder({
                repeatableParams: ["tag"],
            });
            qb.query = "tag=a&tag=b";

            // Merging with tag=b&tag=c should keep b, remove a, add c
            const result = qb.merge("tag=b&tag=c" as any);
            const params = new URLSearchParams(result);
            const tags = params.getAll("tag");
            expect(tags).toContain("b");
            expect(tags).toContain("c");
            expect(tags).not.toContain("a");
        });

        it("should set non-repeatable params via merge", () => {
            const qb = new QueryBuilder({
                query: "name=old",
            });

            const result = qb.merge({ name: "new" } as any);
            const params = new URLSearchParams(result);
            expect(params.get("name")).toBe("new");
        });

        it("should handle optional params in merge", () => {
            const qb = new QueryBuilder({
                optionalParams: ["filter"],
                query: "filter=active",
            });

            const result = qb.merge({ filter: "inactive" } as any);
            const params = new URLSearchParams(result);
            expect(params.get("filter")).toBe("inactive");
        });
    });
});
