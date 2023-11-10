import { customElement, property } from "lit/decorators.js";
import LMSTable from "../components/LMSTable";
import { requestHandler } from "../lib/RequestHandler/RequestHandler";
import { Input, LMSLocation } from "../types/common";

@customElement("lms-locations-table")
export default class LMSLocationsTable extends LMSTable {
    @property({ type: Array }) locations: LMSLocation[] = [];

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
            inputs = parent.querySelectorAll("input");
        }

        if (!id || !inputs) {
            return;
        }

        const response = await requestHandler.put({
            endpoint: "locations",
            path: [id.toString()],
            requestInit: {
                body: JSON.stringify({
                    ...Array.from(inputs).reduce(
                        (
                            acc: { [key: string]: number | string },
                            input: Input
                        ) => {
                            acc[input.name] = input.value;
                            return acc;
                        },
                        {}
                    ),
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
            endpoint: "locations",
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
            "street",
            "number",
            "city",
            "zip",
            "country",
            "link",
        ];
        this.isEditable = true;
        this.isDeletable = true;
    }

    override connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    private hydrate() {
        this.data = this.locations.map(
            (location: { [key in keyof LMSLocation]: LMSLocation[key] }) => {
                return Object.fromEntries(this.getColumnData(location));
            }
        );
    }

    override updated(changedProperties: Map<string, never>) {
        super.updated(changedProperties);
        if (changedProperties.has("locations")) {
            this.hydrate();
        }
    }
}
