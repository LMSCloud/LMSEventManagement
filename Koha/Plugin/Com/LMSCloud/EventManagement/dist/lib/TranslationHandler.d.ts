import Gettext from "gettext.js";
export declare class TranslationHandler {
    private i18n;
    private locale;
    private callback;
    private localeUrl;
    constructor(callback: Function, localeUrl?: string);
    loadTranslations(): Promise<Gettext.Gettext>;
    set setLocale(locale: string);
    get getLocale(): string;
    get getI18n(): Gettext.Gettext;
}
export declare function __(text: string): string;
//# sourceMappingURL=TranslationHandler.d.ts.map