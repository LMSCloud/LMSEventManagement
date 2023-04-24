import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, css /* nothing */, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import {
  EventType,
  LMSEvent,
  LMSLocation,
  TargetGroup,
  TargetGroupFee,
} from "../sharedDeclarations";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import {
  faCalendar,
  faInfoCircle,
  faCreditCard,
  faMapMarker,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { map } from "lit/directives/map.js";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";

type LMSEventFull = Omit<
  LMSEvent,
  "event_type" | "location" | "target_groups"
> & {
  event_type: EventType;
  location: LMSLocation;
  target_groups: TargetGroupFee[];
};

@customElement("lms-card-details-modal")
export default class LMSCardDetailsModal extends LitElement {
  @property({ type: Object }) event: LMSEvent | LMSEventFull = {} as LMSEvent;
  @property({ type: Boolean }) isOpen = false;
  @state() event_types: EventType[] = [];
  @state() locations: LMSLocation[] = [];
  @state() target_groups: TargetGroupFee[] = [];
  @state() locale: string = "en";
  @query(".close") closeButton: HTMLButtonElement | undefined;

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

    const target_groups = async () => {
      const response = await fetch(
        "/api/v1/contrib/eventmanagement/public/target_groups"
      );
      return response.json();
    };
    target_groups().then(
      (target_groups: TargetGroupFee[]) => (this.target_groups = target_groups)
    );

    this.locale = document.documentElement.lang;
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
    const { event_type, location, target_groups } = event;
    // Resolve event_type and location ids to their state representations
    if (event_type && typeof event_type === "string") {
      const et = this.event_types.find(
        (type) => type.id === parseInt(event_type, 10)
      );
      this.event.event_type = et ?? ({} as EventType);
    }

    if (location && typeof location === "string") {
      const loc = this.locations.find(
        (loc) => loc.id === parseInt(location, 10)
      );
      this.event.location = loc ?? ({} as LMSLocation);
    }

    if (
      target_groups &&
      target_groups.every((tg) => tg.hasOwnProperty("target_group_id"))
    ) {
      const selectedTargetGroups = this.target_groups.filter((target_group) =>
        target_groups.some((tg) => tg.target_group_id === target_group.id)
      );

      this.event.target_groups = selectedTargetGroups.map((tg) => ({
        ...tg,
        fee:
          target_groups.find((etg) => etg.target_group_id === tg.id)?.fee ?? 0,
      }));
    }
  }

  override updated() {
    if (this.isOpen && this.closeButton) {
      this.closeButton.focus();
    }
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
      target_groups,
    } = this.event;
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
                    <p class="wrapper">
                      ${this.formatDatetimeByLocale(start_time)}
                      <span>${litFontawesome(faArrowRight)}</span>
                      ${this.formatDatetimeByLocale(end_time)}
                    </p>
                  </div>

                  <div>
                    <p class="wrapper">
                      <span>${litFontawesome(faInfoCircle)}</span>
                      <strong>${__("Description")}</strong>
                    </p>
                    <p>${description}</p>
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
                    <table class="table table-sm table-borderless">
                      <thead>
                        <tr>
                          <th scope="col">${__("Target Group")}</th>
                          <th scope="col">${__("Age Range")}</th>
                          <th scope="col">${__("Fee")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${map(target_groups, (target_group) => {
                          if (target_group.hasOwnProperty("target_group_id")) {
                            return nothing;
                          }
                          const { name, fee, min_age, max_age } =
                            target_group as unknown as Omit<
                              TargetGroupFee,
                              "id" | "target_group_id" | "selected"
                            > &
                              TargetGroup;
                          return html`
                            <tr>
                              <td>${name}</td>
                              <td>${min_age} - ${max_age}</td>
                              <td>${fee}</td>
                            </tr>
                          `;
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <p class="wrapper">
                      <span>${litFontawesome(faMapMarker)}</span>
                      <strong>${__("Location")}</strong>
                    </p>
                    <p>
                      ${typeof location === "string"
                        ? nothing
                        : this.formatAddressByLocale(location)}
                    </p>
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

  formatDatetimeByLocale(datetime: string) {
    if (datetime) {
      return new Intl.DateTimeFormat(this.locale, {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(datetime));
    }
    return nothing;
  }

  formatAddressByLocale(address: LMSLocation) {
    if (address) {
      const { name, street, number, city, zip, country } = address;
      return html` <strong>${name}</strong><br />
        ${street} ${number}<br />
        ${zip} ${city}<br />
        ${country}`;
    }
    return nothing;
  }
}
