import { faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, PropertyValues, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import pell from "pell";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { utilityStyles } from "../styles/utilities";

@customElement("lms-pell-editor")
export default class LMSPellEditor extends LitElement {
  @property({ type: String }) value = "";

  @query("#modal") modal!: HTMLDialogElement;

  @query("#editor") editor!: HTMLDivElement;

  private editedValue = "";

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
    utilityStyles,
    css`
      #modal::part(backdrop) {
        background-color: rgb(0 0 0 / 50%);
      }

      #modal {
        position: fixed;
        padding: 1em;
        border: 1px solid var(--separator-mid);
        border-radius: 0.5rem;
        margin: auto;
        box-shadow: var(--shadow-hv);
        width: 25vw;
      }

      #editor {
        width: 100%;
      }

      .pell-actionbar {
        display: flex;
        justify-content: space-between;
        background-color: #f5f5f5;
        padding: 1em;
        border: 1px solid #ddd;
        border-radius: 0.25rem;
        margin-bottom: 1em;
      }

      .pell-button {
        background: none;
        border: none;
        cursor: pointer;
        color: #333;
      }

      .pell-button:hover {
        color: #007bff;
      }

      .pell-content {
        height: 200px;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 0.25rem;
        padding: 1em;
      }

      .pell-button-selected {
        color: #007bff;
      }

      svg {
        display: inline-block;
        width: 0.75em;
        height: 0.75em;
        color: #6c757d;
      }
    `,
  ];

  override render() {
    return html`
      <button
        class="btn btn-outline-secondary float-right mt-3"
        @click=${this.openModal}
      >
        ${litFontawesome(faArrowsAlt)}&nbsp;${__("Edit")}
      </button>
      <dialog id="modal">
        <div id="editor" class="m-auto"></div>
        <div class="d-flex justify-content-end mt-3">
          <button
            class="btn btn-secondary mr-3"
            @click=${this.closeModalWithoutSaving}
          >
            ${__("Close")}
          </button>
          <button class="btn btn-primary" @click=${this.closeModalWithSave}>
            ${__("Save")}
          </button>
        </div>
      </dialog>
    `;
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    // Initialize pell editor
    this.initEditor();
  }

  private openModal() {
    this.modal.showModal();
    this.editedValue = this.value; // Copy the value property
  }

  private closeModalWithoutSaving() {
    this.modal.close();
  }

  private closeModalWithSave() {
    this.modal.close();

    // Update the value property and dispatch event
    if (this.editedValue !== this.value) {
      this.dispatchEvent(
        new CustomEvent("closed", {
          detail: {
            value: this.editedValue,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private initEditor() {
    if (this.editor) {
      // Initialize pell editor
      const editor = pell.init({
        element: this.editor,
        onChange: (html) => {
          this.editedValue = html; // Update the editedValue with the edited content
        },
        defaultParagraphSeparator: "div",
        styleWithCSS: false,
        actions: [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "heading1",
          "heading2",
          "paragraph",
          "quote",
          "olist",
          "ulist",
          "code",
          "line",
          "link",
          "image",
        ],
        classes: {
          actionbar: "pell-actionbar",
          button: "pell-button",
          content: "pell-content",
          selected: "pell-button-selected",
        },
      });

      editor.content.innerHTML = this.value; // Set the initial value
      editor.content.focus(); // Focus the editor
    }
  }
}
