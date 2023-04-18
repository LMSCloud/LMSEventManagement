import { LitElement } from "lit";
import { Gettext } from "gettext.js";
export default class LMSPaginationNav extends LitElement {
    pageSizes: number[];
    hasPages: boolean;
    hasPrevious: boolean;
    hasNext: boolean;
    _page: number;
    _per_page: number;
    protected i18n: Gettext;
    private translationHandler;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    getPaginatedHref(pageSize: number): string;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSPaginationNav.d.ts.map