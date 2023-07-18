import countryToCurrency from "country-to-currency";
import { html, nothing } from "lit";
import { LMSLocation } from "../../types/common";

/**
 * Returns the currency symbol for the specified locale.
 * @param locale
 * @param amount
 * @returns
 */
export function formatMonetaryAmountByLocale(
    locale: string,
    amount?: number | null
): string {
    if (!amount) {
        return "";
    }

    const countryCode = locale.split("-")[1];
    try {
        const currencyFormatter = new Intl.NumberFormat(locale, {
            style: "currency",
            currency:
                countryToCurrency[
                    countryCode as keyof typeof countryToCurrency
                ],
        });

        return currencyFormatter.format(amount);
    } catch (error) {
        console.error(`Error formatting currency for locale ${locale}:`, error);

        return "";
    }
}

/**
 * Returns a TemplateResult for a LMSLocation object.
 * @param address
 * @returns TemplateResult
 */
export function formatAddress(address: number | LMSLocation | null) {
    if (!address || typeof address === "number")
        return html`<span>${__("There's been an error")}..</span>`;
    if (address) {
        const { name, street, number, city, zip, country } = address;
        return html` <strong>${name}</strong><br />
            ${street} ${number}<br />
            ${zip} ${city}<br />
            ${country}`;
    }
    return nothing;
}
