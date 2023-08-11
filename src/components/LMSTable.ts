import {
    faEdit,
    faSave,
    faTimes,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { css, html, LitElement, nothing, PropertyValueMap } from "lit";
import {
    customElement,
    property,
    query,
    queryAll,
    state,
} from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { searchSyntax } from "../docs/searchSyntax";
import { InputConverter } from "../lib/converters/InputConverter/InputConverter";
import { InputsSnapshot } from "../lib/InputsSnapshot";
import { IntersectionObserverHandler } from "../lib/IntersectionObserverHandler";
import { QueryBuilder } from "../lib/QueryBuilder";
import { attr__, __ } from "../lib/translate";
import { skeletonStyles } from "../styles/skeleton";
import { utilityStyles } from "../styles/utilities";
import { tailwindStyles } from "../tailwind.lit";
import {
    Column,
    KohaAPIError,
    SortableColumns,
    TaggedData,
    Toast,
} from "../types/common";
import LMSConfirmationModal from "./LMSConfirmationModal";
import LMSDataNavbar from "./LMSDataNavbar";
import LMSPagination from "./LMSPagination";
import LMSSearch from "./LMSSearch";
import LMSToast from "./LMSToast";

declare global {
    interface HTMLElementTagNameMap {
        "lms-confirmation-modal": LMSConfirmationModal;
        "lms-data-navbar": LMSDataNavbar;
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

    @property({ type: Boolean, attribute: "is-editable" })
    protected isEditable = false;

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

    @query("lms-confirmation-modal") confirmationModal!: LMSConfirmationModal;

    protected emptyTableMessage = html`${__("No data to display")}.`;

    protected sortableColumns: SortableColumns = ["id"];

    protected unsortableColumns: string[] = [];

    protected hasControls = true;

    protected inputConverter = new InputConverter();

    private notImplementedInBaseMessage =
        "Implement this method in your extended LMSTable component.";

    private intersectionObserverHandler: IntersectionObserverHandler | null =
        null;

    private footer: HTMLElement | undefined | null =
        document.getElementById("i18nMenu")?.parentElement;

    private snapshot?: InputsSnapshot;

    private orphanedTableRow?: HTMLTableRowElement;

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        utilityStyles,
        css`
            .pip {
                background: #ffffff;
                border-radius: 0.5rem;
                height: fit-content !important;
                max-height: fit-content;
                opacity: 1;
                overflow-y: scroll;
                padding: 1em;
                position: fixed;
                bottom: 1em;
                left: 1em;
                z-index: 50;
                transition: transform 0.3s ease-out;
            }

            @media (max-width: 640px) {
                .pip {
                    position: fixed;
                    bottom: 0 !important;
                    left: 0;
                    right: 0;
                    width: 100%;
                    max-height: 30vh;
                    max-height: 30dvh;
                    z-index: 1031;
                    border-radius: 0.75rem 0.75rem 0 0;
                }
            }

            input:not([type="checkbox"]),
            select,
            textarea,
            details {
                border: none !important;
                border-radius: 0 !important;
                width: 100%;
                min-width: fit-content;
            }

            input:not([type="checkbox"]) {
                padding: 1.5rem 0.75rem;
            }

            input:not([type="checkbox"]):focus,
            select:focus,
            textarea:focus {
                outline: none !important;
            }
        `,
    ];

    private updateButtonState(button: HTMLButtonElement, isActive: boolean) {
        button.classList.toggle("active", isActive);
        button
            .querySelector(".start-edit")
            ?.classList.toggle("hidden", isActive);
        button
            .querySelector(".abort-edit")
            ?.classList.toggle("hidden", !isActive);
    }

    private toggleInputs(tableRow: Element, isEnabled: boolean) {
        const inputs = tableRow.querySelectorAll(
            "input, select, textarea, .lit-element"
        );
        inputs.forEach((input) => {
            isEnabled
                ? input.removeAttribute("disabled")
                : input.setAttribute("disabled", "");
        });
    }

    private toggleCollapse(tableRow: Element, isExpanded: boolean) {
        const collapsibles = tableRow.querySelectorAll(
            ".collapse"
        ) as NodeListOf<HTMLDetailsElement>;
        collapsibles.forEach((collapse) => {
            const parent = collapse.parentElement;
            if (isExpanded) {
                parent?.classList.add("pip");
                collapse.open = true;
            } else {
                parent?.classList.remove("pip");
                collapse.open = false;
            }
        });
    }

    private takeSnapshot(tableRow: HTMLTableRowElement) {
        const inputs = tableRow.querySelectorAll(
            "input, select, textarea, .lit-element"
        );
        this.snapshot = new InputsSnapshot(inputs);
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
        const isSave = e instanceof CustomEvent;
        if (isSave) {
            button = e.detail;
        } else {
            button = e.target as HTMLButtonElement;
        }
        if (!button) {
            return;
        }

        this.inputs?.forEach((input) => {
            input.setAttribute("disabled", "");
        });

        if (!isSave) {
            this.snapshot?.revert();
        }

        const tableRow = button.closest("tr");
        if (button.classList.contains("active") && tableRow) {
            this.toggleCollapse(tableRow, false);
            this.updateButtonState(button, false);
            this.toggleInputs(tableRow, false);
            this.orphanedTableRow = undefined;
            return;
        }

        if (this.orphanedTableRow) {
            this.toggleCollapse(this.orphanedTableRow, false);
            this.orphanedTableRow = undefined;
        }

        this.editButtons?.forEach((editButton) => {
            this.updateButtonState(editButton, false);
        });

        if (tableRow) {
            this.toggleCollapse(tableRow, true);
            this.updateButtonState(button, true);
            this.takeSnapshot(tableRow);
            this.toggleInputs(tableRow, true);
            this.orphanedTableRow = tableRow;
        }
    }

    public handleSave(e: Event) {
        console.info(e, this.notImplementedInBaseMessage);
    }

    public handleDelete(e: Event) {
        console.info(e, this.notImplementedInBaseMessage);
    }

    private handleConfirm(e: Event) {
        this.confirmationModal.header = __("Please confirm");

        const name = this.findInRow(e.target as HTMLButtonElement, "name");
        if (typeof name === "string") {
            this.confirmationModal.message = __(
                "Are you sure you want to delete: "
            );
            this.confirmationModal.obj = name;
        } else {
            this.confirmationModal.message = __(
                "Are you sure you want to delete this entry?"
            );
        }

        this.confirmationModal.ref = e.target;
        this.confirmationModal.showModal();
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
            yield [
                name,
                this.inputConverter.getInputTemplate({ name, value, data }),
            ];
        }
    }

    protected findInRow(target: HTMLElement, name: string) {
        let parent = target.parentElement;
        while (parent && parent.tagName !== "TR") {
            parent = parent.parentElement;
        }

        const position = this.order.indexOf(name as string);
        let entity: string | null = null;
        if (parent) {
            let element = parent.children[position];
            const elementAtPosition = parent.children[position];

            let tagName: string | null = null;
            if (elementAtPosition) {
                tagName = elementAtPosition.tagName;
            }

            if (!tagName || !element) {
                return null;
            }

            if (tagName === "TD") {
                element = element.firstElementChild as HTMLElement;
            }

            switch (element.tagName) {
                case "INPUT":
                    entity = (element as HTMLInputElement).value;
                    break;
                case "SELECT":
                    entity = (element as HTMLSelectElement).value;
                    break;
                case "TEXTAREA":
                    entity = (element as HTMLTextAreaElement).value;
                    break;
                default:
                    entity = element.textContent;
                    break;
            }
        }

        return entity;
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
                                html`<li>
                                    ${error.message} ${__("Path")}:
                                    ${error.path}
                                </li>`
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
        if (!Array.isArray(data)) {
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
            if (!someCollapsible) {
                return;
            }

            const bottom = this.getBottomFromTestElement(someCollapsible);
            this.collapsibles.forEach((collapsible) => {
                const pip = collapsible.parentElement;
                if (!pip) {
                    return;
                }

                this.intersectionObserverHandler =
                    new IntersectionObserverHandler({
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
                    ? ((element.getRootNode() as ShadowRoot)
                          .host as HTMLElement)
                    : element.parentElement;
        }

        if (
            this.table.offsetWidth + totalSourroundingWidth >
            window.innerWidth
        ) {
            this.table.classList.add("table-responsive");
        }
    }

    private handleSortChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const tableHeader = target.closest("th");
        if (!tableHeader) {
            return;
        }

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
        if (!doc) {
            return;
        }

        doc.classList.toggle("hidden");
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.intersectionObserverHandler?.destroy();
    }

    override render() {
        if (!this.data.length) {
            html`<h1 class="text-center">${this.emptyTableMessage}</h1>`;
        }

        return html`
            <div class="mx-4">
                <lms-data-navbar
                    class=${classMap({
                        hidden: !this.hasControls,
                    })}
                >
                    <lms-search
                        slot="navbar-center"
                        @search=${this.handleSearch}
                        .sortableColumns=${this.sortableColumns}
                    ></lms-search>
                    <lms-pagination
                        slot="navbar-end"
                        .nextPage=${this.nextPage}
                        ._page=${this._page}
                        ._per_page=${this._per_page}
                    ></lms-pagination>
                </lms-data-navbar>
                <div
                    class="${classMap({
                        hidden: !this.hasNoResults,
                    })} alert alert-info"
                    role="alert"
                >
                    <h4>${__("No matches found")}.</h4>
                    <p>${__("Try refining your search.")}</p>
                    <button
                        class="btn-accent btn-outline btn"
                        @click=${this.toggleDoc}
                    >
                        ${__("Help")}
                    </button>
                    <div class="hidden text-left">
                        <hr />
                        ${searchSyntax}
                    </div>
                </div>
                <div class="overflow-x-auto overflow-y-clip">
                    <table
                        class="${classMap({
                            hidden: this.hasNoResults,
                        })} table-lg table bg-base-100"
                    >
                        <thead>
                            <tr>
                                ${map(this.headers, (key) => {
                                    if (!this.sortableColumns.includes(key)) {
                                        return html`<th
                                            class="text-center text-base font-medium"
                                        >
                                            ${__(key)}
                                        </th>`;
                                    }

                                    return html`<th
                                        class="text-center text-base font-medium"
                                        data-name=${key}
                                        @click=${this.handleSortChange}
                                    >
                                        ${__(key)}
                                    </th>`;
                                })}
                                ${this.isEditable
                                    ? html`<th
                                          class="text-center text-base font-medium"
                                      >
                                          ${__("actions")}
                                      </th>`
                                    : nothing}
                            </tr>
                        </thead>
                        <tbody>
                            ${map(
                                this.data,
                                (datum) => html`
                                    <tr class="h-full">
                                        ${map(
                                            this.headers,
                                            (header) =>
                                                html`<td
                                                    class="p-0 text-center"
                                                >
                                                    ${datum[header]}
                                                </td>`
                                        )}
                                        ${this.isEditable
                                            ? html`
                                                  <td class="p-0 text-center">
                                                      <div class="join !flex">
                                                          <button
                                                              @click=${this
                                                                  .toggleEdit}
                                                              type="button"
                                                              class="btn-edit join-item btn flex-1 rounded-none"
                                                              aria-label=${attr__(
                                                                  "Edit"
                                                              )}
                                                          >
                                                              <span
                                                                  class="start-edit pointer-events-none flex gap-2"
                                                                  >${litFontawesome(
                                                                      faEdit,
                                                                      {
                                                                          className:
                                                                              "w-4 h-4 inline-block sm:hidden",
                                                                      }
                                                                  )}
                                                                  <span
                                                                      class="hidden sm:inline"
                                                                      >${__(
                                                                          "Edit"
                                                                      )}</span
                                                                  ></span
                                                              >
                                                              <span
                                                                  class="abort-edit pointer-events-none flex hidden gap-2"
                                                                  >${litFontawesome(
                                                                      faTimes,
                                                                      {
                                                                          className:
                                                                              "w-4 h-4 inline-block sm:hidden",
                                                                      }
                                                                  )}
                                                                  <span
                                                                      class="hidden sm:inline"
                                                                      >${__(
                                                                          "Abort"
                                                                      )}</span
                                                                  ></span
                                                              >
                                                          </button>
                                                          <button
                                                              @click=${this
                                                                  .handleSave}
                                                              type="button"
                                                              class="join-item btn flex-1 rounded-none"
                                                              aria-label=${attr__(
                                                                  "Save"
                                                              )}
                                                          >
                                                              ${litFontawesome(
                                                                  faSave,
                                                                  {
                                                                      className:
                                                                          "w-4 h-4 inline-block sm:hidden",
                                                                  }
                                                              )}
                                                              <span
                                                                  class="hidden sm:inline"
                                                                  >${__(
                                                                      "Save"
                                                                  )}</span
                                                              >
                                                          </button>
                                                          <button
                                                              @click=${this
                                                                  .handleConfirm}
                                                              type="button"
                                                              class="${classMap(
                                                                  {
                                                                      hidden: !this
                                                                          .isDeletable,
                                                                  }
                                                              )} join-item btn flex-1 rounded-none"
                                                              aria-label=${attr__(
                                                                  "Delete"
                                                              )}
                                                          >
                                                              ${litFontawesome(
                                                                  faTrash,
                                                                  {
                                                                      className:
                                                                          "w-4 h-4 inline-block sm:hidden",
                                                                  }
                                                              )}
                                                              <span
                                                                  class="hidden sm:inline"
                                                                  >${__(
                                                                      "Delete"
                                                                  )}</span
                                                              >
                                                          </button>
                                                          <lms-confirmation-modal
                                                              @confirm=${this
                                                                  .handleDelete}
                                                          ></lms-confirmation-modal>
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
            </div>
        `;
    }
}
