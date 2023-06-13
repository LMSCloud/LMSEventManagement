import { css, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { URIComponents } from "../sharedDeclarations";
import { tailwindStyles } from "../tailwind.lit";

/** We don't allow iframes */
type AnchorTarget = "_self" | "_blank" | "_parent" | "_top";

@customElement("lms-anchor")
export default class LMSAnchor extends LitElement {
  @property({ type: Object, attribute: "data-href" }) href: URIComponents =
    {};

  @property({ type: String }) target: AnchorTarget = "_self";

  static override styles = [
    tailwindStyles,
    css`
            :host {
                display: inline-flex;
            }
        `,
  ];

  assembleURI(): string {
    const { path, query, params, fragment } = this.href;
    let uri = path ?? "";
    if (query) {
      uri += "?";
    }
    if (params) {
      uri += Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    }
    if (fragment) {
      uri += `#${fragment}`;
    }
    return uri;
  }

  hasChanged() {
    return (newValues: PropertyValues, oldValues: PropertyValues) => {
      return Object.keys(newValues).some(
        (key) => newValues.get(key) !== oldValues.get(key)
      );
    };
  }

  handleClick(e: Event): void {
    e.preventDefault();
    const assembledURI = this.assembleURI();
    switch (this.target) {
      case "_blank":
        window.open(assembledURI, "_blank");
        break;
      case "_parent":
        if (window.parent) {
          window.parent.location.href = assembledURI;
        }
        break;
      case "_top":
        if (window.top) {
          window.top.location.href = assembledURI;
        }
        break;
      case "_self":
      default:
        window.location.href = assembledURI;
    }
  }

  override render() {
    if (Object.values(this.href).every((value) => value === undefined)) {
      console.error("href is not a valid URIComponents object");
      return nothing;
    }

    return html`
            <a
                @click=${this.handleClick}
                .href=${this.assembleURI()}
                .target=${this.target}
            >
                <slot></slot>
            </a>
        `;
  }
}
