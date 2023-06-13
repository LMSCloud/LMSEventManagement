import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-view")
export default class LMSView extends LitElement {
    static override styles = [tailwindStyles];

    override render() {
        return html`<slot></slot>`;
    }
}
