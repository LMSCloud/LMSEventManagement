import {
  html,
  css,
  LitElement,
  PropertyValueMap,
  nothing,
} from "lit";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import {
  faEdit,
  faSave,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import LMSToast from "./LMSToast";
import { Column, TaggedData } from "../sharedDeclarations";
import { map } from "lit/directives/map.js";
import { __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { InputConverter } from "../lib/converters";
import { utilityStyles } from "../styles/utilities";

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
  private notImplementedInBaseMessage =
    "Implement this method in your extended LMSTable component.";
  protected emptyTableMessage = html`${__("No data to display")}.`;
  private inputConverter = new InputConverter();
  @queryAll("input, select, textarea") inputs!: NodeListOf<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;
  @queryAll(".btn-edit") editButtons!: NodeListOf<HTMLButtonElement>;

  static override styles = [
    bootstrapStyles,
    skeletonStyles,
    utilityStyles,
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

  private updateButtonState(button: HTMLButtonElement, isActive: boolean) {
    button.classList.toggle("active", isActive);
    button.querySelector(".start-edit")?.classList.toggle("d-none", isActive);
    button.querySelector(".abort-edit")?.classList.toggle("d-none", !isActive);
  }

  private toggleInputs(tableRow: Element, isEnabled: boolean) {
    const inputs = tableRow.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      isEnabled
        ? input.removeAttribute("disabled")
        : input.setAttribute("disabled", "");
    });
  }

  private toggleCollapse(tableRow: Element, isExpanded: boolean) {
    const collapsibles = tableRow.querySelectorAll(".collapse");
    collapsibles.forEach((collapse) => {
      isExpanded
        ? collapse.classList.add("show")
        : collapse.classList.remove("show");
    });
  }

  protected toggleEdit(e: Event) {
    const button = e.target as HTMLButtonElement;
    if (!button) return;

    this.inputs?.forEach((input) => {
      input.setAttribute("disabled", "");
    });

    const tableRow = button.closest("tr");
    if (button.classList.contains("active") && tableRow) {
      this.toggleCollapse(tableRow, false);
      this.updateButtonState(button, false);
      this.toggleInputs(tableRow, false);
      return;
    }

    this.editButtons?.forEach((editButton) => {
      this.updateButtonState(editButton, false);
    });

    if (tableRow) {
      this.toggleCollapse(tableRow, true);
      this.updateButtonState(button, true);
      this.toggleInputs(tableRow, true);
    }
  }

  public handleSave(e: Event) {
    console.info(e, this.notImplementedInBaseMessage);
  }

  public handleDelete(e: Event) {
    console.info(e, this.notImplementedInBaseMessage);
  }

  protected *getColumnData(
    query: Record<string, string | number | boolean | any[]>,
    data?: TaggedData[]
  ) {
    for (const [name, value] of Object.entries(query)) {
      yield [name, this.inputConverter.getInputTemplate({ name, value, data })];
    }
  }

  protected renderToast(
    status: string,
    result: { error: string; errors: ErrorEvent }
  ) {
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

  protected override willUpdate(
    _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
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
                    (key) => html`<th scope="col">${__(key)}</th>`
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
                                  @click=${this.toggleEdit}
                                  type="button"
                                  class="btn btn-dark mx-2 btn-edit"
                                >
                                  <span class="start-edit pointer-events-none"
                                    >${litFontawesome(faEdit)}&nbsp;${__(
                                      "Edit"
                                    )}</span
                                  >
                                  <span
                                    class="abort-edit d-none pointer-events-none"
                                    >${litFontawesome(faTimes)}&nbsp;${__(
                                      "Abort"
                                    )}</span
                                  >
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
