type Endpoint = {
    url?: string;
    cache?: boolean;
    ignoreCache?: boolean;
    requestInfo?: { [key in keyof RequestInit]?: RequestInit[key] };
    queryParams?: Record<string, string>;
};

type Endpoints = Record<string, Endpoint>;

class RequestHandler {
    private endpoints: Record<string, Endpoint> = {};

    constructor(endpoints: Record<string, Endpoint> | Map<string, Endpoint>) {
        if (endpoints instanceof Map) {
            endpoints.forEach((value, key) => {
                this.endpoints[key] = value;
            });
        } else {
            this.endpoints = endpoints;
        }
    }

    public async request(
        endpoint: keyof Endpoints,
        queryParams?: Record<string, string> | string,
        pathParams?: Array<string>
    ): Promise<Response> {
        const endpointData = this.endpoints[endpoint];

        if (!endpointData) {
            throw new Error(`Endpoint not found: ${endpoint}`);
        }

        const requestInfo = endpointData.requestInfo || {};

        let cacheMode: RequestCache;
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes("chrome")) {
            cacheMode = endpointData.ignoreCache ? "no-cache" : "no-store";
        } else if (userAgent.includes("firefox")) {
            cacheMode = endpointData.ignoreCache ? "no-cache" : "default";
        } else {
            // For other browsers, use the default behavior
            cacheMode = endpointData.ignoreCache
                ? "no-cache"
                : endpointData.cache
                ? "default"
                : "force-cache";
        }

        let url =
            endpointData.url + (pathParams ? `/${pathParams.join("/")}` : "");

        if (queryParams) {
            const searchParams = new URLSearchParams(queryParams);
            url += `?${searchParams.toString()}`;
        } else if (endpointData.queryParams) {
            const searchParams = new URLSearchParams(endpointData.queryParams);
            url += `?${searchParams.toString()}`;
        }

        const response = await fetch(url, {
            cache: cacheMode,
            headers: {
                ...requestInfo.headers,
                "Content-Type": "application/json",
            },
            method: requestInfo.method || "GET",
            body: requestInfo.body
                ? JSON.stringify(requestInfo.body)
                : undefined,
        });

        return response;
    }
}

const BASE_URL = "/api/v1/contrib/eventmanagement";
const endpoints: Endpoints = {
    getEventsPublic: {
        url: `${BASE_URL}/public/events`,
        cache: false,
    },
    getEventsCountPublic: {
        url: `${BASE_URL}/public/events_count`,
        cache: false,
    },
    getTargetGroupsPublic: {
        url: `${BASE_URL}/public/target_groups`,
        cache: true,
    },
    getEventTypesPublic: {
        url: `${BASE_URL}/public/event_types`,
        cache: true,
    },
    getLocationsPublic: {
        url: `${BASE_URL}/public/locations`,
        cache: true,
    },
    getSettingsPublic: {
        url: `${BASE_URL}/public/settings`,
        cache: true,
    },
    getSettings: {
        url: `${BASE_URL}/settings`,
        cache: false,
    },
    postSettings: {
        url: `${BASE_URL}/settings`,
        cache: false,
    },
    getSetting: {
        url: `${BASE_URL}/settings`,
        cache: false,
    },
    putSetting: {
        url: `${BASE_URL}/settings`,
        cache: false,
    },
    getEvents: {
        url: `${BASE_URL}/events`,
        cache: false,
    },
    postEvents: {
        url: `${BASE_URL}/events`,
        cache: false,
    },
    getEvent: {
        url: `${BASE_URL}/events`,
        cache: false,
    },
    putEvent: {
        url: `${BASE_URL}/events`,
        cache: false,
    },
    getEventTypes: {
        url: `${BASE_URL}/event_types`,
        cache: true,
    },
    postEventTypes: {
        url: `${BASE_URL}/event_types`,
        cache: false,
    },
    getEventType: {
        url: `${BASE_URL}/event_types`,
        cache: false,
    },
    putEventType: {
        url: `${BASE_URL}/event_types`,
        cache: false,
    },
    getImages: {
        url: `${BASE_URL}/images`,
        cache: true,
    },
    getLocations: {
        url: `${BASE_URL}/locations`,
        cache: true,
    },
    postLocations: {
        url: `${BASE_URL}/locations`,
        cache: false,
    },
    getLocation: {
        url: `${BASE_URL}/locations`,
        cache: false,
    },
    putLocation: {
        url: `${BASE_URL}/locations`,
        cache: false,
    },
    getTargetGroups: {
        url: `${BASE_URL}/target_groups`,
        cache: true,
    },
    postTargetGroups: {
        url: `${BASE_URL}/target_groups`,
        cache: false,
    },
    getTargetGroup: {
        url: `${BASE_URL}/target_groups`,
        cache: false,
    },
    putTargetGroup: {
        url: `${BASE_URL}/target_groups`,
        cache: false,
    },
};

export const requestHandler = new RequestHandler(endpoints);
