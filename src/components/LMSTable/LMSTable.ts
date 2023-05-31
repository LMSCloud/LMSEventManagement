import {
  faEdit,
  faSave,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { bootstrapStyles } from "@granite-elements/granite-lit-bootstrap/granite-lit-bootstrap-min.js";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, PropertyValueMap, css, html, nothing } from "lit";
import {
  customElement,
  property,
  query,
  queryAll,
  state,
} from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { searchSyntax } from "../../docs/searchSyntax";
import { QueryBuilder } from "../../lib/QueryBuilder";
import { InputConverter } from "../../lib/converters";
import { __, attr__ } from "../../lib/translate";
import { throttle } from "../../lib/utilities";
import {
  Column,
  KohaAPIError,
  SortableColumns,
  TaggedData,
  Toast,
} from "../../sharedDeclarations";
import { skeletonStyles } from "../../styles/skeleton";
import { utilityStyles } from "../../styles/utilities";
import LMSPagination from "../LMSPagination";
import LMSSearch from "../LMSSearch";
import LMSToast from "../LMSToast";
import LMSTableControls from "./LMSTableControls";
import { IntersectionObserverHandler } from "../../lib/IntersectionObserverHandler";

declare global {
  interface HTMLElementTagNameMap {
    "lms-table-controls": LMSTableControls;
    "lms-pagination": LMSPagination;
    "lms-search": LMSSearch;
  }
}

type HorizontalWidthProps =
  | "marginLeft"
  | "marginRight"
  | "paddingLeft"
  | "paddingRight";

@customElement("lms-table")
export default class LMSTable extends LitElement {
  @property({ type: Array }) data: Column[] = [];

  @property({ type: Array }) order: string[] = [];

  @property({ type: Array }) private headers: string[] = [];

  @property({ type: Boolean, attribute: "is-editable" }) protected isEditable =
    false;

  @property({ type: Boolean, attribute: "is-deletable" })
  protected isDeletable = false;

  @property({ type: Object }) queryBuilder?: QueryBuilder;

  @property({ type: Array }) nextPage: Column[] | undefined = undefined;

  @property({ type: Boolean }) hasNoResults = false;

  @property({ type: Number }) _page = 1;

  @property({ type: Number }) _per_page = 20;

  @state() toast: Toast = {
    heading: "",
    message: "",
  };

  @queryAll("input, select, textarea") inputs!: NodeListOf<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;

  @queryAll(".btn-edit") editButtons!: NodeListOf<HTMLButtonElement>;

  @queryAll(".collapse") collapsibles!: NodeListOf<HTMLElement>;

  @query("table") table!: HTMLTableElement;

  protected emptyTableMessage = html`${__("No data to display")}.`;

  protected sortableColumns: SortableColumns = ["id"];

  protected unsortableColumns: string[] = [];

  protected hasControls = true;

  protected inputConverter = new InputConverter();

  private notImplementedInBaseMessage =
    "Implement this method in your extended LMSTable component.";

  private throttledHandleResize: () => void;

  private intersectionObserverHandler: IntersectionObserverHandler | null =
    null;

  private footer: HTMLElement | undefined | null =
    document.getElementById("i18nMenu")?.parentElement;

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

      .table tr {
        height: 100%;
      }

      input:not([type="checkbox"]),
      select,
      textarea {
        border: none !important;
        border-radius: 0 !important;
        height: inherit !important;
        width: 100%;
        min-width: fit-content;
        padding: 1.5rem 0.75rem;
      }

      .table th {
        cursor: pointer;
      }

      .table td {
        padding: 0;
        text-align: center;
        height: inherit;
      }

      .pip {
        background: #ffffff;
        bottom: 1em;
        box-shadow: var(--shadow-hv);
        height: fit-content !important;
        left: 1em;
        max-height: 30vh;
        overflow-y: scroll;
        padding: 1em;
        position: absolute;
      }

      @media (max-width: 576px) {
        lms-search {
          width: 100%;
          margin-bottom: 1rem;
        }

        lms-pagination {
          width: 100%;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.throttledHandleResize = throttle(this.handleResize.bind(this), 250);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("resize", this.throttledHandleResize);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.throttledHandleResize);
  }

  private updateButtonState(button: HTMLButtonElement, isActive: boolean) {
    button.classList.toggle("active", isActive);
    button.querySelector(".start-edit")?.classList.toggle("d-none", isActive);
    button.querySelector(".abort-edit")?.classList.toggle("d-none", !isActive);
  }

  private toggleInputs(tableRow: Element, isEnabled: boolean) {
    const inputs = tableRow.querySelectorAll(
      "input, select, textarea, .btn-embedded"
    );
    inputs.forEach((input) => {
      isEnabled
        ? input.removeAttribute("disabled")
        : input.setAttribute("disabled", "");
    });
  }

  private toggleCollapse(tableRow: Element, isExpanded: boolean) {
    const collapsibles = tableRow.querySelectorAll(".collapse");
    collapsibles.forEach((collapse) => {
      const parent = collapse.parentElement;
      if (isExpanded) {
        parent?.classList.add("pip");
        collapse.classList.add("show");
      } else {
        parent?.classList.remove("pip");
        collapse.classList.remove("show");
      }
    });
  }

  /**
   * Toggles the edit mode for a table row.
   * For the close on Save feature to work, the button needs to be
   * passed as a CustomEvent detail.
   * Example: new CustomEvent("click", { detail: <BUTTON_REFERENCE> })
   * @param e
   * @returns
   */
  protected toggleEdit(e: Event | CustomEvent) {
    let button: HTMLButtonElement;
    if (e instanceof CustomEvent) {
      button = e.detail;
    } else {
      button = e.target as HTMLButtonElement;
    }
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
    query: Record<
      string,
      | string
      | number
      | boolean
      | Array<unknown>
      | Record<string, unknown>
      | null
    >,
    data?: TaggedData[]
  ) {
    for (const [name, value] of Object.entries(query)) {
      yield [name, this.inputConverter.getInputTemplate({ name, value, data })];
    }
  }

  protected renderToast(
    status: string,
    result: { error: string | string[]; errors: KohaAPIError[] }
  ) {
    if (result.error) {
      this.toast = {
        heading: status,
        message: Array.isArray(result.error)
          ? html`<span>Sorry!</span>
              <ol>
                ${result.error.map(
                  (message: string) => html`<li>${message}</li>`
                )}
              </ol>`
          : html`<span>Sorry! ${result.error}</span>`,
      };
    }

    if (result.errors) {
      this.toast = {
        heading: status,
        message: html`<span>Sorry!</span>
          <ol>
            ${result.errors.map(
              (error: KohaAPIError) =>
                html`<li>${error.message} ${__("Path")}: ${error.path}</li>`
            )}
          </ol>`,
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
      (header) => headers && {}.hasOwnProperty.call(headers, header)
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

  protected override firstUpdated(
    _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    const preexistingColumns = [
      ...this.sortableColumns,
      ...this.unsortableColumns,
    ];
    this.order.forEach((column) => {
      if (!preexistingColumns.includes(column)) {
        this.sortableColumns.push(column);
      }
    });
    this.handleResize();

    if (this.footer && this.collapsibles.length) {
      const footer = this.footer;
      const [someCollapsible] = this.collapsibles;
      const bottom = this.getBottomFromTestElement(someCollapsible);
      this.collapsibles.forEach((collapsible) => {
        const pip = collapsible.parentElement;
        if (!pip) return;
        this.intersectionObserverHandler = new IntersectionObserverHandler({
          intersecting: {
            ref: pip,
            do: () => {
              pip.style.bottom = `${
                bottom + (footer ? footer.offsetHeight : 0)
              }px`;
            },
          },
          intersected: {
            ref: footer,
          },
        });

        this.intersectionObserverHandler.init();
      });
    }
  }

  private getBottomFromTestElement(element: HTMLElement) {
    const tester = document.createElement("div");
    tester.style.position = "fixed";
    tester.style.bottom = "1em";
    element.parentElement?.appendChild(tester);
    const bottom = getComputedStyle(tester).bottom;
    tester.remove();
    return parseInt(bottom, 10);
  }

  private handleResize() {
    this.table.classList.remove("table-responsive");

    let totalSourroundingWidth = 0;
    let element: HTMLElement | null = this.table;

    const props: HorizontalWidthProps[] = [
      "marginLeft",
      "marginRight",
      "paddingLeft",
      "paddingRight",
    ];

    while (element) {
      const style = window.getComputedStyle(element);

      totalSourroundingWidth += props.reduce(
        (total, prop) => total + parseFloat(style[prop]),
        0
      );

      element =
        element.getRootNode() instanceof ShadowRoot
          ? ((element.getRootNode() as ShadowRoot).host as HTMLElement)
          : element.parentElement;
    }

    if (this.table.offsetWidth + totalSourroundingWidth > window.innerWidth) {
      this.table.classList.add("table-responsive");
    }
  }

  private handleSortChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const tableHeader = target.closest("th");
    if (!tableHeader) return;

    const { name } = tableHeader.dataset;
    this.dispatchEvent(
      new CustomEvent("sort", {
        detail: {
          _order_by: name,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleSearch(e: CustomEvent) {
    const { detail } = e;
    this.dispatchEvent(
      new CustomEvent("search", {
        detail,
        composed: true,
        bubbles: true,
      })
    );
  }

  private toggleDoc(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const doc = target.nextElementSibling;
    if (!doc) return;

    doc.classList.toggle("d-none");
  }

  override render() {
    if (!this.data.length) {
      html`<h1 class="text-center">${this.emptyTableMessage}</h1>`;
    }

    return html`
      <div class="container-fluid mx-0">
        <lms-table-controls ?hidden=${!this.hasControls}>
          <lms-search
            @search=${this.handleSearch}
            .sortableColumns=${this.sortableColumns}
          ></lms-search>
          <lms-pagination
            .nextPage=${this.nextPage}
            ._page=${this._page}
            ._per_page=${this._per_page}
          ></lms-pagination>
        </lms-table-controls>
        <div
          class="alert alert-info text-center ${classMap({
            "d-none": !this.hasNoResults,
          })}"
          role="alert"
        >
          <h4 class="alert-heading">${__("No matches found")}.</h4>
          <p>${__("Try refining your search.")}</p>
          <button class="btn btn-outline-info" @click=${this.toggleDoc}>
            ${__("Help")}
          </button>
          <div class="text-left d-none">
            <hr />
            ${searchSyntax}
          </div>
        </div>
        <table
          class="table table-striped table-bordered table-hover ${classMap({
            "d-none": this.hasNoResults,
          })}"
        >
          <thead>
            <tr>
              ${map(this.headers, (key) => {
                if (!this.sortableColumns.includes(key)) {
                  return html`<th scope="col">${__(key)}</th>`;
                }

                return html`<th
                  scope="col"
                  data-name=${key}
                  @click=${this.handleSortChange}
                >
                  ${__(key)}
                </th>`;
              })}
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
                          <div class="d-flex justify-content-center">
                            <button
                              @click=${this.toggleEdit}
                              type="button"
                              class="btn btn-dark mx-2 btn-edit"
                              aria-label=${attr__("Edit")}
                            >
                              <span class="start-edit pointer-events-none"
                                >${litFontawesome(faEdit)}
                                <span>${__("Edit")}</span></span
                              >
                              <span
                                class="abort-edit d-none pointer-events-none"
                                >${litFontawesome(faTimes)}<span
                                  >${__("Abort")}</span
                                ></span
                              >
                            </button>
                            <button
                              @click=${this.handleSave}
                              type="button"
                              class="btn btn-dark mx-2"
                              aria-label=${attr__("Save")}
                            >
                              ${litFontawesome(faSave)}
                              <span>${__("Save")}</span>
                            </button>
                            <button
                              @click=${this.handleDelete}
                              ?hidden=${!this.isDeletable}
                              type="button"
                              class="btn btn-danger mx-2"
                              aria-label=${attr__("Delete")}
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
