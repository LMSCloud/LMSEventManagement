import { TemplateResult } from "lit";

export class TemplateResultConverter {
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

export function convertToFormat(
  string: string,
  format: string,
  locale: string
): string {
  if (format === "datetime") {
    const date = new Date(string);
    return date.toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return string;
}
