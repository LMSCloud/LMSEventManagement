import { __ } from "../lib/translate";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { InputType } from "../sharedDeclarations";

type Structure =
  | {
      type: "uniform";
      classes: string[];
      group: string;
      ids: number[];
      inputType: InputType;
      fields: {
        [id: number]: {
          value: string | number | boolean;
        };
      };
    }
  | {
      type: "varying";
      fields: {
        [id: string]: {
          classes: string[];
          label: string;
          name: string;
          type: InputType;
          value: string | number | boolean;
          additionalProperties: {
            [propertyName: string]: string | number | boolean;
          };
        };
      };
    };

@customElement("lms-dropdown")
export default class LMSDropdown extends LitElement {
  @property({ type: Boolean }) isHidden = false;
  @property({ type: Boolean }) shouldFold = false;
  @property({ type: Boolean }) isOpen = false;
  @property({ type: String }) label = "";
  @property({ type: Object }) structure!: Structure;

  static override styles = [bootstrapStyles];

  private handleDropdownToggle() {
    this.dispatchEvent(
      new CustomEvent("toggle", { bubbles: true, composed: true })
    );
    this.isOpen = !this.isOpen;
  }

  private isUniform(
    structure: Structure
  ): structure is Structure & { type: "uniform" } {
    return structure.type === "uniform";
  }

  private emitChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target) {
      target.dispatchEvent(
        new Event("change", { composed: true, bubbles: true })
      );
    }
  }

  private renderUniformStructure(structure: Structure & { type: "uniform" }) {
    return map(structure.ids, (id) => {
      const { inputType, classes, group } = structure;
      const field = structure.fields[id];
      if (!field) return nothing;

      const { value } = field;
      return html` <div
        class="form-group ${classMap({
          "form-check": inputType === "checkbox",
        })}"
      >
        ${inputType !== "checkbox"
          ? html`<label for=${id}>${value}</label>`
          : nothing}
        ${inputType === "checkbox"
          ? html`<input
              type=${inputType}
              class=${classes.join(" ")}
              name=${group}
              id=${id}
              ?checked=${(typeof value === "boolean" && value) || false}
              @change=${this.emitChange}
            />`
          : html`<input
              type=${inputType}
              class=${classes.join(" ")}
              name=${group}
              id=${id}
              @change=${this.emitChange}
            />`}
        ${inputType === "checkbox"
          ? html`<label class="form-check-label" for=${id}
              >${field.value}</label
            >`
          : nothing}
      </div>`;
    });
  }

  private renderVaryingStructure(structure: Structure & { type: "varying" }) {
    const { fields } = structure;
    return map(Object.keys(fields), (id) => {
      const field = fields[id];
      if (!field) return nothing;

      const { type, classes, name, value, label, additionalProperties } = field;
      return html` <div
        class="form-group ${classMap({
          "form-check": type === "checkbox",
        })}"
      >
        ${type !== "checkbox"
          ? html`<label for=${id}>${label}</label>`
          : nothing}
        ${type === "checkbox"
          ? html`<input
              type=${type}
              class=${classes.join(" ")}
              name=${name}
              id=${id}
              ?checked=${value}
              @change=${this.emitChange}
            />`
          : type === "number"
          ? html`
              <input
                type=${type}
                class=${classes.join(" ")}
                name=${name}
                id=${id}
                min=${additionalProperties.min}
                max=${additionalProperties.max}
                @change=${this.emitChange}
              />
            `
          : html`
              <input
                type=${type}
                class=${classes.join(" ")}
                name=${name}
                id=${id}
                @change=${this.emitChange}
              />
            `}
        ${type === "checkbox"
          ? html`<label class="form-check-label" for=${id}>${label}</label>`
          : nothing}
      </div>`;
    });
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
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded=${this.isOpen}
          @click=${this.handleDropdownToggle}
        >
          ${this.label}
        </button>
        <div class="dropdown-menu w-100 p-2 ${classMap({ show: this.isOpen })}">
          ${this.isUniform(this.structure)
            ? this.renderUniformStructure(this.structure)
            : this.renderVaryingStructure(this.structure)}
        </div>
      </div>
    `;
  }
}
