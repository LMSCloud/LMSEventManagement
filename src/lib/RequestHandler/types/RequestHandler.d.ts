/**
 * @property {string} url - The URL of the endpoint.
 * @property {boolean} cache - If true, cache the result of requests to this endpoint.
 * @property {boolean} ignoreCache - If true, ignore any cached data and always fetch from this endpoint.
 * @property {Object} requestInfo - Additional request info to send with fetch.
 * @property {Object} queryParams - Default query parameters to append to the URL.
 * @property {Array<string>} pathParams - Default path parameters to append to the URL.
 */
type Endpoint = {
    url?: string;
    cache?: boolean;
    ignoreCache?: boolean;
    requestInit?: { [key in keyof RequestInit]?: RequestInit[key] };
    path?: Array<string>;
    query?: Record<string, string>;
};

/**
 * @property {Record<string, Endpoint>} endpoints - Group of API endpoints
 */
export type ApiGroup = Record<string, Endpoint>;

/**
 * @property {ApiGroup} get - Endpoints for GET requests
 * @property {ApiGroup} post - Endpoints for POST requests
 * @property {ApiGroup} put - Endpoints for PUT requests
 * @property {ApiGroup} delete - Endpoints for DELETE requests
 */
export type ApiEndpoints = {
    get: ApiGroup;
    post: ApiGroup;
    put: ApiGroup;
    delete: ApiGroup;
};
