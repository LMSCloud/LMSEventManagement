import { Directive, PartInfo } from "lit/directive.js";
import { Part } from "lit/html.js";
export declare class TranslateDirective extends Directive {
    private _text;
    private _proxy;
    private _element;
    private _textNode;
    constructor(partInfo: PartInfo);
    update(_part: Part, [text]: Parameters<this["render"]>): HTMLElement;
    render(_text: string): HTMLElement;
}
export declare const __: (_text: string) => import("lit/directive").DirectiveResult<typeof TranslateDirective>;
//# sourceMappingURL=translate.d.ts.map