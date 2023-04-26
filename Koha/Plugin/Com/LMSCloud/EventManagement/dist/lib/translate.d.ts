import { Directive, PartInfo } from "lit/directive.js";
import { Part } from "lit/html.js";
export declare let locale: string;
export declare class TranslateDirective extends Directive {
    private _element;
    private _textNode;
    private _locale;
    constructor(partInfo: PartInfo);
    private updateTranslation;
    ____(text: string): Promise<string>;
    update(_part: Part, [text]: Parameters<this["render"]>): string | HTMLElement;
    render(_text: string): string | HTMLElement;
}
declare const __: (_text: string) => import("lit/directive").DirectiveResult<typeof TranslateDirective>;
export { __ };
//# sourceMappingURL=translate.d.ts.map