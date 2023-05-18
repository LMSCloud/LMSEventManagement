import { __, attr__ } from "../../lib/translate";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { classMap } from "lit/directives/class-map.js";
import { Column /* Input */, TargetGroupState } from "../../sharedDeclarations";
import { customElement, property, queryAll } from "lit/decorators.js";
import { LitElement, html, css } from "lit";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { skeletonStyles } from "../../styles/skeleton";
import { TemplateResultConverter } from "../../lib/converters";
import { utilityStyles } from "../../styles/utilities";
import {
  faEdit,
  faSave,
  faTrash,
  faCompressAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Custom element representing an event card form for staff members.
 */
@customElement("lms-staff-event-card-form")
export default class LMSStaffEventCardForm extends LitElement {
  @property({ type: Array }) datum: Column = {} as Column;
  @property({ state: true }) _toast = {
    heading: "",
    message: "",
  };
  @queryAll(".collapse") collapsibles!: NodeListOf<HTMLElement>;
  @queryAll("input, select, textarea") inputs!: NodeListOf<HTMLInputElement>;

  /**
   * The static styles for the element.
   */
  static override styles = [
    bootstrapStyles,
    skeletonStyles,
    utilityStyles,
    css`
      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #6c757d;
      }

      .btn:hover svg,
      .btn.active svg {
        color: #ffffff;
      }

      button {
        white-space: nowrap;
      }

      input[type="checkbox"].form-control {
        font-size: 0.375rem;
      }

      form {
        container-type: inline-size;
      }

      @container (max-width: 360px) {
        form .btn-group {
          flex-direction: column;
        }
      }
    `,
  ];

  /**
   * Toggles the edit mode of the form.
   * @param e - The click event.
   */
  private toggleEdit(e: Event) {
    e.preventDefault();
    const button = e.target as HTMLButtonElement;
    if (!button) return;

    if (button.classList.contains("active")) {
      button.classList.remove("active");
      button.querySelector(".start-edit")?.classList.remove("d-none");
      button.querySelector(".abort-edit")?.classList.add("d-none");
      this.inputs.forEach((input) => {
        input.setAttribute("disabled", "");
      });

      this.collapseAll();
      return;
    }

    button.classList.add("active");
    button.querySelector(".start-edit")?.classList.add("d-none");
    button.querySelector(".abort-edit")?.classList.remove("d-none");
    this.inputs.forEach((input) => {
      input.removeAttribute("disabled");
    });

    const hasOpenCollapsibles = Array.from(this.collapsibles).some(
      (collapsible) => collapsible.classList.contains("show")
    );
    if (!hasOpenCollapsibles) {
      this.expandAll();
    }
  }

  /**
   * Processes the target group elements in the form.
   * We need to assure that the target_groups property is always an array of objects
   * containing all configured target_groups.
   * @param target - The HTMLFormElement containing the target group elements.
   * @returns The processed target group elements.
   */
  private processTargetGroupElements(target: HTMLFormElement) {
    const targetGroupElements: Array<HTMLInputElement> = Array.from(
      target.querySelectorAll(`[data-group="target_groups"]`)
    );
    if (!targetGroupElements.length) return;

    return targetGroupElements.reduce(
      (
        target_groups: {
          [key: number]: Omit<TargetGroupState, "target_group_id"> & {
            id: number;
          };
        },
        element
      ) => {
        const { name, id } = element;
        const databaseId = parseInt(id, 10);
        if (!target_groups[databaseId]) {
          target_groups[databaseId] = {
            id: databaseId,
            selected: false,
            fee: 0,
          };
        }

        if (element instanceof HTMLInputElement) {
          switch (name) {
            case "selected":
              target_groups[databaseId].selected = element.checked
                ? true
                : false;
              break;
            case "fee":
              target_groups[databaseId].fee = parseFloat(element.value);
              break;
            default:
              break;
          }
        }

        return target_groups;
      },
      {}
    );
  }

  /**
   * Processes the datetime-local elements in the form.
   * We need to assure they aren't rejected by the api validation.
   * We remove the idiosynchracies from the ISO8601 standard
   * and convert straight into sql writable strings.
   * @param target - The HTMLFormElement containing the datetime-local elements.
   * @returns The processed datetime-local elements.
   */
  private processDatetimeLocalElements(target: HTMLFormElement) {
    const datetimeLocalElements: Array<HTMLInputElement> = Array.from(
      target.querySelectorAll(`[type="datetime-local"]`)
    );
    if (!datetimeLocalElements.length) return;

    const affected_fields = [
      "start_time",
      "end_time",
      "registration_start",
      "registration_end",
    ];

    // return an array of objects with the updated SQL-formatted datetime values
    return datetimeLocalElements.map((element) => {
      const { name, value } = element;

      if (affected_fields.includes(name) && value) {
        const [date, time] = value.split("T");
        const [year, month, day] = date.split("-");
        const [hour, minute] = time.split(":");
        const iso8601formattedDate = `${year}-${month}-${day}T${hour}:${minute}:00Z`;

        return { name, value: iso8601formattedDate };
      }
      return { name, value };
    });
  }

  /**
   * Processes the open_registration element in the form.
   * We need to check the state of the checked attribute instead of using the value.
   * @param target - The HTMLFormElement containing the open_registration element.
   * @returns The processed open_registration element.
   */
  private processOpenRegistrationElement(target: HTMLFormElement) {
    const openRegistrationElement: HTMLInputElement | undefined =
      (target?.querySelector(
        '[name="open_registration"]'
      ) as HTMLInputElement) ?? undefined;
    if (!openRegistrationElement) return;

    return openRegistrationElement.checked ? 1 : 0;
  }

  /**
   * Handles the form submission for saving changes.
   * @param e - The submit event.
   */
  private async handleSave(e: Event) {
    e.preventDefault();
    const target = e.target;
    const [id] = new TemplateResultConverter(this.datum.id).getRenderValues();
    if (!(target instanceof HTMLFormElement) || !id) return;

    const keys = Object.keys(this.datum).filter((key) => key !== "uuid");

    const target_groups = this.processTargetGroupElements(target);
    if (!target_groups) return;

    const datetimeLocalElements = this.processDatetimeLocalElements(target);
    if (!datetimeLocalElements) return;

    const openRegistration = this.processOpenRegistrationElement(target);
    if (openRegistration === undefined) return;

    const formData = new FormData(target);
    datetimeLocalElements.forEach(({ name, value }) =>
      formData.set(name, value)
    );

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

    if (response.ok) {
      target?.querySelectorAll("input, select, textarea").forEach((input) => {
        input.setAttribute("disabled", "");
      });
      this.collapseAll();
      this.dispatchEvent(
        new CustomEvent("updated", {
          detail: id,
          bubbles: true,
          composed: true,
        })
      );
      return;
    }

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
    }
  }

  /**
   * Handles the form submission for deleting the event.
   * @param e - The click event.
   */
  private async handleDelete(e: Event) {
    e.preventDefault();
    const [id] = new TemplateResultConverter(this.datum.id).getRenderValues();

    if (!id) {
      return;
    }

    const response = await fetch(
      `/api/v1/contrib/eventmanagement/events/${id}`,
      { method: "DELETE" }
    );

    if (response.status >= 200 && response.status <= 299) {
      this.dispatchEvent(
        new CustomEvent("deleted", {
          detail: id,
          bubbles: true,
          composed: true,
        })
      );
      return;
    }

    if (response.status >= 400) {
      const error = await response.json();
      console.log(error);
    }
  }

  /**
   * Toggles the collapse state of a collapsible section.
   * @param e - The click event.
   */
  private toggleCollapse(e: Event) {
    const button = e.target as HTMLButtonElement;
    const { target } = button.dataset;
    if (!target) return;

    const collapsible = Array.from(this.collapsibles).find(
      (collapsible) => `#${collapsible.id}` === target
    );
    if (!collapsible) return;

    if (collapsible.classList.contains("show")) {
      collapsible.classList.remove("show");
      return;
    }

    collapsible.classList.add("show");
  }

  /**
   * Collapses all the collapsible sections.
   */
  private collapseAll() {
    this.collapsibles.forEach((collapsible) => {
      collapsible.classList.remove("show");
    });
  }

  /**
   * Expands all the collapsible sections.
   */
  private expandAll() {
    this.collapsibles.forEach((collapsible) => {
      collapsible.classList.add("show");
    });
  }

  /**
   * Renders the element.
   * @returns The rendered template result.
   */
  override render() {
    const { datum } = this;
    const shouldFold = window.innerWidth <= 420;
    return html`
      <form @submit=${this.handleSave}>
        <div
          class="mb-3 ${classMap({
            "btn-group": !shouldFold,
            "w-100": !shouldFold,
            "btn-group-vertical": shouldFold,
            "d-flex": shouldFold,
          })}"
          role="group"
          aria-label=${attr__("Event controls")}
        >
          <button
            @click=${this.toggleEdit}
            type="button"
            class="btn btn-outline-secondary"
          >
            <span class="start-edit pointer-events-none"
              >${litFontawesome(faEdit)}&nbsp;${__("Edit")}</span
            >
            <span class="abort-edit d-none pointer-events-none"
              >${litFontawesome(faTimes)}&nbsp;${__("Abort")}</span
            >
          </button>
          <button type="submit" class="btn btn-outline-secondary">
            ${litFontawesome(faSave)}
            <span>&nbsp;${__("Save")}</span>
          </button>
          <button
            @click=${this.handleDelete}
            type="button"
            class="btn btn-outline-secondary"
          >
            ${litFontawesome(faTrash)}
            <span>&nbsp;${__("Delete")}</span>
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-toggle="collapseAll"
            @click=${this.collapseAll}
          >
            ${litFontawesome(faCompressAlt)}
            <span>&nbsp;${__("Collapse All")}</span>
          </button>
        </div>

        <!-- Group 1: Basic Information -->
        <button
          type="button"
          class="btn btn-link btn-section w-100 text-left"
          data-toggle="collapse"
          data-target="#basicInfo"
          @click=${this.toggleCollapse}
        >
          <h4 class="pointer-events-none">${__("Basic Information")}</h4>
        </button>
        <div id="basicInfo" class="collapse px-3">
          <div class="form-row">
            <div class="form-group col">
              <label for="name">${__("Name")}</label>
              ${datum.name}
            </div>
            <div class="form-group col">
              <label for="event_type">${__("Event Type")}</label>
              ${datum.event_type}
            </div>
          </div>

          <label for="target_groups">${__("Target Groups")}</label>
          ${datum.target_groups}
        </div>

        <!-- Group 2: Age and Participants -->
        <button
          type="button"
          class="btn btn-link btn-section w-100 text-left"
          data-toggle="collapse"
          data-target="#ageAndParticipants"
          @click=${this.toggleCollapse}
        >
          <h4 class="pointer-events-none">${__("Age and Participants")}</h4>
        </button>
        <div id="ageAndParticipants" class="collapse px-3">
          <div class="form-row">
            <div class="form-group col">
              <label for="min_age">${__("Min Age")}</label>
              ${datum.min_age}
            </div>
            <div class="form-group col">
              <label for="max_age">${__("Max Age")}</label>
              ${datum.max_age}
            </div>
          </div>

          <div class="form-group">
            <label for="max_participants">${__("Max Participants")}</label>
            ${datum.max_participants}
          </div>
        </div>

        <!-- Group 3: Event Times -->
        <button
          type="button"
          class="btn btn-link btn-section w-100 text-left"
          data-toggle="collapse"
          data-target="#eventTimes"
          @click=${this.toggleCollapse}
        >
          <h4 class="pointer-events-none">${__("Event Times")}</h4>
        </button>
        <div id="eventTimes" class="collapse px-3">
          <div class="form-row">
            <div class="form-group col">
              <label for="start_time">${__("Start Time")}</label>
              ${datum.start_time}
            </div>
            <div class="form-group col">
              <label for="end_time">${__("End Time")}</label>
              ${datum.end_time}
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label for="registration_start"
                >${__("Registration Start")}</label
              >
              ${datum.registration_start}
            </div>
            <div class="form-group col">
              <label for="registration_end">${__("Registration End")}</label>
              ${datum.registration_end}
            </div>
          </div>
        </div>

        <!-- Group 4: Additional Information -->
        <button
          type="button"
          class="btn btn-link btn-section w-100 text-left"
          data-toggle="collapse"
          data-target="#additionalInfo"
          @click=${this.toggleCollapse}
        >
          <h4 class="pointer-events-none">${__("Additional Information")}</h4>
        </button>
        <div id="additionalInfo" class="collapse px-3">
          <div class="form-row">
            <div class="col">
              <div class="form-group">
                <label for="location">${__("Location")}</label>
                ${datum.location}
              </div>

              <div class="form-group">
                <label for="image">${__("Image")}</label>
                ${datum.image}
              </div>

              <div class="form-group">
                <label for="status">${__("Status")}</label>
                ${datum.status}
              </div>

              <div class="form-group">
                <label for="registration_link"
                  >${__("Registration Link")}</label
                >
                ${datum.registration_link}
              </div>

              <div class="form-check-inline">
                ${datum.open_registration}
                <label class="form-check-label" for="open_registration"
                  >${__("Open Registration")}</label
                >
              </div>
            </div>

            <div class="col">
              <div class="form-group h-100">
                <label for="description">${__("Description")}</label>
                ${datum.description}
              </div>
            </div>
          </div>
        </div>
      </form>
    `;
  }
}
