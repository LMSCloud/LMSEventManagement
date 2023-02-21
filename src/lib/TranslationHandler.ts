import Gettext from "gettext.js";

export default class TranslationHandler {
  _i18n;
  _locale;

  constructor() {
    this._i18n = Gettext();
    /** As this has to be in sync with the locale
     *  set in the backend we use the lang attribute
     *  of the documentElement instead of the locale
     *  set in the browser (window.navigator.language).
     */
    this._locale = document.documentElement.lang.slice(0, 2);
  }

  async loadTranslations() {
    if (this._locale.startsWith("en")) {
      this._i18n.setLocale("en");
      return this._i18n;
    }

    /** Loading translations via API */
    const response = await fetch(
      `/api/v1/contrib/eventmanagement/static/locales/${this._locale}.json`
    );

    if (response.status >= 200 && response.status <= 299) {
      const translations = await response.json();
      this._i18n.loadJSON(translations, "messages");
      this._i18n.setLocale(this._locale);
      return this._i18n;
    }

    /** If there is no json for the locale we don't interpolate
     *  and output that the translation is missing. */
    if (response.status >= 400) {
      console.info(
        `No translations found for locale ${this._locale}. Using default locale.`
      );
      this._i18n.setLocale("en");
    }

    return this._i18n;
  }

  set locale(locale) {
    this._locale = locale;
  }

  get locale() {
    return this._locale;
  }

  get i18n() {
    return this._i18n;
  }

  convertToFormat(string: string, format: string) {
    /** This should be a polymorphic function that takes in a string
     *  and depending on the specified format it tries to convert it
     *  as best it can to the locale set in the TranslationHandler.'
     *  To do that it makes use of the public templateTranslations
     *  of this class. */

    if (format === "datetime") {
      const date = new Date(string);
      return date.toLocaleString(this._locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // add a default return statement to handle cases when the if condition is not met
    return string;
  }
}
