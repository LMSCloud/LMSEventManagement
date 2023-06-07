import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { tailwindStyles } from "../../tailwind.lit";

@customElement("lms-table-controls")
export default class LMSTableControls extends LitElement {
    static override styles = [
        tailwindStyles,
        css`
            nav > * {
                margin: 0.5rem 0;
            }
        `,
    ];

    override render() {
        return html`
            <nav class="navbar mb-4 rounded-xl bg-white">
                <div class="navbar-start">
                    <slot name="navbar-start"></slot>
                </div>
                <div class="navbar-center">
                    <slot name="navbar-center"></slot>
                </div>
                <div class="navbar-end">
                    <slot name="navbar-end"></slot>
                </div>
            </nav>
        `;
    }
}
