type Endpoint = {
  url: string;
  cache?: boolean;
  ignoreCache?: boolean;
  requestInfo?: Record<string, any>;
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
    endpoint: string,
    queryParams?: Record<string, string> | string
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

    let url = endpointData.url;

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
      body: requestInfo.body ? JSON.stringify(requestInfo.body) : undefined,
    });

    return response;
  }
}

const endpoints: Endpoints = {
  getEventsPublic: {
    url: "/api/v1/contrib/eventmanagement/public/events",
    cache: false,
  },
  getTargetGroupsPublic: {
    url: "/api/v1/contrib/eventmanagement/public/target_groups",
    cache: true,
  },
  getEventTypesPublic: {
    url: "/api/v1/contrib/eventmanagement/public/event_types",
    cache: true,
  },
  getLocationsPublic: {
    url: "/api/v1/contrib/eventmanagement/public/locations",
    cache: true,
  },
};

export const requestHandler = new RequestHandler(endpoints);
