import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, PropertyValues } from "lit";
import {
    customElement,
    property /* state */,
    queryAll,
} from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { attr__, __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
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

@customElement("lms-image-browser")
export default class LMSImageBrowser extends LitElement {
    @property({
        type: Array,
        attribute: "uploaded-images",
        converter: {
            fromAttribute: (value) => (value ? JSON.parse(value) : []),
        },
    })
    uploadedImages: UploadedImage[] = [];
    @queryAll('[id^="button-"]')
    buttonReferences!: NodeListOf<HTMLButtonElement>;
    @queryAll('[id^="tooltip-"]') tooltipReferences!: NodeListOf<LMSTooltip>;
    private boundEventHandler: (event: MessageEvent) => void = () => undefined;

    static override styles = [tailwindStyles, skeletonStyles];

    loadImages() {
        const uploadedImages = async () =>
            await fetch("/api/v1/contrib/eventmanagement/images");

        uploadedImages()
            .then(
                async (response): Promise<UploadedImage[]> =>
                    await response.json()
            )
            .then((uploadedImages) => {
                this.uploadedImages = uploadedImages;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleClipboardCopy(hashvalue: string) {
        navigator.clipboard.writeText(
            `/cgi-bin/koha/opac-retrieve-file.pl?id=${hashvalue}`
        );
    }

    handleMessageEvent(event: MessageEvent) {
        if (event.data === "reloaded") {
            this.loadImages();
        }
    }

    override connectedCallback(): void {
        super.connectedCallback();

        /** This is the counterpart to the script in the intranet_js hook */
        this.boundEventHandler = this.handleMessageEvent.bind(this);
        window.addEventListener("message", this.boundEventHandler);

        /** This loadImages call is independent of the eventListener. */
        this.loadImages();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("message", this.boundEventHandler);
    }

    override updated(changedProperties: PropertyValues<this>) {
        const shouldUpdateTooltipTargets =
            changedProperties.has("uploadedImages") &&
            this.buttonReferences &&
            this.tooltipReferences;

        if (shouldUpdateTooltipTargets) {
            this.tooltipReferences.forEach((tooltipReference: LMSTooltip) => {
                const { id } = tooltipReference;
                const tooltipHashvalue = id.split("-").pop();
                tooltipReference.target = Array.from(
                    this.buttonReferences
                ).find((buttonReference) => {
                    const { id } = buttonReference;
                    const buttonHashvalue = id.split("-").pop();
                    return buttonHashvalue === tooltipHashvalue
                        ? buttonReference
                        : null;
                }) as HTMLElement | null;
            });
        }
    }

    override render() {
        return html`
            <div class="mx-8">
                <div class="card-deck">
                    ${map(this.uploadedImages, (uploadedImage) => {
                        const { image, metadata } = uploadedImage;
                        const { dtcreated, filename, hashvalue } = metadata;
                        const filetype = filename.split(".").pop();
                        let isValidFiletype;
                        if (filetype) {
                            isValidFiletype = [
                                "png",
                                "jpg",
                                "jpeg",
                                "webp",
                                "avif",
                                "gif",
                            ].includes(filetype);
                        }
                        return html`
                            <div
                                class="card card-compact bg-base-100 shadow-xl"
                            >
                                <figure>
                                    <img
                                        src="data:image/${filetype};base64,${image}"
                                        class=${classMap({
                                            hidden: !isValidFiletype,
                                        })}
                                        alt=${filename}
                                    />
                                </figure>
                                <div class="card-body">
                                    <p
                                        data-placement="top"
                                        title=${attr__("Link constructed!")}
                                        @click=${() => {
                                            this.handleClipboardCopy(hashvalue);
                                        }}
                                        class="font-weight-bold rounded border border-secondary p-2 text-center"
                                    >
                                        ${hashvalue}
                                    </p>
                                    <div class="text-center">
                                        <lms-tooltip
                                            id="tooltip-${hashvalue}"
                                            data-placement="top"
                                            data-text="${attr__(
                                                "Link constructed"
                                            )}!"
                                            data-timeout="1000"
                                        >
                                            <button
                                                id="button-${hashvalue}"
                                                data-placement="bottom"
                                                title="${attr__(
                                                    "Link constructed"
                                                )}!"
                                                @click=${() => {
                                                    this.handleClipboardCopy(
                                                        hashvalue
                                                    );
                                                }}
                                                class="btn-primary btn text-center"
                                            >
                                                ${litFontawesome(faCopy)}
                                                <span
                                                    >${__(
                                                        "Copy to clipboard"
                                                    )}</span
                                                >
                                            </button>
                                        </lms-tooltip>
                                    </div>
                                </div>
                                <div class="card-actions justify-center">
                                    <p class="font-thin">
                                        ${filename}&nbsp;-&nbsp;${dtcreated}
                                    </p>
                                </div>
                            </div>
                        `;
                    })}
                </div>
            </div>
        `;
    }
}
