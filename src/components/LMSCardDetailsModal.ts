import {
  faArrowRight,
  faCalendar,
  faCreditCard,
  faInfoCircle,
  faMapMarker,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { formatAddress, splitDateTime } from "../lib/converters";
import { __ } from "../lib/translate";
import {
  LMSEvent,
  LMSEventComprehensive,
  LMSEventTargetGroupFee,
  LMSEventType,
  LMSLocation,
} from "../sharedDeclarations";
import { skeletonStyles } from "../styles/skeleton";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import DOMPurify from "dompurify";

@customElement("lms-card-details-modal")
export default class LMSCardDetailsModal extends LitElement {
  @property({ type: Object }) event: LMSEvent | LMSEventComprehensive =
    {} as LMSEvent;

  @property({ type: Boolean }) isOpen = false;

  @state() event_types: LMSEventType[] = [];

  @state() locations: LMSLocation[] = [];

  @state() target_groups: LMSEventTargetGroupFee[] = [];

  @state() locale = "en";

  @query(".close") closeButton: HTMLButtonElement | undefined;

  private boundHandleKeyDown = (e: KeyboardEvent) =>
    this.handleKeyDown.bind(this)(e);

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
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

      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #6c757d;
      }

      .wrapper {
        display: inline-flex;
        align-items: center;
        gap: 0.25em;
      }

      img {
        aspect-ratio: 16 / 9;
        object-fit: cover;
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
      (event_types: LMSEventType[]) => (this.event_types = event_types)
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

    const target_groups = async () => {
      const response = await fetch(
        "/api/v1/contrib/eventmanagement/public/target_groups"
      );
      return response.json();
    };
    target_groups().then(
      (target_groups: LMSEventTargetGroupFee[]) =>
        (this.target_groups = target_groups)
    );

    this.locale = document.documentElement.lang;

    document.addEventListener("keydown", this.boundHandleKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.boundHandleKeyDown);
  }

  private handleSimulatedBackdropClick(event: MouseEvent) {
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

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && this.isOpen) {
      this.toggleModal();
    }
  }

  override willUpdate() {
    const { event } = this;
    const { event_type, location } = event;

    let target_groups: LMSEventTargetGroupFee[] | null = null;
    if ({}.hasOwnProperty.call(event, "target_groups")) {
      const comprehensiveEvent = event as LMSEventComprehensive;
      target_groups = comprehensiveEvent.target_groups;
    }

    // Resolve event_type and location ids to their state representations
    if (event_type) {
      const fullEventType = this.event_types.find(
        (_event_type) => _event_type.id === event_type
      );
      this.event.event_type = fullEventType ?? ({} as LMSEventType);
    }

    if (location) {
      const fullLocation = this.locations.find(
        (_location) => _location.id === location
      );
      this.event.location = fullLocation ?? ({} as LMSLocation);
    }

    const isTruthyAndIsComprehensiveEvent =
      target_groups &&
      (target_groups as LMSEventTargetGroupFee[]).every(
        (targetGroup: LMSEventTargetGroupFee) =>
          ({}.hasOwnProperty.call(targetGroup, "target_group_id"))
      );
    if (isTruthyAndIsComprehensiveEvent) {
      const eventComprehensive = this.event as LMSEventComprehensive;
      const selectedTargetGroups = this.target_groups.filter((target_group) =>
        target_groups?.some(
          (targetGroup: LMSEventTargetGroupFee) =>
            targetGroup.target_group_id === target_group.id
        )
      );

      eventComprehensive.target_groups = selectedTargetGroups.map(
        (selectedTargetGroup) => ({
          ...selectedTargetGroup,
          selected:
            target_groups?.find(
              (eventTargetGroup) =>
                eventTargetGroup.target_group_id === selectedTargetGroup.id
            )?.selected ?? false,
          fee:
            target_groups?.find(
              (eventTargetGroup) =>
                eventTargetGroup.target_group_id === selectedTargetGroup.id
            )?.fee ?? 0,
        })
      ) as LMSEventTargetGroupFee[];
    }
  }

  override updated() {
    if (this.isOpen && this.closeButton) {
      this.closeButton.focus();
    }
  }

  private getSelectedQuantity(
    targetGroupFees: LMSEventTargetGroupFee[] | null
  ) {
    if (!targetGroupFees) return 0;
    return targetGroupFees?.filter((targetGroupFee) => targetGroupFee.selected)
      .length;
  }

  private renderTargetGroupInfo(
    targetGroupFees: LMSEventTargetGroupFee[],
    noFees: boolean
  ) {
    const quantity = this.getSelectedQuantity(targetGroupFees);
    return targetGroupFees
      ? targetGroupFees.map((targetGroupFee, index) => {
          const hasTargetGroupId = {}.hasOwnProperty.call(
            targetGroupFee,
            "target_group_id"
          );
          if (hasTargetGroupId) return nothing;

          const { name, min_age, max_age, fee, selected } =
            targetGroupFee as LMSEventTargetGroupFee;

          if (!selected) return nothing;
          return noFees
            ? html`<span>${name}${index + 1 < quantity ? ", " : ""}</span>`
            : html`
                <tr>
                  <td>${name}</td>
                  <td>${min_age} - ${max_age}</td>
                  <td>${fee}</td>
                </tr>
              `;
        })
      : nothing;
  }

  override render() {
    const {
      name,
      description,
      location,
      image,
      registration_link,
      start_time,
      end_time,
    } = this.event;

    let target_groups = null;
    if ({}.hasOwnProperty.call(this.event, "target_groups")) {
      const eventComprehensive = this.event as LMSEventComprehensive;
      target_groups = eventComprehensive.target_groups;
    }

    let noFees = true;
    if (target_groups) {
      noFees =
        target_groups?.every((target_group) => target_group.fee === 0) ?? true;
    }

    const [sDate, sTime] = splitDateTime(start_time, this.locale);
    const [eDate, eTime] = splitDateTime(end_time, this.locale);
    const isSameDay = sDate === eDate;

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
        <div
          class="modal-dialog modal-xl modal-dialog-centered"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="lms-modal-title">
                ${name ?? "Event"}
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
              <div class="row">
                <div class="col">
                  <div>
                    <p class="wrapper">
                      <span>${litFontawesome(faCalendar)}</span>
                      <strong>${__("Date and Time")}</strong>
                    </p>
                    <p>
                      ${sDate}, ${sTime}
                      ${isSameDay
                        ? html`- ${eTime}`
                        : html` <span>${litFontawesome(faArrowRight)}</span>
                            ${eDate}, ${eTime}`}
                    </p>
                  </div>

                  <div>
                    <p class="wrapper">
                      <span>${litFontawesome(faInfoCircle)}</span>
                      <strong>${__("Description")}</strong>
                    </p>
                    <p>${unsafeHTML(DOMPurify.sanitize(description ?? ""))}</p>
                  </div>
                </div>
                <div class="col">
                  <img
                    src=${image}
                    ?hidden=${!image}
                    class="w-100 mb-4 rounded"
                  />

                  <div>
                    <p class="wrapper">
                      <span>${litFontawesome(faCreditCard)}</span>
                      <strong>${__("Fees")}</strong>
                    </p>
                    <div ?hidden=${!noFees}>
                      <p>${__("No fees")}</p>
                      <p class="wrapper">
                        <span>${litFontawesome(faUsers)}</span>
                        <strong>${__("Target Groups")}</strong>
                      </p>
                      <p>
                        ${this.renderTargetGroupInfo(
                          target_groups as LMSEventTargetGroupFee[],
                          noFees
                        )}
                      </p>
                    </div>
                    <table
                      class="table table-sm table-borderless"
                      ?hidden=${noFees}
                    >
                      <thead>
                        <tr>
                          <th scope="col">${__("Target Group")}</th>
                          <th scope="col">${__("Age Range")}</th>
                          <th scope="col">${__("Fee")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.renderTargetGroupInfo(
                          target_groups as LMSEventTargetGroupFee[],
                          noFees
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <p class="wrapper">
                      <span>${litFontawesome(faMapMarker)}</span>
                      <strong>${__("Location")}</strong>
                    </p>
                    <p>${formatAddress(location)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                @click=${this.toggleModal}
              >
                ${__("Close")}
              </button>
              <a
                role="button"
                class="btn btn-primary"
                ?hidden=${!registration_link}
                href=${registration_link}
              >
                ${__("Register")}
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
