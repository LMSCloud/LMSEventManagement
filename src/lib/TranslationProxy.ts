import { TranslationController } from "./TranslationController";

export class TranslationProxy {
  public _text: string;
  public _translatedText: string | undefined;
  private _callback: (translatedText: string) => void;

  constructor(text: string, translationController: TranslationController) {
    this._text = text;
    this._callback = () => {};
    translationController.addProxy(this);
  }

  setCallback(callback: (translatedText: string) => void) {
    this._callback = callback;
  }

  updateTranslatedText(translatedText: string) {
    this._translatedText = translatedText;
    this._callback(translatedText);
  }
}
