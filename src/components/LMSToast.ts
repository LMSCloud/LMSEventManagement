import { css, html, LitElement } from "lit";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { customElement, property } from "lit/decorators.js";
import { __ } from "../lib/translate";
import { TranslationController } from "../lib/TranslationController";

@customElement("lms-toast")
export default class LMSToast extends LitElement {
  @property({ type: String }) heading = "";
  @property({ type: String }) message = "";
  @property({ state: true }) _elapsedTime = 0;

  static override styles = [
    bootstrapStyles,
    css`
      div:first {
        bottom: 1em;
        position: absolute;
        min-height: 200px;
      }
      .toast {
        position: absolute;
        bottom: 1em;
        left: 50%;
        opacity: 1;
      }
    `,
  ];

  override render() {
    return html`
      <div aria-live="polite" aria-atomic="true">
        <div class="toast">
          <div class="toast-header">
            <strong class="mr-auto">${this.heading}</strong>
            <small>${this._elapsedTime} ${__("sec ago")}</small>
            <button
              type="button"
              class="ml-2 mb-1 close"
              data-dismiss="toast"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="toast-body">${this.message}</div>
        </div>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();

    TranslationController.getInstance().loadTranslations(() => {
      console.log("Translations loaded");
    });

    setInterval(() => {
      this._elapsedTime++;
    }, 1000);

    this.renderRoot.addEventListener("click", (e) => {
      if (!e.target) {
        return;
      }

      const element = e.target as HTMLElement;
      if (element.tagName === "SPAN") {
        this.remove();
      }
    });

    setTimeout(() => {
      this.remove();
    }, 10000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.renderRoot.removeEventListener("click", (e) => {
      if (!e.target) {
        return;
      }

      const element = e.target as HTMLElement;
      if (element.tagName === "SPAN") {
        this.remove();
      }
    });
  }
}
