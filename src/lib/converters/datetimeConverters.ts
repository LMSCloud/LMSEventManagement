import { html, nothing } from "lit";

/**
 * Converts a datetime string to the specified format.
 * @param string - The datetime string to convert.
 * @param format - The desired format for the conversion.
 * @param locale - The locale to use for the conversion.
 * @returns The converted datetime string.
 */
export function convertToFormat(
    string: string,
    format: string,
    locale: string
): string {
    if (format === "datetime") {
        const datetime = new Date(string);
        return datetime.toLocaleString(locale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    if (format === "date") {
        const date = new Date(string);
        return date.toLocaleDateString(locale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }

    return string;
}

/**
 * Splits a datetime string into date and time components.
 * @param {string} string - The datetime string to split.
 * @param {string} locale - The locale used for formatting the date and time.
 * @returns {string[]} An array containing the date and time components.
 */
export function splitDateTime(
    string: string | Date | null,
    locale: string
): string[] {
    if (!string) return [`${__("Error: Invalid date")}`, ""];
    const datetime = new Date(string);
    const date = datetime.toLocaleDateString(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const time = datetime.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
    });
    return [date, time];
}

/**
 * Normalizes a datetime string for use in an input field of type "datetime-local".
 * @param string - The datetime string to normalize.
 * @param format - The format of the datetime string.
 * @returns The normalized datetime string.
 */
export function normalizeForInput(string: string, format: string): string {
    if (format === "datetime-local") {
        const datetime = new Date(string);
        const normalizedDateTime = datetime.toISOString().slice(0, 16);
        return normalizedDateTime;
    }

    return string;
}

/**
 * Converts a datetime string to ISO8601 format.
 * @param string - The datetime string to convert.
 * @returns The converted datetime string.
 * @see https://en.wikipedia.org/wiki/ISO_8601
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 */
export function convertToISO8601(string: string): string {
    const datetime = new Date(string);
    return datetime.toISOString();
}

/**
 * Returns a TemplateResult for a datetime string formatted by the specified locale.
 * @param datetime
 * @param locale
 * @returns TemplateResult
 */
export function formatDatetimeByLocale(
    datetime: string | Date | null,
    locale: string
) {
    if (!datetime) return html`<span>${__("There's been an error")}..</span>`;
    if (datetime) {
        return new Intl.DateTimeFormat(locale, {
            dateStyle: "full",
            timeStyle: "short",
        }).format(new Date(datetime));
    }
    return nothing;
}
