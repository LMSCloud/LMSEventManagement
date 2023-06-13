import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { IntersectionObserverHandler } from "../lib/IntersectionObserverHandler";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { tailwindStyles } from "../tailwind.lit";

@customElement("lms-toast")
export default class LMSToast extends LitElement {
  @property({ type: String }) heading: string | TemplateResult = "";

  @property({ type: String }) message: string | TemplateResult = "";

  @state() elapsedTime = 0;

  @query(".toast") toast!: HTMLElement;

  private footer: HTMLElement | undefined | null =
    document.getElementById("i18nMenu")?.parentElement;

  private intersectionObserverHandler: IntersectionObserverHandler | null =
    null;

  static override styles = [tailwindStyles, skeletonStyles];

  override render() {
    return html`
            <div class="toast-center toast z-50">
                <div class="alert alert-error grid-rows-2 gap-2">
                    <div
                        class="grid-row-1 flex w-full items-center justify-center"
                    >
                        <strong class="mr-auto">${this.heading}</strong>
                        <small>${this.elapsedTime} ${__("sec ago")}</small>
                        <button
                            class="btn-round btn-ghost btn-sm btn"
                            data-dismiss="toast"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="grid-row-2">
                        <span>${this.message}</span>
                    </div>
                </div>
            </div>
        `;
  }

  override connectedCallback() {
    super.connectedCallback();

    setInterval(() => {
      this.elapsedTime++;
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
    }, 1000000);
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

  override firstUpdated() {
    if (this.footer && this.toast) {
      const toast = this.toast;
      this.intersectionObserverHandler = new IntersectionObserverHandler({
        intersecting: {
          ref: this.toast,
          do: () => {
            const bottom = parseFloat(
              getComputedStyle(toast).bottom
            );
            toast.style.bottom = `${bottom +
              (this.footer ? this.footer.offsetHeight : 0)
              }px`;
          },
        },
        intersected: {
          ref: this.footer,
        },
      });

      this.intersectionObserverHandler.init();
    }
  }
}
