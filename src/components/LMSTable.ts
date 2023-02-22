import { html, css, LitElement, nothing, PropertyValueMap } from "lit";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
// import TranslationHandler from "../lib/TranslationHandler";
import { customElement, property } from "lit/decorators";
import LMSToast from "./LMSToast";
import { Gettext } from "gettext.js";

@customElement("lms-table")
export default class LMSTable extends LitElement {
  @property({ type: Array }) data = [];
  @property({ type: Array }) order: string[] = [];
  @property({ type: Array, attribute: false }) _headers: string[] = [];
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

  // private async init() {
  //   const translationHandler = new TranslationHandler();
  //   await translationHandler.loadTranslations();
  //   this._i18n = translationHandler.i18n;
  // }

  private handleEdit() {
    console.info(this._notImplementedInBaseMessage);
  }

  private handleSave() {
    console.info(this._notImplementedInBaseMessage);
  }

  private handleDelete() {
    console.info(this._notImplementedInBaseMessage);
  }

  renderToast(status: string, result: { error: string; errors: ErrorEvent }) {
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

  private sortByOrder(data: unknown, order: string[]) {
    if (!(data instanceof Array)) {
      return data;
    }

    return data.sort((a, b) =>
      order.reduce((result, column) => {
        if (result !== 0) {
          return result;
        }
        const aValue = a[column];
        const bValue = b[column];
        if (aValue < bValue) {
          return -1;
        }
        if (aValue > bValue) {
          return 1;
        }
        return 0;
      }, 0)
    );
  }

  private sortColumns() {
    const { data } = this;

    const hasData = data?.length > 0 ?? false;
    const [headers] = hasData ? data : [];
    this._headers = this.order.filter(
      (key) => headers && Object.prototype.hasOwnProperty.call(headers, key)
    );

    if (hasData) {
      this.data = this.order.length
        ? (this.sortByOrder(data, this.order) as [])
        : data;
    }
  }

  protected override willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.willUpdate(_changedProperties);
    this.sortColumns();
  }

  override render() {
    return !this.data.length
      ? nothing
      : html`
          <div class="container-fluid mx-0">
            <table
              class="table table-striped table-bordered table-hove table-responsive-xl"
            >
              <thead>
                <tr>
                  ${this._headers.map(
                    (key) => html`<th scope="col">${key}</th>`
                  )}
                  ${this._isEditable
                    ? html`<th scope="col">actions</th>`
                    : html``}
                </tr>
              </thead>
              <tbody>
                ${this.data.map(
                  (item) => html`
                    <tr>
                      ${this._headers.map((key) => html`<td>${item[key]}</td>`)}
                      ${this._isEditable
                        ? html`
                            <td>
                              <div class="d-flex">
                                <button
                                  @click=${this.handleEdit}
                                  type="button"
                                  class="btn btn-dark mx-2"
                                >
                                  ${litFontawesome(faEdit)}
                                  <span>&nbsp;Edit</span>
                                </button>
                                <button
                                  @click=${this.handleSave}
                                  type="button"
                                  class="btn btn-dark mx-2"
                                >
                                  ${litFontawesome(faSave)}
                                  <span>&nbsp;Save</span>
                                </button>
                                <button
                                  @click=${this.handleDelete}
                                  ?hidden=${!this._isDeletable}
                                  type="button"
                                  class="btn btn-danger mx-2"
                                >
                                  ${litFontawesome(faTrash)}
                                  <span>&nbsp;Delete</span>
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
}
