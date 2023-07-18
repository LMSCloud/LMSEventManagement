import { customElement, property } from "lit/decorators.js";
import LMSTable from "../components/LMSTable";
import { requestHandler } from "../lib/RequestHandler";
import { Input, LMSTargetGroup } from "../types/common";

@customElement("lms-target-groups-table")
export default class LMSEventTypesTable extends LMSTable {
    @property({ type: Array }) target_groups: LMSTargetGroup[] = [];

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

        const response = await requestHandler.put(
            "targetGroups",
            {
                ...Array.from(inputs).reduce(
                    (acc: { [key: string]: number | string }, input: Input) => {
                        acc[input.name] = input.value;
                        return acc;
                    },
                    {}
                ),
            },
            undefined,
            [id.toString()]
        );
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

        const response = await requestHandler.delete(
            "targetGroups",
            undefined,
            [id.toString()]
        );
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
        this.order = ["id", "name", "min_age", "max_age"];
        this.isEditable = true;
        this.isDeletable = true;
    }

    override connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    private hydrate() {
        this.data = this.target_groups.map(
            (target_group: {
                [key in keyof LMSTargetGroup]: LMSTargetGroup[key];
            }) => {
                return Object.fromEntries(this.getColumnData(target_group));
            }
        );
    }

    override updated(changedProperties: Map<string, never>) {
        super.updated(changedProperties);
        if (changedProperties.has("target_groups")) {
            this.hydrate();
        }
    }
}
