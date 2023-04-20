import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { __ } from "../../lib/translate";
import { TranslationController } from "../../lib/TranslationController";

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

  override connectedCallback() {
    super.connectedCallback();

    TranslationController.getInstance().loadTranslations(() => {
      console.log("Translations loaded");
    });
  }

  override render() {
    return html` <h1 class="text-center">${__("Not implemented")}!</h1> `;
  }
}
