import { LitElement, PropertyValues } from "lit";
import LMSTooltip from "./LMSTooltip";
type UploadedImage = {
    image: string;
    metadata: {
        dtcreated: string;
        id: number;
        permanent: number;
        dir: string;
        public: number;
        filename: string;
        uploadcategorycode: string;
        owner: number;
        hashvalue: string;
        filesize: number;
    };
};
declare global {
    interface HTMLElementTagNameMap {
        "lms-tooltip": LMSTooltip;
    }
}
export default class LMSImageBrowser extends LitElement {
    uploadedImages: UploadedImage[];
    buttonReferences: NodeListOf<HTMLButtonElement>;
    tooltipReferences: NodeListOf<LMSTooltip>;
    static styles: import("lit").CSSResult[];
    handleClipboardCopy(hashvalue: string): void;
    connectedCallback(): void;
    updated(changedProperties: PropertyValues<this>): void;
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSImageBrowser.d.ts.map