import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("lms-tooltip")
export default class LMSTooltip extends LitElement {
  @property({ type: String, attribute: "data-text" })
  text: string = "";
  @property({ type: Object })
  target: HTMLElement | null = null;
  @property({ type: String, attribute: "data-placement" })
  placement: "top" | "bottom" | "left" | "right" = "bottom";
  @property({ type: Number, attribute: "data-timeout" })
  timeout: number = 3000;

  private showTooltipBound = this.showTooltip.bind(this);

  static override styles = css`
    :host {
      display: inline-block;
    }

    span.tooltip {
      position: fixed;
      background-color: var(--tooltip-background-color, #333);
      color: var(--tooltip-text-color, #fff);
      border-radius: 3px;
      padding: 5px;
      font-size: 14px;
      z-index: 1000;
      visibility: hidden;
    }
  `;

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("target")) {
      const previousTarget = changedProperties.get(
        "target"
      ) as HTMLElement | null;

      if (previousTarget) {
        previousTarget.removeEventListener("click", this.showTooltipBound);
      }

      if (this.target) {
        this.target.addEventListener("click", this.showTooltipBound);
      }
    }
  }

  showTooltip(event: MouseEvent) {
    const target = event.target;
    if (target) {
      const targetElement = target as HTMLElement;
      const targetRect = targetElement.getBoundingClientRect();

      const tooltipSpan = this.shadowRoot!.querySelector(
        "span.tooltip"
      ) as HTMLElement;

      switch (this.placement) {
        case "top":
          tooltipSpan.style.top = `${
            window.scrollY + targetRect.top - tooltipSpan.offsetHeight
          }px`;
          tooltipSpan.style.left = `${
            window.scrollX +
            targetRect.left +
            (targetRect.width - tooltipSpan.offsetWidth) / 2
          }px`;
          break;
        case "bottom":
          tooltipSpan.style.top = `${
            window.scrollY + targetRect.top + targetRect.height
          }px`;
          tooltipSpan.style.left = `${
            window.scrollX +
            targetRect.left +
            (targetRect.width - tooltipSpan.offsetWidth) / 2
          }px`;
          break;
        case "left":
          tooltipSpan.style.top = `${
            window.scrollY +
            targetRect.top +
            (targetRect.height - tooltipSpan.offsetHeight) / 2
          }px`;
          tooltipSpan.style.left = `${
            window.scrollX + targetRect.left - tooltipSpan.offsetWidth
          }px`;
          break;
        case "right":
          tooltipSpan.style.top = `${
            window.scrollY +
            targetRect.top +
            (targetRect.height - tooltipSpan.offsetHeight) / 2
          }px`;
          tooltipSpan.style.left = `${
            window.scrollX + targetRect.left + targetRect.width
          }px`;
          break;
      }

      tooltipSpan.style.visibility = "visible";
      setTimeout(() => this.hideTooltip(), this.timeout);
    }
  }

  hideTooltip() {
    const tooltipSpan = this.shadowRoot!.querySelector(
      "span.tooltip"
    ) as HTMLElement;
    tooltipSpan.style.visibility = "hidden";
  }

  handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const assignedElements = slot.assignedElements({ flatten: true });

    if (assignedElements.length > 0) {
      const [assignedElement] = assignedElements;
      this.target = assignedElement as HTMLElement;
      return;
    }

    this.target = null;
  }

  override render() {
    return html`
      <slot @slotchange=${this.handleSlotChange}></slot>
      <span class="tooltip">${this.text}</span>
    `;
  }
}
