import Gettext from "gettext.js";
import { Directive, PartInfo, directive } from "lit/directive.js";
import { Part } from "lit/html.js";

let i18nInstance: Gettext.Gettext;
let translationsLoaded = false;
let callbacks: { text: string; callback: () => void }[] = [];
let loadTranslationsCalled = false;

async function loadTranslations(
  localeUrl = "/api/v1/contrib/eventmanagement/static/locales"
) {
  const locale = document.documentElement.lang.slice(0, 2);
  if (locale.startsWith("en") || translationsLoaded) {
    return;
  }
  try {
    const response = await fetch(
      `${localeUrl}/${locale}/LC_MESSAGES/${locale}.json`
    );
    if (response.status >= 200 && response.status <= 299) {
      const translations = await response.json();
      const i18n = Gettext();
      i18n.loadJSON(translations, "messages");
      i18n.setLocale(locale);
      i18nInstance = i18n;
      translationsLoaded = true;
      callbacks.forEach(({ callback }) => {
        callback();
      });
    } else {
      console.info(
        `No translations found for locale ${locale}. Using default locale.`
      );
    }
  } catch (error) {
    console.error(`Error loading translations for locale ${locale}:`, error);
  }
}

export class TranslateDirective extends Directive {
  private _element: HTMLElement | null = null;
  private _textNode: Text | null = null;
  private _locale: string;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    this._element = document.createElement("span");
    this._textNode = document.createTextNode("");
    this._element.appendChild(this._textNode);
    this._locale = document.documentElement.lang.slice(0, 2);
    if (!loadTranslationsCalled && !this._locale.startsWith("en")) {
      loadTranslationsCalled = true;
      loadTranslations();
    }
  }

  private async updateTranslation(text: string) {
    if (translationsLoaded && this._textNode) {
      this._textNode.textContent = i18nInstance.gettext(text);
    }
  }

  async ____(text: string) {
    if (!translationsLoaded) {
      callbacks.push({
        text,
        callback: () => {
          this.updateTranslation(text);
          if (this._element) {
            this._element.classList.remove("skeleton");
          }
        },
      });

      if (this._locale.startsWith("en")) {
        return text;
      } else {
        return "";
      }
    } else {
      const translatedText = i18nInstance.gettext(text);
      return translatedText;
    }
  }

  override update(_part: Part, [text]: Parameters<this["render"]>) {
    this.____(text).then((translatedText) => {
      this.updateTranslation(text);
      this.render(translatedText);
    });
    return this.render(text);
  }

  render(_text: string) {
    if (this._element && this._textNode) {
      if (translationsLoaded || this._locale.startsWith("en")) {
        this._textNode.textContent = _text;
      } else {
        this._element.classList.add("skeleton");
      }
      return this._element;
    }
    return _text;
  }
}

const __ = directive(TranslateDirective);

export { __ };
