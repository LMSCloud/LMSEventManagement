import { LitElement, nothing, PropertyValues } from "lit";
import { URIComponents } from "../sharedDeclarations";
export default class LMSAnchor extends LitElement {
    href: URIComponents;
    text: string;
    static styles: import("lit").CSSResult[];
    assembleURI(): string;
    connectedCallback(): void;
    hasChanged(): (newValues: PropertyValues, oldValues: PropertyValues) => boolean;
    render(): typeof nothing | import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSAnchor.d.ts.map