import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-container")
export default class LMSContainer extends LitElement {
  static override styles = [tailwindStyles];

  override render() {
    return html` <div class="mx-8">
      <slot name="menu"></slot>
      <slot name="content"></slot>
    </div>`;
  }
}
