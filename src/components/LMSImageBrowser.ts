import { faCopy, faMouse, faTrash } from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement, PropertyValues } from "lit";
import {
    customElement,
    property /* state */,
    queryAll,
    state,
} from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { requestHandler } from "../lib/RequestHandler";
import { attr__, __ } from "../lib/translate";
import { cardDeckStylesStaff } from "../styles/cardDeck";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";
import { KohaAPIError, Toast, UploadedImage } from "../types/common";
import LMSToast from "./LMSToast";
import LMSTooltip from "./LMSTooltip";

declare global {
    interface HTMLElementTagNameMap {
        "lms-tooltip": LMSTooltip;
        "lms-toast": LMSToast;
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

    @state() toast: Toast = {
        heading: "",
        message: "",
    };

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        cardDeckStylesStaff,
    ];

    private loadImages() {
        requestHandler
            .get("images")
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

    private handleClipboardCopy(hashvalue: string) {
        navigator.clipboard.writeText(
            `/cgi-bin/koha/opac-retrieve-file.pl?id=${hashvalue}`
        );
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.loadImages();
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

    private renderToast(
        status: string,
        result: { error: string | string[]; errors: KohaAPIError[] }
    ) {
        if (result.error) {
            this.toast = {
                heading: status,
                message: Array.isArray(result.error)
                    ? html`<span>Sorry!</span>
                          <ol>
                              ${result.error.map(
                                  (message: string) => html`<li>${message}</li>`
                              )}
                          </ol>`
                    : html`<span>Sorry! ${result.error}</span>`,
            };
        }

        if (result.errors) {
            this.toast = {
                heading: status,
                message: html`<span>Sorry!</span>
                    <ol>
                        ${result.errors.map(
                            (error: KohaAPIError) =>
                                html`<li>
                                    ${error.message} ${__("Path")}:
                                    ${error.path}
                                </li>`
                        )}
                    </ol>`,
            };
        }

        const lmsToast = document.createElement("lms-toast", {
            is: "lms-toast",
        }) as LMSToast;
        lmsToast.heading = this.toast.heading;
        lmsToast.message = this.toast.message;
        this.renderRoot.appendChild(lmsToast);
    }

    private handleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        this.handleFiles(files);
    }

    private handleFiles(files: FileList | null) {
        if (files) {
            Array.from(files).forEach((file) => {
                const formData = new FormData();
                formData.append("file", file);
                requestHandler
                    .post("images", formData)
                    .then(async (response) => {
                        if (!response.ok) {
                            const error = await response.json();
                            this.renderToast(response.statusText, error);
                        }
                    })
                    .then(() => {
                        this.loadImages();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
        }
    }

    private handleDragOver(event: DragEvent) {
        event.preventDefault();
        const target = event.target as HTMLDivElement;
        target.classList.add("bg-primary", "bg-opacity-10");
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "copy";
        }
    }

    private handleDragLeave(event: DragEvent) {
        event.preventDefault();
        const target = event.target as HTMLDivElement;
        target.classList.remove("bg-primary", "bg-opacity-10");
    }

    private handleDrop(event: DragEvent) {
        event.preventDefault();
        const target = event.target as HTMLDivElement;
        target.classList.remove("bg-primary", "bg-opacity-10");
        if (event.dataTransfer) {
            const files = event.dataTransfer.files;
            this.handleFiles(files);
        }
    }

    private handleDelete(event: Event) {
        const target = event.target as HTMLButtonElement;
        const { hashvalue } = target.dataset;
        if (hashvalue) {
            requestHandler
                .delete("images", undefined, [hashvalue])
                .then(async (response) => {
                    if (!response.ok) {
                        const error = await response.json();
                        this.renderToast(response.statusText, error);
                    }
                })
                .then(() => {
                    this.loadImages();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    override render() {
        return html`
            <div class="mx-8">
                <div
                    class="mb-12 rounded-md border-2 border-dashed border-gray-400 p-8"
                    @dragover=${this.handleDragOver}
                    @dragleave=${this.handleDragLeave}
                    @drop=${this.handleDrop}
                >
                    <div class="flex flex-col items-center">
                        ${litFontawesome(faMouse, {
                            className: "w-12 h-12 text-gray-400",
                        })}
                        <div class="mb-4 mt-1 text-sm text-gray-600">
                            <label class="btn-link btn p-0">
                                <span>${__("Select images")}</span>
                                <input
                                    type="file"
                                    class="hidden"
                                    @change=${this.handleChange}
                                    multiple
                                    accept="image/png, image/jpeg, image/gif, image/webp, image/avif"
                                />
                            </label>
                            ${__("or drag and drop")}
                        </div>
                        <p class="mt-1 text-xs text-gray-600">
                            PNG, JPG, GIF, WEBP, AVIF ${__("up to")} 10MB
                        </p>
                    </div>
                </div>
                <div class="card-deck">
                    ${map(this.uploadedImages, (uploadedImage) => {
                        const { metadata } = uploadedImage;
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
                                        src="/api/v1/contrib/eventmanagement/public/image/${hashvalue}"
                                        class="${classMap({
                                            hidden: !isValidFiletype,
                                        })} aspect-square object-cover"
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
                                    <div class="flex justify-center gap-4">
                                        <button
                                            class="btn-warning btn"
                                            data-hashvalue=${hashvalue}
                                            @click=${this.handleDelete}
                                        >
                                            ${litFontawesome(faTrash, {
                                                className:
                                                    "w-4 h-4 inline-block",
                                            })}
                                            ${__("Delete")}
                                        </button>
                                        <lms-tooltip
                                            id="tooltip-${hashvalue}"
                                            data-placement="top"
                                            data-text=${attr__(
                                                "Link constructed"
                                            )}
                                            data-timeout="1000"
                                        >
                                            <button
                                                id="button-${hashvalue}"
                                                data-placement="bottom"
                                                @click=${() => {
                                                    this.handleClipboardCopy(
                                                        hashvalue
                                                    );
                                                }}
                                                class="btn-secondary btn text-center"
                                            >
                                                ${litFontawesome(faCopy, {
                                                    className:
                                                        "w-4 h-4 inline-block",
                                                })}
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
                                    <p class="p-2 text-sm">
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
