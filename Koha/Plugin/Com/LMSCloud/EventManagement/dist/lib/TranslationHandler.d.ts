import Gettext from "gettext.js";
export default class TranslationHandler {
    _i18n: Gettext.Gettext;
    _locale: string;
    constructor();
    loadTranslations(): Promise<Gettext.Gettext>;
    set locale(locale: string);
    get locale(): string;
    get i18n(): Gettext.Gettext;
    convertToFormat(string: string, format: string): string;
}
//# sourceMappingURL=TranslationHandler.d.ts.map