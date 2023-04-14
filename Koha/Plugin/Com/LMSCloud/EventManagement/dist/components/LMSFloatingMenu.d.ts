import { LitElement } from "lit";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { TranslationHandler } from "../lib/TranslationHandler";
import { Gettext } from "gettext.js";
type MenuEntry = {
    name: string;
    icon: IconDefinition;
    url: string;
    method: string;
};
export default class LMSFloatingMenu extends LitElement {
    brand: string;
    items: MenuEntry[];
    _currentUrl: string;
    _currentSearchParams: URLSearchParams;
    protected i18n: Gettext;
    protected translationHandler: TranslationHandler;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSFloatingMenu.d.ts.map