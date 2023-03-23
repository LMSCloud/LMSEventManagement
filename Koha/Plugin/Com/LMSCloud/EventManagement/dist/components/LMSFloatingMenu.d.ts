import { LitElement, nothing } from "lit";
import { Gettext } from "gettext.js";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
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
    _i18n: Gettext | Promise<Gettext>;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    updated(): void;
    render(): typeof nothing | import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSFloatingMenu.d.ts.map