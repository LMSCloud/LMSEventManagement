export class QueryBuilder {
  private _query: URLSearchParams;
  private _reservedParams: string[];
  private _disallowedParams: string[];
  private _areRepeatable: string[];

  constructor() {
    this._query = new URLSearchParams();
    this._reservedParams = [];
    this._disallowedParams = [];
    this._areRepeatable = [];
  }

  set reservedParams(reservedParams: string[]) {
    this._reservedParams = reservedParams;
  }

  set disallowedParams(disallowedParams: string[]) {
    this._disallowedParams = disallowedParams;
  }

  set areRepeatable(areRepeatable: string[]) {
    this._areRepeatable = areRepeatable;
  }

  set query(query: URLSearchParams | string) {
    if (typeof query === "string") {
      this._query = new URLSearchParams(query);
    } else {
      this._query = query;
    }
  }

  get query() {
    return this._query;
  }

  getParamValue(key: string) {
    return this._query.get(key);
  }

  public updateQuery(query: URLSearchParams | string) {
    const newQueryParams = new URLSearchParams(query);

    // Remove keys that are not in the new query if they are not reserved
    this._query.forEach((_, key) => {
      if (this._reservedParams.includes(key)) {
        return;
      }
      if (!newQueryParams.has(key)) {
        this._query.delete(key);
      }
    });

    newQueryParams.forEach((value, key) => {
      // If key is disallowed, do nothing
      if (this._disallowedParams.includes(key)) {
        return;
      }

      // Handle different cases based on key
      switch (true) {
        // If key is reserved, update its value
        case this._reservedParams.includes(key):
          this._query.set(key, value);
          break;
        // If key is repeatable, update its values
        case this._areRepeatable.includes(key): {
          const existingValues = this._query.getAll(key);
          const newValues = newQueryParams.getAll(key);
          const valuesToRemove = existingValues.filter(
            (v) => !newValues.includes(v)
          );
          valuesToRemove.forEach(() => this._query.delete(key));
          newValues.forEach((v) => this._query.append(key, v));
          break;
        }
        // If key is not reserved and not repeatable, set its value
        default:
          this._query.set(key, value);
          break;
      }
    });
  }

  public updateUrl() {
    const url = new URL(window.location.href);
    url.search = this._query.toString();
    window.history.pushState({}, "", url.toString());
  }
}
