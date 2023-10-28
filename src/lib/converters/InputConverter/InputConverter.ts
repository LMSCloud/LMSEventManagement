import { html, TemplateResult } from "lit";
import LMSPellEditor from "../../../components/custom/LMSPellEditor";
import {
    InputType,
    InputTypeValue,
    LMSEventType,
    LMSLocation,
    LMSTargetGroup,
    ModalField,
    SelectOption,
    TaggedData,
    UploadedImage,
} from "../../../types/common";
import { __ } from "../../translate";
import Checkbox from "./inputs/Checkbox";
import Input from "./inputs/Input";
import Matrix from "./inputs/Matrix";
import ModalCheckboxInput from "./inputs/modal/ModalCheckboxInput";
import ModalDatetimeLocalInput from "./inputs/modal/ModalDatetimeLocalInputs";
import ModalMatrix from "./inputs/modal/ModalMatrix";
import ModalNumberInput from "./inputs/modal/ModalNumberInputs";
import ModalSelect from "./inputs/modal/ModalSelect";
import ModalTextInput from "./inputs/modal/ModalTextInput";
import Select from "./inputs/Select";

type TemplateQuery = {
    name: string;
    value: InputType | InputTypeValue | ModalField;
    data?: TaggedData[];
};

type TemplateFunction = (
    value: InputTypeValue | ModalField,
    data?: LMSEventType[] | LMSLocation[] | LMSTargetGroup[] | UploadedImage[]
) => TemplateResult;

declare global {
    interface HTMLElementTagNameMap {
        "lms-image-picker": LMSPellEditor;
    }
}

/**
 * Represents an InputConverter that handles conversion of input fields based on their name.
 */
export class InputConverter {
    private conversionMap: Record<string, TemplateFunction> = {};

    private static readonly DATA_REQUIRING_TEMPLATES = [
        "target_groups",
        "event_type",
        "location",
        "image",
        "status",
    ];

    constructor() {
        this.conversionMap = {
            name: (value) => new Input("name", value).render(),
            event_type: (value, data) =>
                new Select(
                    "event_type",
                    value,
                    (data as LMSEventType[]).map(
                        ({ id, name }) => ({ id, name } as SelectOption)
                    )
                ).render(),
            target_groups: (value, data) =>
                new Matrix("target_groups", value, data as any[]).render(),
            min_age: (value) => new Input("min_age", value).render(),
            max_age: (value) => new Input("max_age", value).render(),
            max_participants: (value) =>
                new Input("max_participants", value).render(),
            location: (value, data) =>
                new Select(
                    "location",
                    value,
                    (data as LMSLocation[]).map(
                        ({ id, name }) => ({ id, name } as SelectOption)
                    )
                ).render(),
            link: (value) => new Input("link", value).render(),
            image: (value, data) =>
                html` <lms-image-picker
                    .images=${data as UploadedImage[]}
                    .selected=${value as string}
                    .disabled=${true}
                    class="lit-element"
                >
                    <input
                        slot="input"
                        class="input input-bordered w-full"
                        name="image"
                        value=${value}
                        disabled
                    />
                </lms-image-picker>`,
            description: (value) => {
                return html` <lms-pell-editor .value=${value} class="text-left">
                    <textarea
                        class="input input-bordered block w-full"
                        name="description"
                        disabled
                    >
${value}</textarea
                    >
                </lms-pell-editor>`;
            },
            open_registration: (value) =>
                new Checkbox("open_registration", value).render(),
            street: (value) => new Input("street", value).render(),
            number: (value) => new Input("number", value).render(),
            city: (value) => new Input("city", value).render(),
            zip: (value) => new Input("zip", value).render(),
            country: (value) => new Input("country", value).render(),
            start_time: (value) => new Input("start_time", value).render(),
            end_time: (value) => new Input("end_time", value).render(),
            registration_start: (value) =>
                new Input("registration_start", value).render(),
            registration_end: (value) =>
                new Input("registration_end", value).render(),
            status: (value) =>
                new Select("status", value, [
                    { id: 1, name: __("Pending") },
                    { id: 2, name: __("Confirmed") },
                    { id: 3, name: __("Canceled") },
                    { id: 3, name: __("Sold Out") },
                ] as SelectOption[]).render(),
            registration_link: (value) =>
                new Input("registration_link", value).render(),
            value: (value) => new Input("value", value).render(),
            modal_text: (value) =>
                new ModalTextInput(value as ModalField).render(),
            modal_number: (value) =>
                new ModalNumberInput(value as ModalField).render(),
            modal_matrix: (value, data) =>
                new ModalMatrix(value as ModalField, data as any[]).render(),
            modal_select: (value, data) =>
                new ModalSelect(
                    value as ModalField,
                    (data as any[]).map(
                        ({ id, name }) => ({ id, name } as SelectOption)
                    )
                ).render(),
            modal_checkbox: (value) =>
                new ModalCheckboxInput(value as ModalField).render(),
            "modal_datetime-local": (value) =>
                new ModalDatetimeLocalInput(value as ModalField).render(),
        };
    }

    private needsData(templateName: string): boolean {
        return InputConverter.DATA_REQUIRING_TEMPLATES.includes(templateName);
    }

    public getInputTemplate({
        name,
        value,
        data,
    }: TemplateQuery): TemplateResult {
        const template = this.conversionMap[name];
        if (!template) return this.renderValue(value);

        const targetName = this.getTargetName(name, value);
        if (!targetName) return this.renderError();

        if (this.needsData(targetName)) {
            const requiredData = this.findDataByName(targetName, data);
            if (!requiredData) return this.renderError();

            return template(value, requiredData);
        }

        return template(value);
    }

    private getTargetName(name: string, value: unknown): string | undefined {
        if (name.startsWith("modal_")) {
            return (value as ModalField)?.name;
        }

        return name;
    }

    private findDataByName(name: string, data?: TaggedData[]): any {
        return data?.find(([tag]) => tag === name)?.[1];
    }

    /**
     * Renders the value as a TemplateResult.
     * @param value - The value to be rendered.
     * @returns The rendered value as a TemplateResult.
     */
    private renderValue(value: InputTypeValue): TemplateResult {
        return html`${value}`;
    }

    /**
     * Renders an error message as a TemplateResult.
     * @returns The rendered error message as a TemplateResult.
     */
    private renderError(): TemplateResult {
        return html`<strong>${__("Error")}!</strong>`;
    }
}
