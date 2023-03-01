import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Column } from "../../interfaces";
import { Gettext } from "gettext.js";

@customElement("lms-staff-event-card-form")
export default class LMSStaffEventCardForm extends LitElement {
  @property({ type: Array }) datum: Column = {} as Column;
  @property({ state: true }) _toast = {
    heading: "",
    message: "",
  };
  @property({ state: true }) _i18n: Gettext = {} as Gettext;

  static override styles = [
    bootstrapStyles,
    css`
      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #ffffff;
      }

      button {
        white-space: nowrap;
      }
    `,
  ];

  private handleEdit(e: Event) {
    e.preventDefault();
    const shadowRoot = this.renderRoot as HTMLElement;
    shadowRoot
      .querySelector("form")
      ?.querySelectorAll("input, select, textarea")
      .forEach((input) => {
        input.removeAttribute("disabled");
      });
  }

  private handleSave(e: Event) {
    e.preventDefault();
  }

  private handleDelete(e: Event) {
    e.preventDefault();
  }

  override render() {
    const { datum } = this;
    return html`
      <form @submit=${this.handleSave}>
        <div class="form-row">
          <div class="form-group col">
            <label for="name">Name</label>
            ${datum.name}
          </div>
          <div class="form-group col">
            <label for="event_type">Event Type</label>
            ${datum.event_type}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col">
            <label for="min_age">Min Age</label>
            ${datum.min_age}
          </div>
          <div class="form-group col">
            <label for="max_age">Max Age</label>
            ${datum.max_age}
          </div>
        </div>

        <div class="form-group">
          <label for="max_participants">Max Participants</label>
          ${datum.max_participants}
        </div>

        <div class="form-row">
          <div class="form-group col">
            <label for="start_time">Start Time</label>
            ${datum.start_time}
          </div>
          <div class="form-group col">
            <label for="end_time">End Time</label>
            ${datum.end_time}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col">
            <label for="registration_start">Registration Start</label>
            ${datum.registration_start}
          </div>
          <div class="form-group col">
            <label for="registration_end">Registration End</label>
            ${datum.registration_end}
          </div>
        </div>

        <div class="form-row">
          <div class="col">
            <div class="form-group">
              <label for="fee">Fee</label>
              ${datum.fee}
            </div>

            <div class="form-group">
              <label for="location">Location</label>
              ${datum.location}
            </div>

            <div class="form-group">
              <label for="image">Image</label>
              ${datum.image}
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              ${datum.status}
            </div>

            <div class="form-group">
              <label for="registration_link">Registration Link</label>
              ${datum.registration_link}
            </div>

            <div class="form-check-inline">
              ${datum.open_registration}
              <label class="form-check-label" for="open_registration"
                >Open Registration</label
              >
            </div>
          </div>

          <div class="col">
            <div class="form-group h-100">
              <label for="description">Description</label>
              ${datum.description}
            </div>
          </div>
        </div>

        <div class="form-row pt-5">
          <div class="col">
            <div class="d-flex">
              <button
                @click=${this.handleEdit}
                type="button"
                class="btn btn-dark mr-2"
              >
                ${litFontawesome(faEdit)}
                <span>&nbsp;Edit</span>
              </button>
              <button type="submit" class="btn btn-dark mr-2">
                ${litFontawesome(faSave)}
                <span>&nbsp;Save</span>
              </button>
              <button
                @click=${this.handleDelete}
                type="button"
                class="btn btn-danger mr-2"
              >
                ${litFontawesome(faTrash)}
                <span>&nbsp;Delete</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    `;
  }
}
