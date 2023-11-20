import { P, match } from "ts-pattern";
import { BASE_PATH, ENDPOINTS } from "./Config";
import { ApiEndpoints, ApiGroup } from "./types/RequestHandler";

export type SupportedMethod = "get" | "post" | "put" | "delete";

export interface RequestParams {
    endpoint: keyof ApiGroup;
    path?: Array<string>;
    query?: string | Record<string, string>;
    requestInit?: RequestInit;
}

export class RequestHandler {
    private endpoints: ApiEndpoints;

    constructor(endpoints: ApiEndpoints) {
        this.endpoints = endpoints;
    }

    private _fetch(url: string, requestInit?: RequestInit) {
        return fetch(url, requestInit);
    }

    private _stringifyQuery(query?: string | Record<string, string>) {
        return match(query)
            .with(P.nullish, () => "")
            .with(P.string, (q) => {
                if (q.startsWith("?")) {
                    return q.slice(1);
                }

                return q;
            })
            .with(P._, (q) => {
                return new URLSearchParams(q).toString();
            })
            .exhaustive();
    }

    private _toRelativeUrl(
        basePath: string,
        path?: Array<string>,
        query?: string | Record<string, string>
    ) {
        if (!basePath) {
            throw new Error(`Argument basePath is ${basePath}.`);
        }

        return `${basePath}/${path?.join("/")}?${this._stringifyQuery(query)}`;
    }

    private _request({
        endpoint,
        path,
        query,
        requestInit,
    }: RequestParams): Promise<Response> {
        /* Check first whether we got a method passed that conforms to the
         * SupportedMethod type. */
        let method = requestInit?.method;
        if (!["get", "post", "put", "delete"].includes(method ?? "")) {
            method = undefined;
        }

        /* Load the endpoint configuration from the configured ENDPOINTS if
         * applicable. Otherwise just fetch. */
        const endpointConfiguration =
            this.endpoints[(method as SupportedMethod) ?? "get"][endpoint];
        if (!endpointConfiguration) {
            return this._fetch(this._toRelativeUrl(BASE_PATH), requestInit);
        }

        /* Check whether a url is configured for the endpoint. */
        let { url } = endpointConfiguration;
        if (!url) {
            throw new Error(`No Url configured for: ${endpoint}`);
        }

        /* Add the passed pathParams to the url. */
        if (path) {
            url += `/${path.join("/")}`;
        }

        let _requestInit: RequestInit = {
            ...endpointConfiguration.requestInit,
            ...requestInit,
        };

        /* Check which headers to append. */
        _requestInit = match(requestInit?.body)
            .with(P.nullish, () => _requestInit)
            .with(P.instanceOf(FormData), (body) => ({
                ..._requestInit,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
            }))
            .with(P._, (body) => ({
                ..._requestInit,
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            }))
            .exhaustive();

        /* Check which cacheMode to apply based on the userAgent. */
        const userAgent = navigator.userAgent.toLowerCase();
        _requestInit.cache = match(userAgent)
            .when(
                (ua) => ua.includes("chrome"),
                () =>
                    endpointConfiguration.ignoreCache ? "no-cache" : "no-store"
            )
            .when(
                (ua) => ua.includes("firefox"),
                () =>
                    endpointConfiguration.ignoreCache ? "no-cache" : "default"
            )
            .otherwise(() => {
                if (endpointConfiguration.ignoreCache) {
                    return "no-cache";
                }

                return endpointConfiguration.cache ? "default" : "force-cache";
            });

        let _query: URLSearchParams = new URLSearchParams();
        if (endpointConfiguration.query) {
            _query = new URLSearchParams(endpointConfiguration.query);
        }

        if (query) {
            const __query = new URLSearchParams(_query);
            const search = new URLSearchParams(query);
            search.forEach((value, key) => {
                __query.append(key, value);
            });

            _query = __query;
        }

        /* Append the searchParams to the url if there are any. */
        if (_query.size) {
            url += `?${_query.toString()}`;
        }

        return fetch(url, requestInit);
    }

    public get({
        endpoint,
        path,
        query,
        requestInit = { method: "get" },
    }: RequestParams): Promise<Response> {
        return this._request({
            endpoint,
            path,
            query,
            requestInit: { ...requestInit, method: "get" },
        });
    }

    public post({
        endpoint,
        path,
        query,
        requestInit = { method: "post" },
    }: RequestParams): Promise<Response> {
        return this._request({
            endpoint,
            path,
            query,
            requestInit: { ...requestInit, method: "post" },
        });
    }

    public put({
        endpoint,
        path,
        query,
        requestInit = { method: "put" },
    }: RequestParams): Promise<Response> {
        return this._request({
            endpoint,
            path,
            query,
            requestInit: { ...requestInit, method: "put" },
        });
    }

    public delete({
        endpoint,
        path,
        query,
        requestInit = { method: "delete" },
    }: RequestParams): Promise<Response> {
        return this._request({
            endpoint,
            path,
            query,
            requestInit: { ...requestInit, method: "delete" },
        });
    }
}

export const requestHandler = new RequestHandler(ENDPOINTS);
