import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, css, PropertyValues } from "lit";
import {
  customElement,
  property /* state */,
  queryAll,
} from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import LMSTooltip from "./LMSTooltip";
import insertResponsiveWrapper from "../lib/insertResponsiveWrapper";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";

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
    converter: { fromAttribute: (value) => (value ? JSON.parse(value) : []) },
  })
  uploadedImages: UploadedImage[] = [];
  @queryAll('[id^="button-"]') buttonReferences!: NodeListOf<HTMLButtonElement>;
  @queryAll('[id^="tooltip-"]') tooltipReferences!: NodeListOf<LMSTooltip>;
  private boundEventHandler: (event: MessageEvent) => void = () => {};

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
    css`
      img {
        aspect-ratio: 4 / 3;
        object-fit: cover;
      }

      img,
      .card {
        max-width: 300px;
      }

      .font-size-sm {
        font-size: 1rem;
      }

      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #ffffff;
      }

      button {
        white-space: nowrap;
      }

      button.btn-modal > svg {
        color: var(--text-color);
      }
    `,
  ];

  loadImages() {
    const uploadedImages = async () =>
      await fetch("/api/v1/contrib/eventmanagement/images");

    uploadedImages()
      .then(async (response): Promise<UploadedImage[]> => await response.json())
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
        tooltipReference.target = Array.from(this.buttonReferences).find(
          (buttonReference) => {
            const { id } = buttonReference;
            const buttonHashvalue = id.split("-").pop();
            return buttonHashvalue === tooltipHashvalue
              ? buttonReference
              : null;
          }
        ) as HTMLElement | null;
      });
    }
  }

  override render() {
    return html`
      <div class="container-fluid">
        <div class="card-deck">
          ${map(this.uploadedImages, (uploadedImage, index) => {
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
              <div class="card mb-5">
                <img
                  ?hidden=${!isValidFiletype}
                  src="data:image/${filetype};base64,${image}"
                  class="card-img-top"
                  alt=${filename}
                />
                <div class="card-body">
                  <p
                    data-placement="top"
                    title="${__("Link constructed!")}"
                    @click=${() => {
                      this.handleClipboardCopy(hashvalue);
                    }}
                    class="font-weight-bold p-2 border border-secondary rounded text-center"
                  >
                    ${hashvalue}
                  </p>
                  <div class="text-center">
                    <lms-tooltip
                      id="tooltip-${hashvalue}"
                      data-placement="top"
                      data-text="Link constructed!"
                      data-timeout="1000"
                    >
                      <button
                        id="button-${hashvalue}"
                        data-placement="bottom"
                        title="Link constructed!"
                        @click=${() => {
                          this.handleClipboardCopy(hashvalue);
                        }}
                        class="btn btn-primary text-center"
                      >
                        ${litFontawesome(faCopy)}
                        <span>${__("Copy to clipboard")}</span>
                      </button>
                    </lms-tooltip>
                  </div>
                </div>
                <div class="card-footer">
                  <p class="font-weight-light text-muted font-size-sm">
                    ${filename}&nbsp;-&nbsp;${dtcreated}
                  </p>
                </div>
              </div>
              ${insertResponsiveWrapper(index)}
            `;
          })}
        </div>
      </div>
    `;
  }
}
