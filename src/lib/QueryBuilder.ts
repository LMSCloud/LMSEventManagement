/**
 * QueryBuilder class that manages URL query parameters.
 */
export class QueryBuilder {
    private _query: URLSearchParams;

    private _reservedParams: string[];

    private _disallowedParams: string[];

    private _areRepeatable: string[];

    private _staticParams: URLSearchParams;

    /**
     * Initialize the QueryBuilder with empty parameters.
     */
    constructor() {
        this._query = new URLSearchParams();
        this._reservedParams = [];
        this._disallowedParams = [];
        this._areRepeatable = [];
        this._staticParams = new URLSearchParams();
    }

    /**
     * Set the reserved parameters.
     * @param {string[]} reservedParams - The reserved parameters.
     */
    set reservedParams(reservedParams: string[]) {
        this._reservedParams = reservedParams;
    }

    /**
     * Set the disallowed parameters.
     * @param {string[]} disallowedParams - The disallowed parameters.
     */
    set disallowedParams(disallowedParams: string[]) {
        this._disallowedParams = disallowedParams;
    }

    /**
     * Set the repeatable parameters.
     * @param {string[]} areRepeatable - The repeatable parameters.
     */
    set areRepeatable(areRepeatable: string[]) {
        this._areRepeatable = areRepeatable;
    }

    /**
     * Set the static parameters.
     * @param {string[]} staticParams - The static parameters.
     */
    set staticParams(staticParams: string[]) {
        if (!this._query) {
            throw new Error("Cannot set static params before query");
        }
        staticParams.forEach((key) => {
            const value = this._query.get(key);
            if (value) {
                this._staticParams.set(key, value);
            }
        });
    }

    /**
     * Set the query parameters.
     * @param {URLSearchParams | string} query - The query parameters.
     */
    set query(query: URLSearchParams | string) {
        if (typeof query === "string") {
            this._query = new URLSearchParams(query);
        } else {
            this._query = query;
        }
    }

    /**
     * Get the query parameters.
     * @return {URLSearchParams} The query parameters.
     */
    get query() {
        return this._query;
    }

    /**
     * Get the value of a query parameter.
     * @param {string} key - The key of the query parameter.
     * @return {string | null} The value of the query parameter.
     */
    getParamValue(key: string) {
        return this._query.get(key);
    }

    /**
     * Updates the query parameters.
     * @param {URLSearchParams | string} query - The new query parameters.
     */
    public updateQuery(query: URLSearchParams | string) {
        const newQueryParams = new URLSearchParams(query);

        /** Remove keys that are not in the new query if they are not reserved.
         *  WARNING! Always use Array.from() when iterating over URLSearchParams
         *  because it is a live collection and will be modified during iteration
         *  otherwise. */
        Array.from(this._query).forEach(([key]) => {
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
                    const newValues = new Set(newQueryParams.getAll(key));

                    // Create a new URLSearchParams instance to hold the updated parameters
                    const updatedQuery = new URLSearchParams();

                    // Add the values that are present in both existing and new values
                    for (const [k, v] of this._query.entries()) {
                        if (k !== key || (k === key && newValues.has(v))) {
                            updatedQuery.append(k, v);
                        }
                    }

                    // Add new values that are not in the existing values
                    for (const v of newValues) {
                        if (!existingValues.includes(v)) {
                            updatedQuery.append(key, v);
                        }
                    }

                    // Replace the old query parameters with the updated parameters
                    this._query = updatedQuery;
                    break;
                }

                // If key is not reserved and not repeatable, set its value
                default:
                    this._query.set(key, value);
                    break;
            }
        });
    }

    /**
     * Updates the current URL with the current query parameters.
     */
    public updateUrl() {
        const url = new URL(window.location.href);
        const updatedUrl = new URLSearchParams(
            this._query.toString() + "&" + this._staticParams.toString()
        );
        url.search = updatedUrl.toString();
        window.history.pushState({}, "", url.toString());
    }
}
