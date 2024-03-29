import { customElement, property } from "lit/decorators.js";
import LMSAnchor from "../components/LMSAnchor";
import LMSTable from "../components/LMSTable";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import {
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    UploadedImage,
} from "../types/common";

declare global {
    interface HTMLElementTagNameMap {
        "lms-anchor": LMSAnchor;
    }
}

@customElement("lms-event-types-table")
export default class LMSEventTypesTable extends LMSTable {
    @property({ type: Array }) target_groups: LMSTargetGroup[] = [];

    @property({ type: Array }) locations: LMSLocation[] = [];

    @property({ type: Array }) event_types: LMSEventType[] = [];

    @property({ type: Array }) images: UploadedImage[] = [];

    private handleInput(
        input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
        value: unknown
    ) {
        if (input instanceof HTMLInputElement && input.type === "checkbox") {
            return Boolean(input.checked);
        }

        return value;
    }

    override async handleSave(e: Event) {
        const target = e.target as HTMLElement;

        let parent = target.parentElement;
        while (parent && parent.tagName !== "TR") {
            parent = parent.parentElement;
        }

        let id,
            inputs = undefined;
        if (parent) {
            id = parent.firstElementChild?.textContent?.trim();
            inputs = parent.querySelectorAll(
                "input, select, textarea"
            ) as NodeListOf<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >;
        }

        if (!id || !inputs) {
            return;
        }

        const response = await requestHandler.put({
            endpoint: "eventTypes",
            path: [id.toString()],
            requestInit: {
                body: JSON.stringify({
                    ...Array.from(inputs).reduce((acc, input) => {
                        if (
                            input.dataset["group"] &&
                            input instanceof HTMLInputElement
                        ) {
                            const group = input.dataset["group"];
                            if (!(group in acc)) {
                                acc[group] = [];
                            }

                            const { id, name, value } = input;

                            const groupArray = acc[group] as Array<
                                Record<string, unknown>
                            >;
                            const groupIndex = groupArray.findIndex(
                                (item) => item["id"] === id
                            );

                            if (groupIndex === -1) {
                                groupArray.push({
                                    id,
                                    [name]: this.handleInput(input, value),
                                });
                                return acc;
                            }

                            const groupItem = groupArray[groupIndex];
                            if (groupItem) {
                                groupItem[name] = this.handleInput(
                                    input,
                                    value
                                );
                            }

                            return acc;
                        }

                        acc[input.name] = this.handleInput(input, input.value);
                        return acc;
                    }, {} as Record<string, unknown>),
                }),
            },
        });

        if (response.status >= 200 && response.status <= 299) {
            inputs.forEach((input) => {
                input.disabled = true;
            });
            this.toggleEdit(
                new CustomEvent("click", {
                    detail: target.closest("td")?.querySelector(".btn-edit"),
                })
            );
            this.dispatchEvent(new CustomEvent("updated", { detail: id }));
            return;
        }

        if (response.status >= 400) {
            const error = await response.json();
            this.renderToast(response.statusText, error);
        }
    }

    override async handleDelete(
        e: Event,
        target = this.confirmationModal.ref as HTMLElement
    ) {
        if (!target) {
            target = e.target as HTMLElement;
        }

        let parent = target.parentElement;
        while (parent && parent.tagName !== "TR") {
            parent = parent.parentElement;
        }

        let id = undefined;
        if (parent) {
            id = parent.firstElementChild?.textContent?.trim();
        }

        if (!id) {
            return;
        }

        const response = await requestHandler.delete({
            endpoint: "eventTypes",
            path: [id.toString()],
        });
        if (response.status >= 200 && response.status <= 299) {
            this.dispatchEvent(new CustomEvent("deleted", { detail: id }));
            return;
        }

        if (response.status >= 400) {
            const error = await response.json();
            this.renderToast(response.statusText, error);
        }
    }

    constructor() {
        super();
        this.order = [
            "id",
            "name",
            "target_groups",
            "min_age",
            "max_age",
            "max_participants",
            "location",
            "image",
            "description",
            "open_registration",
        ];
        this.unsortableColumns = ["target_groups"];
        this.isEditable = true;
        this.isDeletable = true;
    }

    override connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    private hydrate() {
        this.data = this.event_types.map(
            (event_type: { [key in keyof LMSEventType]: LMSEventType[key] }) =>
                Object.fromEntries(
                    this.getColumnData(event_type, [
                        ["target_groups", this.target_groups],
                        ["location", this.locations],
                        ["image", this.images],
                    ])
                )
        );

        // this.confirmationModal.message = __(
        //     "Are you sure you want to delete (This will delete all events with this event type): "
        // );
    }

    override updated(changedProperties: Map<string, never>) {
        super.updated(changedProperties);
        if (changedProperties.has("event_types")) {
            this.hydrate();
        }
    }
}
