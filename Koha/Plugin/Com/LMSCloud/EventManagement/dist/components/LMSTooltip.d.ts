import { LitElement, PropertyValues } from "lit";
export default class LMSTooltip extends LitElement {
    text: string;
    target: HTMLElement | null;
    placement: "top" | "bottom" | "left" | "right";
    timeout: number;
    private showTooltipBound;
    static styles: import("lit").CSSResult;
    willUpdate(changedProperties: PropertyValues<this>): void;
    showTooltip(event: MouseEvent): void;
    hideTooltip(): void;
    handleSlotChange(event: Event): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSTooltip.d.ts.map