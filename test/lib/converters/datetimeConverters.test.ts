import {
    convertToFormat,
    convertToISO8601,
    formatDatetimeByLocale,
    normalizeForInput,
    splitDateTime,
} from "../../../src/lib/converters/datetimeConverters";

describe("convertToFormat", () => {
    const iso = "2024-06-15T14:30:00";

    it("formats with en locale", () => {
        const result = convertToFormat(iso, "LLLL", "en");
        expect(result).toContain("June");
        expect(result).toContain("15");
        expect(result).toContain("2024");
    });

    it("formats with de locale", () => {
        const result = convertToFormat(iso, "LLLL", "de");
        expect(result).toContain("Juni");
        expect(result).toContain("15");
        expect(result).toContain("2024");
    });

    it("formats with custom format string", () => {
        const result = convertToFormat(iso, "YYYY/MM/DD", "en");
        expect(result).toBe("2024/06/15");
    });
});

describe("splitDateTime", () => {
    it("splits a valid datetime into [date, time]", () => {
        const [date, time] = splitDateTime("2024-06-15T14:30:00", "en");
        expect(date).toBeTruthy();
        expect(time).toBeTruthy();
        expect(typeof date).toBe("string");
        expect(typeof time).toBe("string");
    });

    it("splits a Date object", () => {
        const d = new Date("2024-06-15T14:30:00");
        const [date, time] = splitDateTime(d, "en");
        expect(date).toBeTruthy();
        expect(time).toBeTruthy();
    });

    it("returns an error entry for null input", () => {
        const result = splitDateTime(null, "en");
        expect(result).toHaveLength(2);
        expect(result[0]).toBe("Error: Invalid date");
        expect(result[1]).toBe("");
    });

    it("returns an error entry for empty string input", () => {
        const result = splitDateTime("", "en");
        expect(result).toHaveLength(2);
        expect(result[0]).toBe("Error: Invalid date");
        expect(result[1]).toBe("");
    });
});

describe("normalizeForInput", () => {
    it('strips seconds for "datetime-local" format', () => {
        const result = normalizeForInput("2024-06-15T14:30:45", "datetime-local");
        expect(result).toBe("2024-06-15T14:30");
    });

    it("passes through for other formats", () => {
        const input = "2024-06-15T14:30:45";
        const result = normalizeForInput(input, "text");
        expect(result).toBe(input);
    });
});

describe("convertToISO8601", () => {
    it("outputs ISO 8601 format with timezone", () => {
        const result = convertToISO8601("2024-06-15T14:30:00");
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);
    });

    it("preserves the correct date and time", () => {
        const result = convertToISO8601("2024-06-15T14:30:00");
        expect(result).toContain("2024-06-15");
        expect(result).toContain("14:30:00");
    });
});

describe("formatDatetimeByLocale", () => {
    it("returns a TemplateResult with formatted date for valid input", () => {
        const result = formatDatetimeByLocale("2024-06-15T14:30:00", "en");
        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
        const rendered = result.values.join("");
        expect(rendered).toContain("2024");
    });

    it("returns an error TemplateResult for null input", () => {
        const result = formatDatetimeByLocale(null, "en");
        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
        const rendered = result.values.join("");
        expect(rendered).toContain("There's been an error");
    });

    it("returns an error TemplateResult for empty string", () => {
        const result = formatDatetimeByLocale("", "en");
        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
        const rendered = result.values.join("");
        expect(rendered).toContain("There's been an error");
    });
});
