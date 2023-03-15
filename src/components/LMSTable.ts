import { html, css, LitElement, PropertyValueMap } from "lit";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import {
  faEdit,
  faSave,
  faTrash,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
// import TranslationHandler from "../lib/TranslationHandler";
import { customElement, property, state } from "lit/decorators";
import LMSToast from "./LMSToast";
// import { Gettext } from "gettext.js";
import { Column } from "../sharedDeclarations";
import { map } from "lit/directives/map";

type sortTask = {
  column: string;
  direction: "asc" | "desc";
};

@customElement("lms-table")
export default class LMSTable extends LitElement {
  @property({ type: Array }) data: Column[] = [];
  @property({ type: Array }) order: string[] = [];
  @property({ type: Array }) private headers: string[] = [];
  @property({ type: Boolean, attribute: "is-editable" }) protected isEditable =
    false;
  @property({ type: Boolean, attribute: "is-deletable" })
  protected isDeletable = false;
  @state() private toast = {
    heading: "",
    message: "",
  };
  // @property({ state: true }) private i18n: Gettext = {} as Gettext;
  @state() private notImplementedInBaseMessage =
    "Implement this method in your extended LMSTable component.";
  @state() protected emptyTableMessage = html`No data to display.`;

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

      input[type="checkbox"].form-control {
        font-size: 0.375rem;
      }
    `,
  ];

  // private async init() {
  //   const translationHandler = new TranslationHandler();
  //   await translationHandler.loadTranslations();
  //   this.i18n = translationHandler.i18n;
  // }

  public handleEdit(e: Event) {
    console.info(e, this.notImplementedInBaseMessage);
  }

  public handleSave(e: Event) {
    console.info(e, this.notImplementedInBaseMessage);
  }

  public handleDelete(e: Event) {
    console.info(e, this.notImplementedInBaseMessage);
  }

  renderToast(status: string, result: { error: string; errors: ErrorEvent }) {
    if (result.error) {
      this.toast = {
        heading: status,
        message: result.error,
      };
    }

    if (result.errors) {
      this.toast = {
        heading: status,
        message: Object.values(result.errors)
          .map(({ message, path }) => `Sorry! ${message} at ${path}`)
          .join(" & "),
      };
    }

    const lmsToast = document.createElement("lms-toast", {
      is: "lms-toast",
    }) as LMSToast;
    lmsToast.heading = this.toast.heading;
    lmsToast.message = this.toast.message;
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
    this.headers = this.order.filter(
      (header) =>
        headers && Object.prototype.hasOwnProperty.call(headers, header)
    );

    if (hasData) {
      this.data = this.order.length
        ? (this.sortByOrder(data, this.order) as [])
        : data;
    }
  }

  private sortByColumn({ column, direction }: sortTask) {
    const { data } = this;
    const hasData = data?.length > 0 ?? false;

    console.log(JSON.stringify(this.data, null, 2));

    if (hasData) {
      this.data = data.sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];
        if (aValue < bValue) {
          return direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    console.log(JSON.stringify(this.data, null, 2));
  }

  protected override willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.willUpdate(_changedProperties);
    this.sortColumns();
  }

  override render() {
    return !this.data.length
      ? html`<h1 class="text-center">${this.emptyTableMessage}</h1>`
      : html`
          <div class="container-fluid mx-0">
            <table
              class="table table-striped table-bordered table-hover table-responsive-xl"
            >
              <thead>
                <tr>
                  ${this.headers.map(
                    (key) =>
                      html`<th scope="col">
                        ${key}
                        <button
                          class="btn btn-sm"
                          @click=${() =>
                            this.sortByColumn({
                              column: key,
                              direction: "asc",
                            })}
                        >
                          ${litFontawesome(faSortDown)}
                        </button>
                        <button
                          class="btn btn-sm"
                          @click=${() =>
                            this.sortByColumn({
                              column: key,
                              direction: "desc",
                            })}
                        >
                          ${litFontawesome(faSortUp)}
                        </button>
                      </th>`
                  )}
                  ${this.isEditable
                    ? html`<th scope="col">actions</th>`
                    : html``}
                </tr>
              </thead>
              <tbody>
                ${map(
                  this.data,
                  (datum) => html`
                    <tr>
                      ${map(
                        this.headers,
                        (header) =>
                          html`<td class="align-middle">${datum[header]}</td>`
                      )}
                      ${this.isEditable
                        ? html`
                            <td class="align-middle">
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
                                  ?hidden=${!this.isDeletable}
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
