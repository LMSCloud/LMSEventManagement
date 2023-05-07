import { LitElement } from "lit";
export default class LMSDropdown extends LitElement {
    isHidden: boolean;
    shouldFold: boolean;
    isOpen: boolean;
    label: string;
    inputs: NodeListOf<HTMLInputElement>;
    static styles: import("lit").CSSResult[];
    private handleDropdownToggle;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSDropdown.d.ts.map