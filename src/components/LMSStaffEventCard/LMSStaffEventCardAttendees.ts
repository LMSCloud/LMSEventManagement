import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
// import { litFontawesome } from "@weavedev/lit-fontawesome";
// import { faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { Gettext } from "gettext.js";

@customElement("lms-staff-event-card-attendees")
export default class LMSStaffEventCardAttendees extends LitElement {
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

  override render() {
    return html` <h1 class="text-center">Not implemented!</h1> `;
  }
}
