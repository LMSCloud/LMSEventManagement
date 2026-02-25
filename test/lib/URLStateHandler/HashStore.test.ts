import { describe, it, expect } from "vitest";
import { HashStore } from "../../../src/lib/URLStateHandler/HashStore";

describe("HashStore", () => {
    it("should strip the # prefix", () => {
        const store = new HashStore("#myHash");
        expect(store.hash).toBe("myHash");
    });

    it("should handle values without # prefix", () => {
        const store = new HashStore("noPrefix");
        expect(store.hash).toBe("noPrefix");
    });

    it("should decode URI-encoded values", () => {
        const store = new HashStore("#hello%20world%21");
        expect(store.hash).toBe("hello world!");
    });

    it("should return empty string when hash is undefined", () => {
        const store = new HashStore("");
        expect(store.hash).toBe("");
    });

    it("should update hash via setter", () => {
        const store = new HashStore("#initial");
        expect(store.hash).toBe("initial");

        store.hash = "#updated";
        expect(store.hash).toBe("updated");
    });

    it("should decode on setter as well", () => {
        const store = new HashStore("");
        store.hash = "#foo%2Fbar";
        expect(store.hash).toBe("foo/bar");
    });
});
