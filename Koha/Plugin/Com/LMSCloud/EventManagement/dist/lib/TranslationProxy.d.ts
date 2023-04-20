import { TranslationController } from "./TranslationController";
export declare class TranslationProxy {
    _text: string;
    _translatedText: string | undefined;
    private _callback;
    constructor(text: string, translationController: TranslationController);
    setCallback(callback: (translatedText: string) => void): void;
    updateTranslatedText(translatedText: string): void;
}
//# sourceMappingURL=TranslationProxy.d.ts.map