import {
    faChevronDown,
    faChevronUp,
    faEdit,
    faSave,
    faTimes,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
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
import { repeat } from "lit/directives/repeat.js";
import { InputsSnapshot } from "../lib/InputsSnapshot";
import { IntersectionObserverHandler } from "../lib/IntersectionObserverHandler";
import { QueryBuilder } from "../lib/URLStateHandler/QueryBuilder";
import { InputConverter } from "../lib/converters/InputConverter/InputConverter";
import { __, attr__ } from "../lib/translate";
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

    @property({ type: Array }) headers: string[] = [];

    @property({ type: Boolean, attribute: "is-editable" }) isEditable = false;

    @property({ type: Boolean, attribute: "is-deletable" }) isDeletable = false;

    @property({ type: Boolean, attribute: "is-expandable" })
    protected isExpandable = false;

    @state() private expandedUUIDs = new Set<string>();

    @property({ type: Object }) queryBuilder?: QueryBuilder;

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

    protected sortableColumns: SortableColumns = ["id"];

    protected unsortableColumns: string[] = [];

    protected leftAlignedColumns: string[] = [];

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

    private UUIDs = new Set<string>();

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        utilityStyles,
        css`
            .pip {
                background: #ffffff;
                border-radius: 0.5rem;
                height: fit-content !important;
                max-height: 80vh;
                max-height: 80dvh;
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

            .expansion-pane {
                background: rgba(0, 0, 0, 0.025);
                border-top: 1px solid rgba(0, 0, 0, 0.06);
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                padding: 1rem 1.5rem;
            }

            .expansion-label {
                color: rgba(0, 0, 0, 0.55);
                font-size: 0.75rem;
                font-weight: 600;
                letter-spacing: 0.04em;
                text-transform: uppercase;
            }

            .expansion-value {
                word-break: break-word;
                white-space: normal;
            }

            .expansion-empty {
                color: rgba(0, 0, 0, 0.35);
                font-style: italic;
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
            "input, select, textarea, .lit-element",
        );
        inputs.forEach((input) => {
            isEnabled
                ? input.removeAttribute("disabled")
                : input.setAttribute("disabled", "");
        });
    }

    private toggleCollapse(tableRow: Element, isExpanded: boolean) {
        const collapsibles = tableRow.querySelectorAll(
            ".collapse",
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
            "input, select, textarea, .lit-element",
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

    private toggleExpandFor(uuid: string) {
        if (!uuid) {
            return;
        }

        const next = new Set(this.expandedUUIDs);
        if (next.has(uuid)) {
            next.delete(uuid);
        } else {
            next.add(uuid);
        }
        this.expandedUUIDs = next;
    }

    protected formatExpansionValue(value: unknown): unknown {
        if (value === null || value === undefined || value === "") {
            return html`<span class="expansion-empty">${__("—")}</span>`;
        }
        if (typeof value === "boolean") {
            return value ? __("Yes") : __("No");
        }
        if (typeof value === "string" || typeof value === "number") {
            return String(value);
        }
        if (Array.isArray(value)) {
            return value
                .map((item) =>
                    item && typeof item === "object" && "name" in item
                        ? (item as { name: unknown }).name
                        : String(item),
                )
                .join(", ");
        }
        return String(value);
    }

    protected getExpansionFields(
        datum: Column,
    ): Array<{ label: unknown; value: unknown }> {
        const raw = (datum as { _raw?: Column })._raw ?? datum;
        return this.headers.map((header) => ({
            label: __(header),
            value: this.formatExpansionValue(raw[header]),
        }));
    }

    protected renderExpansionContent(datum: Column) {
        const fields = this.getExpansionFields(datum);
        return html`
            <div class="expansion-pane">
                <dl class="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                    ${map(
                        fields,
                        (field) => html`
                            <div class="flex flex-col gap-1">
                                <dt class="expansion-label">${field.label}</dt>
                                <dd class="expansion-value">${field.value}</dd>
                            </div>
                        `,
                    )}
                </dl>
            </div>
        `;
    }

    public handleDelete(e: Event) {
        console.info(e, this.notImplementedInBaseMessage);
    }

    private handleConfirm(e: Event) {
        this.confirmationModal.header = __("Please confirm");

        const name = this.findInRow(e.target as HTMLButtonElement, "name");
        this.confirmationModal.message ??=
            typeof name === "string"
                ? __("Are you sure you want to delete: ")
                : __("Are you sure you want to delete this entry?");

        this.confirmationModal.obj = name;
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
        data?: TaggedData[],
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
        result: { error: string | string[]; errors: KohaAPIError[] },
    ) {
        if (result.error) {
            this.toast = {
                heading: status,
                message: Array.isArray(result.error)
                    ? html`<span>Sorry!</span>
                          <ol>
                              ${result.error.map(
                                  (message: string) =>
                                      html`<li>${message}</li>`,
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
                                </li>`,
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
            }, 0),
        );
    }

    private sortColumns() {
        const { data } = this;

        const hasData = data?.length > 0;
        const [headers] = hasData ? data : [];
        this.headers = this.order.filter(
            (header) => headers && {}.hasOwnProperty.call(headers, header),
        );

        if (hasData) {
            this.data = this.order.length
                ? (this.sortByOrder(data, this.order) as [])
                : data;
        }
    }

    protected override willUpdate(
        _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>,
    ): void {
        super.willUpdate(_changedProperties);
        this.sortColumns();
        this.assignUUIDs();
    }

    private generateRandomUUID() {
        const array = new Uint32Array(4);
        crypto.getRandomValues(array);
        const valueString = array
            .map((value) => Number(value.toString(16).padStart(8, "0")))
            .join("");
        return [
            valueString.slice(0, 8),
            valueString.slice(8, 12),
            valueString.slice(12, 16),
            valueString.slice(16, 20),
            valueString.slice(20),
        ].join("-");
    }

    private assignUUIDs() {
        this.data.forEach((datum) => {
            if (!datum["uuid"]) {
                let newUUID = this.generateRandomUUID();
                while (this.UUIDs.has(newUUID)) {
                    newUUID = this.generateRandomUUID();
                }
                datum["uuid"] = newUUID;
                this.UUIDs.add(newUUID);
            }
        });
    }

    protected override firstUpdated(
        _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>,
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
                0,
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
                    orderBy: name,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.intersectionObserverHandler?.destroy();
    }

    private renderActionHeaderMaybe() {
        return this.isEditable
            ? html`<th class="text-center text-base font-medium">
                  ${__("actions")}
              </th>`
            : nothing;
    }

    private renderExpandHeaderMaybe() {
        return this.isExpandable
            ? html`<th class="text-center text-base font-medium">
                  ${__("details")}
              </th>`
            : nothing;
    }

    private renderExpandButtonMaybe(uuid: string, isExpanded: boolean) {
        return this.isExpandable
            ? html`
                  <td class="p-0 text-center">
                      <div class="join !flex">
                          <button
                              @click=${() => this.toggleExpandFor(uuid)}
                              type="button"
                              class="btn join-item flex-1 rounded-none"
                              aria-expanded=${isExpanded ? "true" : "false"}
                              aria-label=${attr__("Toggle details")}
                          >
                              ${litFontawesome(
                                  isExpanded ? faChevronUp : faChevronDown,
                                  {
                                      className:
                                          "w-4 h-4 inline-block sm:hidden",
                                  },
                              )}
                              <span class="hidden sm:inline"
                                  >${isExpanded
                                      ? __("Collapse")
                                      : __("Expand")}</span
                              >
                          </button>
                      </div>
                  </td>
              `
            : nothing;
    }

    private renderActionButtonsMaybe() {
        return this.isEditable
            ? html`
                  <td class="p-0 text-center">
                      <div class="join !flex">
                          <button
                              @click=${this.toggleEdit}
                              type="button"
                              class="btn-edit btn join-item flex-1 rounded-none"
                              aria-label=${attr__("Edit")}
                          >
                              <span
                                  class="start-edit pointer-events-none flex gap-2"
                                  >${litFontawesome(faEdit, {
                                      className:
                                          "w-4 h-4 inline-block sm:hidden",
                                  })}
                                  <span class="hidden sm:inline"
                                      >${__("Edit")}</span
                                  ></span
                              >
                              <span
                                  class="abort-edit pointer-events-none hidden gap-2"
                                  >${litFontawesome(faTimes, {
                                      className:
                                          "w-4 h-4 inline-block sm:hidden",
                                  })}
                                  <span class="hidden sm:inline"
                                      >${__("Abort")}</span
                                  ></span
                              >
                          </button>
                          <button
                              @click=${this.handleSave}
                              type="button"
                              class="btn join-item flex-1 rounded-none"
                              aria-label=${attr__("Save")}
                          >
                              ${litFontawesome(faSave, {
                                  className: "w-4 h-4 inline-block sm:hidden",
                              })}
                              <span class="hidden sm:inline"
                                  >${__("Save")}</span
                              >
                          </button>
                          <button
                              @click=${this.handleConfirm}
                              type="button"
                              class="${classMap({
                                  hidden: !this.isDeletable,
                              })} btn join-item flex-1 rounded-none"
                              aria-label=${attr__("Delete")}
                          >
                              ${litFontawesome(faTrash, {
                                  className: "w-4 h-4 inline-block sm:hidden",
                              })}
                              <span class="hidden sm:inline"
                                  >${__("Delete")}</span
                              >
                          </button>
                          <lms-confirmation-modal
                              @confirm=${this.handleDelete}
                          ></lms-confirmation-modal>
                      </div>
                  </td>
              `
            : nothing;
    }

    override render() {
        return html`
            <div class="mx-4">
                <lms-data-navbar
                    class=${classMap({
                        hidden: !this.hasControls,
                    })}
                >
                    <lms-search
                        slot="navbar-center"
                        .sortableColumns=${this.sortableColumns}
                    ></lms-search>
                    <lms-pagination slot="navbar-end"></lms-pagination>
                </lms-data-navbar>
                <div class="overflow-x-auto overflow-y-clip">
                    <table
                        class="${classMap({
                            hidden: !this.data.length,
                        })} table table-lg bg-base-100"
                    >
                        <thead>
                            <tr>
                                ${map(this.headers, (key) =>
                                    this.sortableColumns.includes(key)
                                        ? html`<th
                                              class="cursor-pointer text-center text-base font-medium"
                                              title=${attr__("Click to sort")}
                                              data-name=${key}
                                              @click=${this.handleSortChange}
                                          >
                                              ${__(key)}
                                          </th>`
                                        : html`<th
                                              class="text-center text-base font-medium"
                                          >
                                              ${__(key)}
                                          </th>`,
                                )}
                                ${this.renderActionHeaderMaybe()}
                                ${this.renderExpandHeaderMaybe()}
                            </tr>
                        </thead>
                        <tbody>
                            ${repeat(
                                this.data,
                                (datum) => datum["uuid"],
                                (datum) => {
                                    const uuid = datum["uuid"] as string;
                                    const isExpanded =
                                        this.expandedUUIDs.has(uuid);
                                    const colSpan =
                                        this.headers.length +
                                        (this.isEditable ? 1 : 0) +
                                        (this.isExpandable ? 1 : 0);
                                    return html`
                                        <tr class="h-full">
                                            ${map(this.headers, (header) => {
                                                const value = datum[header];
                                                const titleText =
                                                    typeof value === "string"
                                                        ? value
                                                        : typeof value ===
                                                            "number"
                                                          ? String(value)
                                                          : "";
                                                const alignClass =
                                                    this.leftAlignedColumns.includes(
                                                        header,
                                                    )
                                                        ? "px-2 py-0 text-left"
                                                        : "p-0 text-center";
                                                return html`<td
                                                    class=${alignClass}
                                                    title="${titleText || ""}"
                                                >
                                                    ${value}
                                                </td>`;
                                            })}
                                            ${this.renderActionButtonsMaybe()}
                                            ${this.renderExpandButtonMaybe(
                                                uuid,
                                                isExpanded,
                                            )}
                                        </tr>
                                        ${this.isExpandable && isExpanded
                                            ? html`
                                                  <tr class="expansion">
                                                      <td
                                                          colspan=${colSpan}
                                                          class="p-0"
                                                      >
                                                          ${this.renderExpansionContent(
                                                              datum,
                                                          )}
                                                      </td>
                                                  </tr>
                                              `
                                            : nothing}
                                    `;
                                },
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
}
