import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { __ } from "../../lib/translate";
import { skeletonStyles } from "../../styles/skeleton";
import { tailwindStyles } from "../../tailwind.lit";

@customElement("lms-staff-event-card-attendees")
export default class LMSStaffEventCardAttendees extends LitElement {
    static override styles = [
        tailwindStyles,
        skeletonStyles,
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
        return html` <h1 class="text-center">${__("Not implemented")}!</h1> `;
    }
}
