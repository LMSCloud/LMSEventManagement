import {
    faCompressAlt,
    faEdit,
    faSave,
    faTimes,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { LitElement, PropertyValueMap, TemplateResult, html } from "lit";
import {
    customElement,
    property,
    query,
    queryAll,
    state,
} from "lit/decorators.js";
import { InputsSnapshot } from "../../lib/InputsSnapshot";
import { requestHandler } from "../../lib/RequestHandler/RequestHandler";
import { InputConverter } from "../../lib/converters/InputConverter/InputConverter";
import { convertToISO8601 } from "../../lib/converters/datetimeConverters";
import { __, attr__ } from "../../lib/translate";
import { skeletonStyles } from "../../styles/skeleton";
import { utilityStyles } from "../../styles/utilities";
import { tailwindStyles } from "../../tailwind.lit";
import {
    KohaAPIError,
    LMSEvent,
    LMSEventTargetGroupFeeReduced,
    TaggedData,
    Toast,
} from "../../types/common";
import LMSConfirmationModal from "../LMSConfirmationModal";
import LMSToast from "../LMSToast";

declare global {
    interface HTMLElementTagNameMap {
        "lms-confirmation-modal": LMSConfirmationModal;
        "lms-toast": LMSToast;
    }
}

type Datum = {
    [key: string]: TemplateResult;
};

/**
 * Custom element representing an event card form for staff members.
 */
@customElement("lms-staff-event-card-form")
export default class LMSStaffEventCardForm extends LitElement {
    @property({ type: Array }) event: LMSEvent | undefined;

    @property({ type: Array }) taggedData: TaggedData[] = [];

    @state() datum: Datum = {};

    @state() toast: Toast = {
        heading: "",
        message: "",
    };

    @queryAll("details") collapsibles!: NodeListOf<HTMLDetailsElement>;

    @queryAll("input, select, textarea, lms-image-picker")
    inputs?: NodeListOf<HTMLInputElement>;

    @query("lms-confirmation-modal") confirmationModal!: LMSConfirmationModal;

    private inputConverter = new InputConverter();

    private snapshot?: InputsSnapshot;

    static override styles = [tailwindStyles, skeletonStyles, utilityStyles];

    /**
     * Toggles the edit mode of the form.
     * @param e - The click event.
     */
    private toggleEdit(e: Event | CustomEvent) {
        e.preventDefault();
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

        if (button.classList.contains("active")) {
            button.classList.remove("active");
            button.querySelector(".start-edit")?.classList.remove("hidden");
            button.querySelector(".abort-edit")?.classList.add("hidden");
            this.inputs?.forEach((input) => {
                input.setAttribute("disabled", "");
            });
            if (!isSave) {
                this.snapshot?.revert();
            }

            this.collapseAll();
            return;
        }

        button.classList.add("active");
        button.querySelector(".start-edit")?.classList.add("hidden");
        button.querySelector(".abort-edit")?.classList.remove("hidden");
        this.inputs?.forEach((input) => {
            input.removeAttribute("disabled");
        });

        const hasOpenCollapsibles = Array.from(this.collapsibles).some(
            (collapsible) => collapsible.open
        );
        if (!hasOpenCollapsibles) {
            this.expandAll();
        }
    }

    /**
     * Processes the target group elements in the form.
     * We need to assure that the target_groups property is always an array of objects
     * containing all configured target_groups.
     * @param target - The HTMLFormElement containing the target group elements.
     * @returns The processed target group elements.
     */
    private processTargetGroupElements(target: HTMLFormElement) {
        const targetGroupElements: Array<HTMLInputElement> = Array.from(
            target.querySelectorAll(`[data-group="target_groups"]`)
        );
        if (!targetGroupElements.length) {
            return;
        }

        return targetGroupElements.reduce(
            (
                target_groups: {
                    [key: number]: LMSEventTargetGroupFeeReduced;
                },
                element
            ) => {
                const { name, id } = element;
                const databaseId = parseInt(id, 10);
                if (!target_groups[databaseId]) {
                    target_groups[databaseId] = {
                        id: databaseId,
                        selected: false,
                        fee: 0,
                    };
                }

                if (element instanceof HTMLInputElement) {
                    const target_group = target_groups[databaseId];
                    switch (name) {
                        case "selected":
                            if (target_group) {
                                target_group.selected = element.checked
                                    ? true
                                    : false;
                            }
                            break;
                        case "fee":
                            if (target_group) {
                                target_group.fee = parseFloat(element.value);
                            }
                            break;
                        default:
                            break;
                    }
                }

                return target_groups;
            },
            {}
        );
    }

    /**
     * Processes the datetime-local elements in the form.
     * We need to assure they aren't rejected by the api validation.
     * We remove the idiosyncracies from the ISO8601 standard
     * and convert straight into sql writable strings.
     * @param target - The HTMLFormElement containing the datetime-local elements.
     * @returns The processed datetime-local elements.
     */
    private processDatetimeLocalElements(target: HTMLFormElement) {
        const datetimeLocalElements: Array<HTMLInputElement> = Array.from(
            target.querySelectorAll(`[type="datetime-local"]`)
        );
        if (!datetimeLocalElements.length) {
            return;
        }

        const affectedFields = [
            "start_time",
            "end_time",
            "registration_start",
            "registration_end",
        ];

        // return an array of objects with the updated SQL-formatted datetime values
        return datetimeLocalElements.map((element) => {
            const { name, value } = element;

            if (affectedFields.includes(name) && value) {
                const iso8601formattedDate = convertToISO8601(value);
                return { name, value: iso8601formattedDate };
            }
            return { name, value };
        });
    }

    /**
     * Processes the open_registration element in the form.
     * We need to check the state of the checked attribute instead of using the value.
     * @param target - The HTMLFormElement containing the open_registration element.
     * @returns The processed open_registration element.
     */
    private processOpenRegistrationElement(target: HTMLFormElement) {
        const openRegistrationElement: HTMLInputElement | undefined =
            (target?.querySelector(
                '[name="open_registration"]'
            ) as HTMLInputElement) ?? undefined;
        if (!openRegistrationElement) {
            return;
        }

        return Boolean(openRegistrationElement.checked);
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

    /**
     * Handles the form submission for saving changes.
     * @param e - The submit event.
     */
    private async handleSave(e: Event) {
        e.preventDefault();
        const target = e.target;

        if (!(target instanceof HTMLFormElement) || !this.event?.id) {
            return;
        }

        const target_groups = this.processTargetGroupElements(target);
        if (!target_groups) {
            return;
        }

        const datetimeLocalElements = this.processDatetimeLocalElements(target);
        if (!datetimeLocalElements) {
            return;
        }

        const openRegistration = this.processOpenRegistrationElement(target);
        if (openRegistration === undefined) {
            return;
        }

        const formData = new FormData(target);
        datetimeLocalElements.forEach(({ name, value }) => {
            if (!value) {
                formData.delete(name);
                return;
            }

            formData.set(name, value);
        });

        const keys = Object.keys(this.event);
        const requestBody = Array.from(formData).reduce(
            (acc: { [key: string]: unknown }, [key, value]) => {
                if (keys.includes(key)) {
                    acc[key] = value;
                }
                return acc;
            },
            {}
        );

        requestBody["target_groups"] = Object.values(target_groups);
        requestBody["open_registration"] = openRegistration;

        const response = await requestHandler.put({
            endpoint: "events",
            path: [this.event.id.toString()],
            requestInit: { body: JSON.stringify(requestBody) },
        });
        if (response.ok) {
            target
                ?.querySelectorAll("input, select, textarea")
                .forEach((input) => {
                    input.setAttribute("disabled", "");
                });
            this.collapseAll();
            this.toggleEdit(
                new CustomEvent("click", {
                    detail: target.querySelector(".btn-edit"),
                })
            );
            this.dispatchEvent(
                new CustomEvent("updated", {
                    detail: this.event.id,
                    bubbles: true,
                    composed: true,
                })
            );
            return;
        }

        if (!response.ok) {
            const error = await response.json();
            this.renderToast(response.statusText, error);
        }
    }

    /**
     * Handles the form submission for deleting the event.
     * @param e - The click event.
     */
    private async handleDelete(e: Event) {
        e.preventDefault();

        if (!this.event?.id) {
            return;
        }

        const response = await requestHandler.delete({
            endpoint: "events",
            path: [this.event.id.toString()],
        });
        if (response.status >= 200 && response.status <= 299) {
            this.dispatchEvent(
                new CustomEvent("deleted", {
                    detail: this.event.id,
                    bubbles: true,
                    composed: true,
                })
            );

            return;
        }

        if (response.status >= 400) {
            const error = await response.json();
            this.renderToast(response.statusText, error);
        }
    }

    /**
     * Collapses all the collapsible sections.
     */
    private collapseAll() {
        this.collapsibles.forEach((collapsible) => {
            collapsible.open = false;
        });
    }

    /**
     * Expands all the collapsible sections.
     */
    private expandAll() {
        this.collapsibles.forEach((collapsible) => {
            collapsible.open = true;
        });
    }

    private handleConfirm(e: Event) {
        this.confirmationModal.header = __("Please confirm");

        if (typeof this.event?.name === "string") {
            this.confirmationModal.message = __(
                "Are you sure you want to delete: "
            );
            this.confirmationModal.obj = this.event.name;
        } else {
            this.confirmationModal.message = __(
                "Are you sure you want to delete this event?"
            );
        }

        this.confirmationModal.ref = e.target;
        this.confirmationModal.showModal();
    }

    private getColumnData(query: LMSEvent, data?: TaggedData[]) {
        const datum: Datum = {};
        for (const [name, value] of Object.entries(query)) {
            datum[name] = this.inputConverter.getInputTemplate({
                name,
                value,
                data,
            });
        }

        return datum;
    }

    protected override updated(
        _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
    ): void {
        if (_changedProperties.has("taggedData")) {
            if (!this.event) {
                return;
            }

            this.datum = this.getColumnData(this.event, this.taggedData);
        }

        const amountSnapshotted = this.snapshot?.getAmountSnapshotted() ?? 0;
        if (this.inputs?.length && amountSnapshotted < this.inputs.length) {
            this.snapshot = new InputsSnapshot(this.inputs);
        }
    }

    /**
     * Renders the element.
     * @returns The rendered template result.
     */
    override render() {
        const { datum } = this;
        return html`
            <form @submit=${this.handleSave}>
                <div
                    class="join mb-3 w-full"
                    aria-label=${attr__("Event controls")}
                >
                    <button
                        @click=${this.toggleEdit}
                        type="button"
                        class="btn-edit btn btn-secondary btn-outline join-item flex-auto"
                    >
                        <span class="start-edit pointer-events-none"
                            >${litFontawesome(faEdit, {
                                className: "w-4 h-4 inline-block sm:hidden",
                            })}&nbsp;<span class="hidden sm:inline"
                                >${__("Edit")}</span
                            ></span
                        >
                        <span class="abort-edit pointer-events-none hidden"
                            >${litFontawesome(faTimes, {
                                className: "w-4 h-4 inline-block sm:hidden",
                            })}&nbsp;<span class="hidden sm:inline"
                                >${__("Abort")}</span
                            ></span
                        >
                    </button>
                    <button
                        type="submit"
                        class="btn btn-secondary btn-outline join-item flex-auto"
                    >
                        ${litFontawesome(faSave, {
                            className: "w-4 h-4 inline-block sm:hidden",
                        })}
                        <span class="hidden sm:inline"
                            >&nbsp;${__("Save")}</span
                        >
                    </button>
                    <button
                        @click=${this.handleConfirm}
                        type="button"
                        class="btn btn-secondary btn-outline join-item flex-auto"
                    >
                        ${litFontawesome(faTrash, {
                            className: "w-4 h-4 inline-block sm:hidden",
                        })}
                        <span class="hidden sm:inline"
                            >&nbsp;${__("Delete")}</span
                        >
                    </button>
                    <button
                        type="button"
                        class="btn btn-secondary btn-outline join-item flex-auto"
                        @click=${this.collapseAll}
                    >
                        ${litFontawesome(faCompressAlt, {
                            className: "w-4 h-4 inline-block sm:hidden",
                        })}
                        <span class="hidden sm:inline"
                            >&nbsp;${__("Collapse All")}</span
                        >
                    </button>
                </div>

                <!-- Group 1: Basic Information -->
                <details
                    tabindex="0"
                    class="collapse collapse-arrow mb-4 border border-base-300 bg-base-200"
                >
                    <summary
                        class="collapse-title w-full text-left text-xl font-medium"
                    >
                        ${__("Basic Information")}
                    </summary>
                    <div class="section collapse-content m-3 p-3">
                        <div class="form-control inline-block w-1/2">
                            <label for="name" class="label">
                                <span class="label-text">${__("Name")}</span>
                            </label>
                            ${datum["name"]}
                        </div>
                        <div class="form-control inline-block w-1/2">
                            <label for="event_type" class="label">
                                <span class="label-text">
                                    ${__("Event Type")}
                                </span>
                            </label>
                            ${datum["event_type"]}
                        </div>

                        <div class="form-control w-full">
                            <label for="target_groups" class="label">
                                <span class="label-text">
                                    ${__("Target Groups")}</span
                                ></label
                            >
                            ${datum["target_groups"]}
                        </div>
                    </div>
                </details>

                <!-- Group 2: Age and Participants -->
                <details
                    tabindex="0"
                    class="collapse collapse-arrow mb-4 border border-base-300 bg-base-200"
                >
                    <summary
                        class="collapse-title w-full text-left text-xl font-medium"
                    >
                        ${__("Age and Participants")}
                    </summary>
                    <div class="section collapse-content m-3 p-3">
                        <div class="form-control inline-block w-1/2">
                            <label for="min_age" class="label">
                                <span class="label-text">${__("Min Age")}</span>
                            </label>
                            ${datum["min_age"]}
                        </div>
                        <div class="form-control inline-block w-1/2">
                            <label for="max_age" class="label">
                                <span class="label-text">${__("Max Age")}</span>
                            </label>
                            ${datum["max_age"]}
                        </div>

                        <div class="form-control inline-block w-1/2">
                            <label for="max_participants" class="label">
                                <span class="label-text"
                                    >${__("Max Participants")}</span
                                >
                            </label>
                            ${datum["max_participants"]}
                        </div>
                    </div>
                </details>

                <!-- Group 3: Event Times -->
                <details
                    tabindex="0"
                    class="collapse collapse-arrow mb-4 border border-base-300 bg-base-200"
                >
                    <summary
                        class="collapse-title w-full text-left text-xl font-medium"
                    >
                        ${__("Event Times")}
                    </summary>
                    <div
                        id="eventTimes"
                        class="section collapse-content m-3 p-3"
                    >
                        <div class="form-control inline-block w-1/2">
                            <label for="start_time" class="label">
                                <span class="label-text"
                                    >${__("Start Time")}</span
                                >
                            </label>
                            ${datum["start_time"]}
                        </div>
                        <div class="form-control inline-block w-1/2">
                            <label for="end_time" class="label">
                                <span class="label-text"
                                    >${__("End Time")}</span
                                >
                            </label>
                            ${datum["end_time"]}
                        </div>

                        <div class="form-control inline-block w-1/2">
                            <label for="registration_start" class="label">
                                <span class="label-text"
                                    >${__("Registration Start")}</span
                                >
                            </label>
                            ${datum["registration_start"]}
                        </div>
                        <div class="form-control inline-block w-1/2">
                            <label for="registration_end" class="label">
                                <span class="label-text"
                                    >${__("Registration End")}</span
                                >
                            </label>
                            ${datum["registration_end"]}
                        </div>
                    </div>
                </details>

                <!-- Group 4: Additional Information -->
                <details
                    tabindex="0"
                    class="collapse collapse-arrow mb-4 border border-base-300 bg-base-200"
                >
                    <summary
                        class="collapse-title w-full text-left text-xl font-medium"
                    >
                        ${__("Additional Information")}
                    </summary>
                    <div
                        id="additionalInfo"
                        class="section collapse-content m-3 p-3"
                    >
                        <div class="form-control inline-block w-full">
                            <label for="location" class="label">
                                <span class="label-text"
                                    >${__("Location")}</span
                                >
                            </label>
                            ${datum["location"]}
                        </div>

                        <div class="form-control inline-block w-full">
                            <label for="image" class="label">
                                <span class="label-text">${__("Image")}</span>
                            </label>
                            ${datum["image"]}
                        </div>

                        <div class="form-control inline-block w-full">
                            <label for="status" class="label">
                                <span class="label-text">${__("Status")}</span>
                            </label>
                            ${datum["status"]}
                        </div>

                        <div class="form-control inline-block w-full">
                            <label for="registration_link" class="label">
                                <span class="label-text"
                                    >${__("Registration Link")}</span
                                >
                            </label>
                            ${datum["registration_link"]}
                        </div>

                        <div class="form-control">
                            <label
                                for="open_registration"
                                class="label cursor-pointer"
                            >
                                ${datum["open_registration"]}
                                <span class="label-text"
                                    >${__("Open Registration")}</span
                                >
                            </label>
                        </div>

                        <div class="form-control inline-block w-full">
                            <label for="description" class="label">
                                <span class="label-text"
                                    >${__("Description")}</span
                                >
                            </label>
                            ${datum["description"]}
                        </div>
                    </div>
                </details>
            </form>
            <lms-confirmation-modal
                @confirm=${this.handleDelete}
            ></lms-confirmation-modal>
        `;
    }
}
