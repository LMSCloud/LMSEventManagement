import { TranslationProxy } from "./TranslationProxy";
export declare class TranslationController {
    private static _instance;
    private translationHandler;
    private proxies;
    private translationsLoaded;
    constructor();
    static getInstance(): TranslationController;
    loadTranslations(callback: Function, localeUrl?: string): Promise<void>;
    __(text: string): TranslationProxy;
    addProxy(proxy: TranslationProxy): void;
    updateProxies(): void;
}
export declare function __(text: string): TranslationProxy;
//# sourceMappingURL=TranslationController.d.ts.map