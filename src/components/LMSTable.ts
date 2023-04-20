import {
  html,
  css,
  LitElement,
  PropertyValueMap,
  TemplateResult,
  nothing,
} from "lit";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import {
  faEdit,
  faSave,
  faTrash,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { customElement, property, state } from "lit/decorators.js";
import LMSToast from "./LMSToast";
import { Column } from "../sharedDeclarations";
import { map } from "lit/directives/map.js";
// import { repeat } from "litk/directives/repeat.js";
import { __ } from "../lib/translate";
import { skeletonStyles } from "./styles/skeleton";

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
  @state() private notImplementedInBaseMessage =
    "Implement this method in your extended LMSTable component.";
  @state() protected emptyTableMessage = html`${__("No data to display")}.`;

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
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

      .fa-sort-up,
      .fa-sort-down {
        color: #000000;
      }

      button {
        white-space: nowrap;
      }

      input[type="checkbox"].form-control {
        font-size: 0.375rem;
      }
    `,
  ];

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

  private sortColumnByValue({ column, direction }: sortTask) {
    console.log("sortColumnByValue", column, direction);
    const { data } = this;
    const hasData = data?.length > 0 ?? false;

    if (hasData) {
      this.data = data.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];

        if (aValue instanceof Object) {
          [aValue] = (aValue as TemplateResult).values as unknown as (
            | string
            | number
          )[];
        }
        if (bValue instanceof Object) {
          [bValue] = (bValue as TemplateResult).values as unknown as (
            | string
            | number
          )[];
        }

        if (aValue < bValue) {
          return direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    this.requestUpdate();
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
                  ${map(
                    this.headers,
                    (key) =>
                      html`<th scope="col">
                        <div class="d-flex">
                          ${__(key)}
                          <button
                            class="btn btn-sm btn-sort"
                            @click=${() =>
                              this.sortColumnByValue({
                                column: key,
                                direction: "asc",
                              })}
                          >
                            ${litFontawesome(faSortUp)}
                          </button>
                          <button
                            class="btn btn-sm btn-sort"
                            @click=${() =>
                              this.sortColumnByValue({
                                column: key,
                                direction: "desc",
                              })}
                          >
                            ${litFontawesome(faSortDown)}
                          </button>
                        </div>
                      </th>`
                  )}
                  ${this.isEditable
                    ? html`<th scope="col">${__("actions")}</th>`
                    : nothing}
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
                                  <span>${__("Edit")}</span>
                                </button>
                                <button
                                  @click=${this.handleSave}
                                  type="button"
                                  class="btn btn-dark mx-2"
                                >
                                  ${litFontawesome(faSave)}
                                  <span>${__("Save")}</span>
                                </button>
                                <button
                                  @click=${this.handleDelete}
                                  ?hidden=${!this.isDeletable}
                                  type="button"
                                  class="btn btn-danger mx-2"
                                >
                                  ${litFontawesome(faTrash)}
                                  <span>${__("Delete")}</span>
                                </button>
                              </div>
                            </td>
                          `
                        : nothing}
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        `;
  }
}
