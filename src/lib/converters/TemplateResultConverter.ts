import { TemplateResult } from "lit";

/**
 * Represents a TemplateResultConverter that can extract values and render strings from a TemplateResult.
 */
export class TemplateResultConverter {
    private _templateResult: unknown;

    /**
     * Creates a new instance of TemplateResultConverter.
     * @param templateResult - The TemplateResult to be converted.
     */
    constructor(templateResult: unknown) {
        this._templateResult = templateResult;
    }

    /**
     * Sets the TemplateResult to be converted.
     * @param templateResult - The TemplateResult to be set.
     */
    set templateResult(templateResult: unknown) {
        this._templateResult = templateResult;
    }

    /**
     * Retrieves the value at the specified index from the TemplateResult.
     * @param templateResult - The TemplateResult to extract the value from.
     * @param index - The index of the value to retrieve.
     * @returns The extracted value as a string.
     */
    public getValueByIndex(
        templateResult: TemplateResult,
        index: number
    ): unknown {
        this.templateResult = templateResult;
        const renderValue = this.getRenderValues()[index];
        return typeof renderValue === "string"
            ? renderValue
            : (renderValue as string | number | boolean).toString();
    }

    /**
     * Generates the rendered string from the TemplateResult.
     * @param data - The data object to render. Defaults to the stored TemplateResult.
     * @returns The rendered string.
     */
    public getRenderString(data = this._templateResult): string {
        const { strings, values } = data as TemplateResult;
        const v = [...values, ""].map((e) =>
            typeof e === "object" ? this.getRenderString(e) : e
        );
        return strings.reduce((acc, s, i) => acc + s + v[i], "");
    }

    /**
     * Checks if the provided value is a TemplateResult.
     * @param value
     * @returns
     */
    private isTemplateResult(value: unknown): boolean {
        return (
            typeof value === "object" &&
            {}.hasOwnProperty.call(value, "_$litType$")
        );
    }

    /**
     * Retrieves all the rendered values from the TemplateResult.
     * @param data - The data object to extract values from. Defaults to the stored TemplateResult.
     * @returns An array of the extracted values.
     */
    public getRenderValues(data: unknown = this._templateResult): unknown[] {
        // Using optional chaining (?.) to check if data is null or undefined and
        // if values exist in data; if not, default to an empty array (?? [])
        const values = (data as TemplateResult)?.values ?? [];

        // Now, we can map through the values array directly
        return [...values].flatMap((e) => {
            if (this.isTemplateResult(e)) {
                return this.getRenderValues(e);
            }

            if (
                Array.isArray(e) &&
                e.some((item) => this.isTemplateResult(item))
            ) {
                const indices: number[] = [];
                let index;
                for (index = 0; index < e.length; index += 1) {
                    if ({}.hasOwnProperty.call(e[index], "_$litType$")) {
                        indices.push(index);
                    }
                }
                return e.map((item, index) => {
                    if (indices.includes(index)) {
                        return this.getRenderValues(item);
                    }

                    return item;
                });
            }

            return e;
        });
    }
}
