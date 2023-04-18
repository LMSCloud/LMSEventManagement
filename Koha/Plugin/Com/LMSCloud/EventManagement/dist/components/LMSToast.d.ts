import { LitElement } from "lit";
import { Gettext } from "gettext.js";
export default class LMSToast extends LitElement {
    heading: string;
    message: string;
    _elapsedTime: number;
    protected i18n: Gettext;
    private translationHandler;
    static styles: import("lit").CSSResult[];
    render(): import("lit").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
//# sourceMappingURL=LMSToast.d.ts.map