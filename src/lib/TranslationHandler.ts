import Gettext from "gettext.js";

let i18nInstance: Gettext.Gettext;

export class TranslationHandler {
  private i18n;
  private locale: string;
  private callback: Function;
  private localeUrl: string;

  constructor(
    callback: Function,
    localeUrl = "/api/v1/contrib/eventmanagement/static/locales"
  ) {
    this.i18n = Gettext();
    this.locale = document.documentElement.lang.slice(0, 2);
    this.callback = callback;
    this.localeUrl = localeUrl;
  }

  async loadTranslations() {
    if (this.locale.startsWith("en")) {
      this.i18n.setLocale("en");
      return this.i18n;
    }

    try {
      const response = await fetch(`${this.localeUrl}/${this.locale}/LC_MESSAGES/${this.locale}.json`);

      if (response.status >= 200 && response.status <= 299) {
        const translations = await response.json();
        this.i18n.loadJSON(translations, "messages");
        this.i18n.setLocale(this.locale);

        if (this.callback) {
          this.callback();
        }

        i18nInstance = this.i18n;
        return this.i18n;
      }

      console.info(
        `No translations found for locale ${this.locale}. Using default locale.`
      );
      this.i18n.setLocale("en");
    } catch (error) {
      console.error(
        `Error loading translations for locale ${this.locale}:`,
        error
      );
      this.i18n.setLocale("en");
    }

    return this.i18n;
  }

  set setLocale(locale: string) {
    this.locale = locale;
  }

  get getLocale() {
    return this.locale;
  }

  get getI18n() {
    return this.i18n;
  }
}

export function __(text: string): string {
  return typeof i18nInstance?.gettext === "function"
    ? i18nInstance.gettext(text)
    : text;
}
