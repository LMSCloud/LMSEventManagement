import { LitElement, nothing, PropertyValues } from "lit";
import { URIComponents } from "../sharedDeclarations";
/** We don't allow iframes */
type AnchorTarget = "_self" | "_blank" | "_parent" | "_top";
export default class LMSAnchor extends LitElement {
    href: URIComponents;
    target: AnchorTarget;
    static styles: import("lit").CSSResult[];
    assembleURI(): string;
    hasChanged(): (newValues: PropertyValues, oldValues: PropertyValues) => boolean;
    handleClick(e: Event): void;
    render(): typeof nothing | import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSAnchor.d.ts.map