import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Column /* Input */ } from "../../sharedDeclarations";
import { Gettext } from "gettext.js";
import { TemplateResultConverter } from "../../lib/converters";

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

      input[type="checkbox"].form-control {
        font-size: 0.375rem;
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

  private async handleSave(e: Event) {
    e.preventDefault();
    const target = e.target;
    const id = new TemplateResultConverter(this.datum.id).getRenderValues()[0];
    if (!(target instanceof HTMLFormElement) || !id) {
      return;
    }

    const keys = Object.keys(this.datum);
    keys.splice(keys.indexOf("uuid"), 1);

    /** Here we have custom handling for the target_group field to assure
     *  that this property is always an array of objects containing all
     *  configured target_groups. */
    const targetGroupElements: Array<HTMLTableCellElement | HTMLInputElement> =
      Array.from(target.querySelectorAll(`[data-group="target_groups"]`));
    if (!targetGroupElements.length) {
      return;
    }

    const target_groups = targetGroupElements.reduce(
      (target_groups: any, element) => {
        const { name } = element.dataset;
        const { id } = element;

        if (!target_groups[id]) {
          target_groups[id] = { id, selected: "0", fee: "0" };
        }

        if (element instanceof HTMLInputElement) {
          switch (name) {
            case "selected":
              target_groups[id].selected = element.checked ? "1" : "0";
              break;
            case "fee":
              target_groups[id].fee = element.value;
              break;
            default:
              break;
          }
        }

        return target_groups;
      },
      {}
    );

    /** Here we have some custom handling for the open_registration field because
     *  we need to check the state of the checked attribute instead of using the value. */
    const openRegistrationElement: HTMLInputElement | undefined =
      (target?.querySelector(
        '[name="open_registration"]'
      ) as HTMLInputElement) ?? undefined;
    if (!openRegistrationElement) {
      return;
    }

    const openRegistration = (
      openRegistrationElement.checked ? 1 : 0
    ).toString();

    const formData = new FormData(target);
    const requestBody = Array.from(formData).reduce(
      (acc: { [key: string]: unknown }, [key, value]) => {
        if (keys.includes(key)) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    requestBody.target_groups = Object.values(target_groups);
    requestBody.open_registration = openRegistration;
    const response = await fetch(
      `/api/v1/contrib/eventmanagement/events/${id}`,
      { method: "PUT", body: JSON.stringify(requestBody) }
    );

    if (response.status >= 200 && response.status <= 299) {
      target?.querySelectorAll("input, select, textarea").forEach((input) => {
        input.setAttribute("disabled", "");
      });
      return;
    }

    if (response.status >= 400) {
      const error = await response.json();
      console.log(error);
    }
  }

  private async handleDelete(e: Event) {
    e.preventDefault();
    const id = new TemplateResultConverter(this.datum.id).getRenderValues()[0];

    if (!id) {
      return;
    }

    const response = await fetch(
      `/api/v1/contrib/eventmanagement/events/${id}`,
      { method: "DELETE" }
    );

    if (response.status >= 200 && response.status <= 299) {
      return;
    }

    if (response.status >= 400) {
      const error = await response.json();
      console.log(error);
    }
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

        <label for="target_groups">Target Groups</label>
        ${datum.target_groups}

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
