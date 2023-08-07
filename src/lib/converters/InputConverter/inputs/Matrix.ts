import { html, TemplateResult } from "lit";
import {
    InputTypeValue,
    LMSEventTargetGroupFee,
    LMSTargetGroup,
} from "../../../../types/common";
import { __ } from "../../../translate";

export default class Matrix {
    private name: string;

    private value: InputTypeValue;

    private data: any[];

    private disabled: boolean;

    constructor(name: string, value: InputTypeValue, data: any[]) {
        this.name = name;
        this.value = value;
        this.data = data;
        this.disabled = true;
    }

    public render() {
        if (this.name !== "target_groups") {
            return this.renderError();
        }

        return html`<details
            class="collapse bg-base-200"
            @click=${this.togglePip}
        >
            <summary
                class="collapse-title min-h-12 !flex items-center justify-center p-0 "
            >
                ${__("Target Groups")}
            </summary>
            <div class="collapse-content">
                <table class="table-xs table">
                    <thead>
                        <tr>
                            <th>${__("target_group")}</th>
                            <th>${__("selected")}</th>
                            <th>${__("fee")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(this.data as LMSTargetGroup[]).map(
                            ({ id, name }: LMSTargetGroup) => {
                                const targetGroupFee = (
                                    this.value as LMSEventTargetGroupFee[]
                                ).find(
                                    (targetGroupFee: LMSEventTargetGroupFee) =>
                                        targetGroupFee.target_group_id === id
                                );
                                const selected =
                                    targetGroupFee?.selected ?? false;
                                const fee = targetGroupFee?.fee ?? 0;
                                return html`
                                    <tr>
                                        <td id=${id} class="align-middle">
                                            ${name}
                                        </td>
                                        <td class="align-middle">
                                            <input
                                                type="checkbox"
                                                data-group="target_groups"
                                                name="selected"
                                                id=${id}
                                                class="checkbox"
                                                ?checked=${selected}
                                                ?disabled=${this.disabled}
                                            />
                                        </td>
                                        <td class="align-middle">
                                            <input
                                                type="number"
                                                data-group="target_groups"
                                                name="fee"
                                                id=${id}
                                                step="0.01"
                                                class="input-bordered input w-full"
                                                value=${fee}
                                                ?disabled=${this.disabled}
                                            />
                                        </td>
                                    </tr>
                                `;
                            }
                        )}
                    </tbody>
                </table>
            </div>
        </details>`;
    }

    private togglePip(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const details = target.closest("details");
        if (!details || target.tagName !== "SUMMARY") {
            return;
        }

        const parent = details.parentElement;
        if (parent?.classList.contains("pip")) {
            parent?.classList.remove("pip");
        } else {
            parent?.classList.add("pip");
        }
    }

    private renderError(): TemplateResult {
        return html`<strong>${__("Error")}!</strong>`;
    }
}
