import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import {
  EventType,
  LMSEvent,
  LMSLocation,
  TargetGroupState,
} from "../sharedDeclarations";

@customElement("lms-card-details-modal")
export default class LMSCardDetailsModal extends LitElement {
  @property({ type: Object }) event: LMSEvent = {} as LMSEvent;
  @property({ type: Boolean }) isOpen = false;
  @state() event_types: EventType[] = [];
  @state() locations: LMSLocation[] = [];

  static override styles = [
    bootstrapStyles,
    css`
      .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(0 0 0 / 50%);
        z-index: 1048;
      }
    `,
  ];

  override connectedCallback() {
    super.connectedCallback();

    const event_types = async () => {
      const response = await fetch(
        "/api/v1/contrib/eventmanagement/public/event_types"
      );
      return response.json();
    };
    event_types().then(
      (event_types: EventType[]) => (this.event_types = event_types)
    );

    const locations = async () => {
      const response = await fetch(
        "/api/v1/contrib/eventmanagement/public/locations"
      );
      return response.json();
    };
    locations().then(
      (locations: LMSLocation[]) => (this.locations = locations)
    );
  }

  handleSimulatedBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.toggleModal();
    }
  }

  private toggleModal() {
    const { renderRoot } = this;
    this.isOpen = !this.isOpen;
    document.body.style.overflow = this.isOpen ? "hidden" : "auto";
    const lmsModal = (renderRoot as ShadowRoot).getElementById("lms-modal");
    if (lmsModal) {
      lmsModal.style.overflowY = this.isOpen ? "scroll" : "auto";
    }

    if (!this.isOpen) {
      this.dispatchEvent(
        new CustomEvent("close", {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  override willUpdate() {
    const { event } = this;
    /** Here we need to resolve the ids [event_type, location] to their state representations */
    if (event.event_type) {
      this.event.event_type =
        this.event_types.find(
          (event_type) => event_type.id === parseInt(event.event_type, 10)
        )?.name ?? "";
    }
    if (event.location) {
      this.event.location =
        this.locations.find(
          (location) => location.id === parseInt(event.location, 10)
        )?.name ?? "";
    }
  }

  override render() {
    console.log(this.event);
    return html`
      <div class="backdrop" ?hidden=${!this.isOpen}></div>
      <div
        class="modal fade ${classMap({
          "d-block": this.isOpen,
          show: this.isOpen,
        })}"
        id="lms-modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="lms-modal-title"
        aria-hidden="true"
        @click=${this.handleSimulatedBackdropClick}
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="lms-modal-title">
                ${this.event.name ?? "Event"}
              </h5>
              <button
                @click=${this.toggleModal}
                type="button"
                class="close"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ${map(Array.from(Object.entries(this.event)), (entry) => {
                return html`<div>
                  ${this.getMarkupByObjectProperty(entry)}
                </div>`;
              })}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getMarkupByObjectProperty(
    entry: [string, string | number | TargetGroupState[]]
  ) {
    const [key, value] = entry;
    if (["id", "image", "status"].includes(key)) return nothing;
    return html`
      <div class="row">
        <div class="col-4">${key}</div>
        <div class="col-8">${value}</div>
      </div>
    `;
  }
}
