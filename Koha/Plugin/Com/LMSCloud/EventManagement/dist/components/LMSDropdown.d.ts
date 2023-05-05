import { LitElement } from "lit";
import { InputType } from "../sharedDeclarations";
type Structure = {
    type: "uniform";
    classes: string[];
    group: string;
    ids: number[];
    inputType: InputType;
    fields: {
        [id: number]: {
            value: string | number | boolean;
        };
    };
} | {
    type: "varying";
    fields: {
        [id: string]: {
            classes: string[];
            label: string;
            name: string;
            type: InputType;
            value: string | number | boolean;
            additionalProperties: {
                [propertyName: string]: string | number | boolean;
            };
        };
    };
};
export default class LMSDropdown extends LitElement {
    isHidden: boolean;
    shouldFold: boolean;
    isOpen: boolean;
    label: string;
    structure: Structure;
    static styles: import("lit").CSSResult[];
    private handleDropdownToggle;
    private isUniform;
    private renderUniformStructure;
    private renderVaryingStructure;
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSDropdown.d.ts.map