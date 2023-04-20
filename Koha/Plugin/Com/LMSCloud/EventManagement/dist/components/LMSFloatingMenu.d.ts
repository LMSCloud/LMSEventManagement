import { LitElement } from "lit";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { TranslateDirective } from "../lib/translate";
import { DirectiveResult } from "lit/directive.js";
type MenuEntry = {
    name: string | DirectiveResult<typeof TranslateDirective>;
    icon: IconDefinition;
    url: string;
    method: string;
};
export default class LMSFloatingMenu extends LitElement {
    brand: string;
    items: MenuEntry[];
    _currentUrl: string;
    _currentSearchParams: URLSearchParams;
    static styles: import("lit").CSSResult[];
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSFloatingMenu.d.ts.map