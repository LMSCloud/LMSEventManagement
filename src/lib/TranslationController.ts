import { TranslationHandler } from "./TranslationHandler";
import { TranslationProxy } from "./TranslationProxy";

export class TranslationController {
  private static _instance: TranslationController;
  private translationHandler: TranslationHandler = {} as TranslationHandler;
  private proxies: Set<TranslationProxy>;
  private translationsLoaded: boolean = false;

  constructor() {
    this.proxies = new Set();
  }

  public static getInstance(): TranslationController {
    if (!this._instance) {
      this._instance = new TranslationController();
    }
    return this._instance;
  }

  async loadTranslations(callback: Function, localeUrl?: string) {
    if (this.translationsLoaded) {
      return;
    }

    this.translationHandler = new TranslationHandler(() => {
      this.updateProxies();
      callback();
    }, localeUrl);

    await this.translationHandler.loadTranslations();
  }

  __(text: string): TranslationProxy {
    return new TranslationProxy(text, this);
  }

  addProxy(proxy: TranslationProxy) {
    this.proxies.add(proxy);
  }

  updateProxies() {
    this.proxies.forEach((proxy) => {
      const translatedText = this.translationHandler.getI18n.gettext(
        proxy._text
      );
      proxy.updateTranslatedText(translatedText);
    });
  }
}

const translationController = new TranslationController();

export function __(text: string): TranslationProxy {
  return translationController.__(text);
}
