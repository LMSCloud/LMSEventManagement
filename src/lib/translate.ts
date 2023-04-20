import { Directive, PartInfo, directive } from "lit/directive.js";
import { Part } from "lit/html.js";
import { TranslationController } from "./TranslationController";
import { TranslationProxy } from "./TranslationProxy";

export class TranslateDirective extends Directive {
  private _text: string = "";
  private _proxy: TranslationProxy = {} as TranslationProxy;
  private _element: HTMLElement | null = null;
  private _textNode: Text | null = null;

  constructor(partInfo: PartInfo) {
    super(partInfo);
  }

  override update(_part: Part, [text]: Parameters<this["render"]>) {
    if (this._text !== text) {
      const controller = TranslationController.getInstance();
      this._text = text;
      this._proxy = controller.__(text);
      this._proxy.setCallback((translatedText: string) => {
        if (this._textNode) {
          this._textNode.textContent = translatedText;
        }
      });
    }

    if (!this._element) {
      this._element = document.createElement("span");
      this._textNode = document.createTextNode("");
      this._element.appendChild(this._textNode);
    }

    return this.render(text);
  }

  render(_text: string) {
    const translatedText = this._proxy._translatedText || this._text;
    if (this._textNode) {
      this._textNode.textContent = translatedText;
    }
    return this._element!;
  }
}

export const __ = directive(TranslateDirective);
