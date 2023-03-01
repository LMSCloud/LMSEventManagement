import { TemplateResult } from "lit";

export default class TemplateResultConverter {
  private _templateResult: unknown;

  constructor(templateResult: unknown) {
    this._templateResult = templateResult;
  }

  set templateResult(templateResult: unknown) {
    this._templateResult = templateResult;
  }

  getRenderString(data = this._templateResult): string {
    const { strings, values } = data as TemplateResult;
    const v = [...values, ""].map((e) =>
      typeof e === "object" ? this.getRenderString(e) : e
    );
    return strings.reduce((acc, s, i) => acc + s + v[i], "");
  }

  getRenderValues(data = this._templateResult): unknown[] {
    const { values } = data as TemplateResult;
    return [...values, ""].map((e) =>
      typeof e === "object" ? this.getRenderValues(e) : e
    );
  }
}
