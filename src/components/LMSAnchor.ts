import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, nothing, PropertyValues, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { URIComponents } from "../sharedDeclarations";

@customElement("lms-anchor")
export default class LMSAnchor extends LitElement {
  @property({ type: Object, attribute: "data-href" })
  href: URIComponents = {};

  static override styles = [
    bootstrapStyles,
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

  override render() {
    console.log(this.href);
    if (Object.values(this.href).every((value) => value === undefined)) {
      console.error("href is not a valid URIComponents object");
      return nothing;
    }

    return html`
      <a .href=${this.assembleURI()}>
        <slot></slot>
      </a>
    `;
  }
}
