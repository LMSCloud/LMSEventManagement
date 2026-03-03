import { formatAddress, formatMonetaryAmountByLocale } from "../../../src/lib/converters/displayConverters";

describe("formatMonetaryAmountByLocale", () => {
    it("formats USD for en-US locale", () => {
        const result = formatMonetaryAmountByLocale("en-US", 42.5);
        expect(result).toContain("42.50");
        expect(result).toContain("$");
    });

    it("formats EUR for de-DE locale", () => {
        const result = formatMonetaryAmountByLocale("de-DE", 42.5);
        expect(result).toContain("42,50");
        expect(result).toContain("€");
    });

    it("returns empty string for null amount", () => {
        expect(formatMonetaryAmountByLocale("en-US", null)).toBe("");
    });

    it("returns empty string for undefined amount", () => {
        expect(formatMonetaryAmountByLocale("en-US")).toBe("");
    });

    it("returns empty string for zero (falsy)", () => {
        expect(formatMonetaryAmountByLocale("en-US", 0)).toBe("");
    });

    it("returns empty string for invalid locale country code", () => {
        expect(formatMonetaryAmountByLocale("xx-XX", 10)).toBe("");
    });
});

describe("formatAddress", () => {
    it("returns error TemplateResult for null", () => {
        const result = formatAddress(null);
        expect(result).toBeDefined();
        const values = (result as any).values;
        expect(values.join("")).toContain("There's been an error");
    });

    it("returns error TemplateResult for numeric id", () => {
        const result = formatAddress(42);
        expect(result).toBeDefined();
        const values = (result as any).values;
        expect(values.join("")).toContain("There's been an error");
    });

    it("returns a TemplateResult containing address fields for valid location", () => {
        const location = {
            id: 1,
            name: "Central Library",
            street: "Main St",
            number: "42",
            city: "Springfield",
            zip: "12345",
            country: "US",
            link: null,
        };

        const result = formatAddress(location);
        expect(result).toBeDefined();
        const values = (result as any).values;
        const rendered = values.join(" ");
        expect(rendered).toContain("Central Library");
        expect(rendered).toContain("Main St");
        expect(rendered).toContain("Springfield");
    });
});
