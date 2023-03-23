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
    private boundEventHandler;
    static styles: import("lit").CSSResult[];
    loadImages(): void;
    handleClipboardCopy(hashvalue: string): void;
    handleMessageEvent(event: MessageEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changedProperties: PropertyValues<this>): void;
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSImageBrowser.d.ts.map