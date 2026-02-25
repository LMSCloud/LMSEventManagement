import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
    deepCopy,
    isDeepEqual,
    throttle,
    debounce,
} from "../../src/lib/utilities";

describe("deepCopy", () => {
    it("should pass through primitives", () => {
        expect(deepCopy(42)).toBe(42);
        expect(deepCopy("hello")).toBe("hello");
        expect(deepCopy(true)).toBe(true);
        expect(deepCopy(undefined)).toBe(undefined);
    });

    it("should return null for null", () => {
        expect(deepCopy(null)).toBeNull();
    });

    it("should deeply clone nested objects", () => {
        const original = { a: 1, b: { c: 2, d: { e: 3 } } };
        const copy = deepCopy(original);

        expect(copy).toEqual(original);
        expect(copy).not.toBe(original);
        expect(copy.b).not.toBe(original.b);
        expect(copy.b.d).not.toBe(original.b.d);

        copy.b.d.e = 999;
        expect(original.b.d.e).toBe(3);
    });

    it("should deeply clone arrays", () => {
        const original = [1, [2, [3]]];
        const copy = deepCopy(original);

        expect(copy).toEqual(original);
        expect(copy).not.toBe(original);
        expect(copy[1]).not.toBe(original[1]);
    });

    it("should clone Date objects", () => {
        const original = new Date("2024-01-15T10:30:00Z");
        const copy = deepCopy(original);

        expect(copy).toEqual(original);
        expect(copy).not.toBe(original);
        expect(copy.getTime()).toBe(original.getTime());
    });
});

describe("isDeepEqual", () => {
    it("should return true for same reference", () => {
        const obj = { a: 1 };
        expect(isDeepEqual(obj, obj)).toBe(true);
    });

    it("should return true for equal primitives", () => {
        expect(isDeepEqual(1, 1)).toBe(true);
        expect(isDeepEqual("a", "a")).toBe(true);
        expect(isDeepEqual(true, true)).toBe(true);
    });

    it("should return false for different primitives", () => {
        expect(isDeepEqual(1, 2)).toBe(false);
        expect(isDeepEqual("a", "b")).toBe(false);
    });

    it("should return true for deeply equal objects", () => {
        const a = { x: 1, y: { z: 2 } };
        const b = { x: 1, y: { z: 2 } };
        expect(isDeepEqual(a, b)).toBe(true);
    });

    it("should return false for different nested objects", () => {
        const a = { x: 1, y: { z: 2 } };
        const b = { x: 1, y: { z: 3 } };
        expect(isDeepEqual(a, b)).toBe(false);
    });

    it("should return false for different key counts", () => {
        const a = { x: 1, y: 2 };
        const b = { x: 1 };
        expect(isDeepEqual(a, b)).toBe(false);
    });

    it("should compare functions by string representation", () => {
        const fn1 = () => 1;
        const fn2 = () => 1;
        const fn3 = () => 2;
        expect(isDeepEqual({ f: fn1 }, { f: fn2 })).toBe(true);
        expect(isDeepEqual({ f: fn1 }, { f: fn3 })).toBe(false);
    });

    it("should handle null values", () => {
        expect(isDeepEqual(null, null)).toBe(true);
        expect(isDeepEqual(null, { a: 1 })).toBe(false);
        expect(isDeepEqual({ a: 1 }, null)).toBe(false);
    });
});

describe("throttle", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should not call the callback more than once within delay", () => {
        const callback = vi.fn();
        const throttled = throttle(callback, 1000);

        // throttle sets previousCall = Date.now() at creation time,
        // so the first call only fires once `delay` ms have elapsed
        vi.advanceTimersByTime(1000);
        throttled();
        expect(callback).toHaveBeenCalledTimes(1);

        // Calls within the delay should be skipped
        vi.advanceTimersByTime(500);
        throttled();
        expect(callback).toHaveBeenCalledTimes(1);

        // After the full delay, the next call should go through
        vi.advanceTimersByTime(500);
        throttled();
        expect(callback).toHaveBeenCalledTimes(2);
    });
});

describe("debounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should delay callback by wait ms", () => {
        const callback = vi.fn();
        const debounced = debounce(callback, 200, false);

        debounced();
        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(200);
        expect(callback).toHaveBeenCalledOnce();
    });

    it("should fire on leading edge when immediate is true", () => {
        const callback = vi.fn();
        const debounced = debounce(callback, 200, true);

        debounced();
        expect(callback).toHaveBeenCalledOnce();

        // Should not fire again during the wait period
        debounced();
        expect(callback).toHaveBeenCalledOnce();
    });

    it("should reset the timer on rapid calls", () => {
        const callback = vi.fn();
        const debounced = debounce(callback, 200, false);

        debounced();
        vi.advanceTimersByTime(100);
        debounced(); // reset the timer
        vi.advanceTimersByTime(100);
        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(callback).toHaveBeenCalledOnce();
    });
});
