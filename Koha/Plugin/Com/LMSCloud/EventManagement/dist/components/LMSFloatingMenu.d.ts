import { LitElement, nothing } from "lit";
import { Gettext } from "gettext.js";
import { MenuEntry } from "../interfaces.js";
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
//# sourceMappingURL=LMSFloatingMenu.d.ts.map