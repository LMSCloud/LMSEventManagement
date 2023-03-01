import { TemplateResult } from "lit";

export default class TemplateResultConverter {
  templateResult: unknown | undefined;

  constructor(templateResult: unknown) {
    this.templateResult = templateResult;
  }

  getRenderString(data = this.templateResult): string {
    const { strings, values } = data as TemplateResult;
    const v = [...values, ""].map((e) =>
      typeof e === "object" ? this.getRenderString(e) : e
    );
    return strings.reduce((acc, s, i) => acc + s + v[i], "");
  }

  getRenderValues(data = this.templateResult): unknown[] {
    const { values } = data as TemplateResult;
    return [...values, ""].map((e) =>
      typeof e === "object" ? this.getRenderValues(e) : e
    );
  }
}
