import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
@customElement("lms-dropdown")
export default class LMSDropdown extends LitElement {
  @property({ type: Boolean }) isHidden = false;

  @property({ type: Boolean }) shouldFold = false;

  @property({ type: Boolean }) isOpen = false;

  @property({ type: String }) label = "";

  @queryAll("input") inputs!: NodeListOf<HTMLInputElement>;

  static override styles = [bootstrapStyles];

  private handleDropdownToggle() {
    this.dispatchEvent(
      new CustomEvent("toggle", { bubbles: true, composed: true })
    );
    this.isOpen = !this.isOpen;
  }

  override render() {
    return html`
      <div
        class="btn-group ${classMap({
          "d-none": this.isHidden,
          "w-100": this.shouldFold,
        })}"
        dropdown-menu-wrapper
      >
        <button
          type="button"
          class="btn btn-outline-secondary dropdown-toggle ${classMap({
            "btn-sm": this.shouldFold,
          })}"
          aria-haspopup="true"
          aria-expanded=${this.isOpen}
          @click=${this.handleDropdownToggle}
        >
          ${this.label}
        </button>
        <div class="dropdown-menu p-2 ${classMap({ show: this.isOpen })}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
