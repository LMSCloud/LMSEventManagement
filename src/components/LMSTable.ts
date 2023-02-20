import { html, css, LitElement, nothing } from "lit";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import TranslationHandler from "../lib/TranslationHandler";
import { customElement, property } from "lit/decorators";
import LMSToast from "./LMSToast";
import { Gettext } from "gettext.js";

@customElement("lms-table")
export default class LMSTable extends LitElement {
  @property({ type: Array }) data = [];
  @property({ type: Boolean, attribute: false }) _isEditable = false;
  @property({ type: Boolean, attribute: false }) _isDeletable = false;
  @property({ state: true }) _toast = {
    heading: "",
    message: "",
  };
  @property({ state: true }) _i18n: Gettext = {} as Gettext;
  @property({ state: true }) _notImplementedInBaseMessage =
    "Implement this method in your extended LMSTable component.";

  static override styles = [
    bootstrapStyles,
    css`
      table {
        background: white;
        padding: 1em;
      }

      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #ffffff;
      }

      button {
        white-space: nowrap;
      }
    `,
  ];

  async _init() {
    const translationHandler = new TranslationHandler();
    await translationHandler.loadTranslations();
    this._i18n = translationHandler.i18n;
  }

  _handleEdit() {
    console.info(this._notImplementedInBaseMessage);
  }

  _handleSave() {
    console.info(this._notImplementedInBaseMessage);
  }

  _handleDelete() {
    console.info(this._notImplementedInBaseMessage);
  }

  _renderToast(status: string, result: { error: string; errors: ErrorEvent }) {
    if (result.error) {
      this._toast = {
        heading: status,
        message: result.error,
      };
    }

    if (result.errors) {
      this._toast = {
        heading: status,
        message: Object.values(result.errors)
          .map(({ message, path }) => `Sorry! ${message} at ${path}`)
          .join(" & "),
      };
    }

    const lmsToast = document.createElement("lms-toast", {
      is: "lms-toast",
    }) as LMSToast;
    lmsToast.heading = this._toast.heading;
    lmsToast.message = this._toast.message;
    this.renderRoot.appendChild(lmsToast);
  }

  override render() {
    const { data } = this;

    const hasData = data?.length > 0 ?? false;
    const [headers] = hasData ? data : [];

    if (hasData) {
      return !this._i18n?.gettext
        ? nothing
        : html`
            <div class="container-fluid mx-0 px-0">
              <table
                class="table table-striped table-bordered table-hove table-responsive-xl"
              >
                <thead>
                  <tr>
                    ${Object.keys(headers).map(
                      (key) =>
                        html`<th scope="col">${this._i18n.gettext(key)}</th>`
                    )}
                    ${this._isEditable
                      ? html`<th scope="col">
                          ${this._i18n.gettext("actions")}
                        </th>`
                      : html``}
                  </tr>
                </thead>
                <tbody>
                  ${data.map(
                    (item) => html`
                      <tr>
                        ${Object.keys(item).map(
                          (key) => html`<td>${item[key]}</td>`
                        )}
                        ${this._isEditable
                          ? html`
                              <td>
                                <div class="d-flex">
                                  <button
                                    @click=${this._handleEdit}
                                    type="button"
                                    class="btn btn-dark mx-2"
                                  >
                                    ${litFontawesome(faEdit)}
                                    <span
                                      >&nbsp;${this._i18n.gettext("Edit")}</span
                                    >
                                  </button>
                                  <button
                                    @click=${this._handleSave}
                                    type="button"
                                    class="btn btn-dark mx-2"
                                  >
                                    ${litFontawesome(faSave)}
                                    <span
                                      >&nbsp;${this._i18n.gettext("Save")}</span
                                    >
                                  </button>
                                  <button
                                    @click=${this._handleDelete}
                                    ?hidden=${!this._isDeletable}
                                    type="button"
                                    class="btn btn-danger mx-2"
                                  >
                                    ${litFontawesome(faTrash)}
                                    <span
                                      >&nbsp;${this._i18n.gettext(
                                        "Delete"
                                      )}</span
                                    >
                                  </button>
                                </div>
                              </td>
                            `
                          : html``}
                      </tr>
                    `
                  )}
                </tbody>
              </table>
            </div>
          `;
    }

    return nothing;
  }
}
