import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

/**
 * The LMSDropdown class creates a dropdown component for the LMS that houses inputs and labels.
 * This dropdown is designed to wrap inputs and their labels, providing a compact UI.
 * A toggle event is dispatched when the dropdown is toggled, allowing parent components to
 * manage multiple dropdown instances.
 */
@customElement("lms-dropdown")
export default class LMSDropdown extends LitElement {
  @property({ type: Boolean }) isHidden = false;

  @property({ type: Boolean }) shouldFold = false;

  @property({ type: Boolean }) isOpen = false;

  @property({ type: String }) label = "";

  @query(".dropdown-menu") dropdownMenu!: HTMLDivElement;

  /** Flags used to handle dropdown open/close state based on focus and click events. */
  private isClickInside = false;

  private isFocused = false;

  private focusOutTimeoutId?: number;

  // Event handler methods are bound to the instance context to allow correct "this" reference when called.
  private boundHandleFocusOut = () => this.handleFocusOut();

  private boundHandleMouseDown = (event: MouseEvent) =>
    this.handleMouseDown(event);

  private boundHandleKeyDown = (event: KeyboardEvent) =>
    this.handleKeyDown(event);

  static override styles = [bootstrapStyles];

  /**
   * Dispatches a toggle event and toggles the isOpen property.
   * The dispatched 'toggle' event can be used by parent components to manage multiple dropdowns.
   */
  private handleDropdownToggle() {
    this.dispatchEvent(
      new CustomEvent("toggle", { bubbles: true, composed: true })
    );
    this.isOpen = !this.isOpen;
  }

  /**
   * Handles the mouse down event by checking if the event originated from within the dropdown,
   * setting isClickInside to true if it did, thus keeping the dropdown open.
   */
  private handleMouseDown(event: MouseEvent) {
    const composedPath = event.composedPath();
    const isInsideDropdown =
      composedPath.includes(this) || composedPath.includes(this.dropdownMenu);
    this.isClickInside = isInsideDropdown;
  }

  /**
   * If a focus-out event occurs outside of the dropdown (i.e., the user clicked or focused outside of the dropdown),
   * then the dropdown should close.
   */
  private handleFocusOut() {
    this.focusOutTimeoutId = window.setTimeout(() => {
      if (!this.isFocused && !this.isClickInside) {
        this.isOpen = false;
      }
      this.isClickInside = false;
    });
  }

  /**
   * Closes the dropdown and resets focus when escape key is pressed.
   * This improves accessibility by allowing users to exit the dropdown using their keyboard.
   */
  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.isOpen = false;
      this.isFocused = false;
    }
  }

  /**
   * Sets focus flag on focus in event.
   * This allows us to determine whether the user is currently focusing on the dropdown.
   */
  private handleFocusIn() {
    this.isFocused = true;
  }

  /**
   * Resets focus flag on focus out event.
   * This allows us to determine when the user has moved their focus away from the dropdown.
   */
  private handleFocusOutInternal() {
    this.isFocused = false;
  }

  /**
   * Sets up event listeners for handling focus and mouse events to control the open/close state of the dropdown.
   * Ensures proper handling of these events for maintaining the dropdown state.
   */
  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("mousedown", this.boundHandleMouseDown);
    this.addEventListener("blur", this.boundHandleFocusOut, true);
    this.addEventListener("keydown", this.boundHandleKeyDown);
    this.addEventListener("focusin", this.handleFocusIn);
    this.addEventListener("focusout", this.handleFocusOutInternal);
  }

  /**
   * Removes event listeners when the component is disconnected.
   * This prevents potential memory leaks and unwanted behavior by ensuring the cleanup of event listeners.
   */
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("mousedown", this.boundHandleMouseDown);
    this.removeEventListener("blur", this.boundHandleFocusOut, true);
    this.removeEventListener("keydown", this.boundHandleKeyDown);
    this.removeEventListener("focusin", this.handleFocusIn);
    this.removeEventListener("focusout", this.handleFocusOutInternal);

    if (this.focusOutTimeoutId !== undefined) {
      window.clearTimeout(this.focusOutTimeoutId);
    }
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
        <div
          class="dropdown-menu p-2 ${classMap({ show: this.isOpen })}"
          tabindex="0"
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}
