import Gettext from "gettext.js";
import {
    AttributePart,
    Directive,
    directive,
    PartInfo,
    PartType,
    PropertyPart,
} from "lit/directive.js";
import { Part } from "lit/html.js";

let i18nInstance: Gettext.Gettext;
let translationsLoaded = false;
const callbacks: { text: string; callback: () => void }[] = [];
let loadTranslationsCalled = false;
export const locale = document.documentElement.lang.slice(0, 2);
export const localeFull =
    document.documentElement.lang === "en"
        ? "en_US"
        : document.documentElement.lang;

async function loadTranslations(
    localeUrl = "/api/v1/contrib/eventmanagement/static/locales"
) {
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
        console.error(
            `Error loading translations for locale ${locale}:`,
            error
        );
    }
}

/**
 * TranslateDirective is used for translating text content within Lit templates.
 * It fetches translations from an external source and automatically updates the DOM.
 * Usage: html`<div>${__(text)}</div>`
 */
export class TranslateDirective extends Directive {
    private _element: HTMLElement | null = null;
    private _textNode: Text | null = null;
    private _locale: string;

    constructor(partInfo: PartInfo) {
        super(partInfo);
        this._element = document.createElement("span");
        this._element.classList.add("pointer-events-none");
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
                        this._element.classList.remove(
                            "skeleton",
                            "skeleton-text"
                        );
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

    private generatePlaceholder() {
        const rng = Math.floor(Math.random() * 5) + 8;
        return "\u00A0".repeat(rng);
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
                this._textNode.textContent = this.generatePlaceholder();
                this._element.classList.add("skeleton", "skeleton-text");
            }
            return this._element;
        }
        return _text;
    }
}

/**
 * TranslateAttributeDirective is used for translating attribute values within Lit templates.
 * It fetches translations from an external source and automatically updates the DOM.
 * Usage: html`<div title=${attr__(title)}></div>`
 */
export class TranslateAttributeDirective extends Directive {
    private _element: HTMLElement | null = null;
    private _name: string | null = null;
    private _locale: string;

    constructor(partInfo: PartInfo) {
        super(partInfo);

        this._locale = document.documentElement.lang.slice(0, 2);
        if (
            partInfo.type !== PartType.PROPERTY &&
            partInfo.type !== PartType.ATTRIBUTE
        ) {
            throw new Error(
                "Use of TranslateAttributeDirective on non-attribute/non-property is forbidden."
            );
        }
    }

    private async updateTranslation(text: string) {
        if (translationsLoaded && this._element && this._name) {
            const translatedText = i18nInstance.gettext(text);
            const element = this._element as HTMLElement;
            element.setAttribute(this._name, translatedText);
        }
    }

    async ____(part: PropertyPart | AttributePart, text: string) {
        this._element = part.element;
        this._name = part.name;

        if (!translationsLoaded) {
            callbacks.push({
                text,
                callback: () => {
                    this.updateTranslation(text);
                    if (this._element) {
                        this._element.classList.remove(
                            "skeleton",
                            "skeleton-text"
                        );
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

    override update(
        part: PropertyPart | AttributePart,
        [text]: Parameters<this["render"]>
    ) {
        this.____(part, text).then((translatedText) => {
            this.updateTranslation(translatedText);
        });
        return this.render(text);
    }

    render(_text: string) {
        return _text;
    }
}

const attr__ = directive(TranslateAttributeDirective);

const __ = directive(TranslateDirective);

export { __, attr__ };
