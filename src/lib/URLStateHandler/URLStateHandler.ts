/**
 * Parameters for merging parts of a URL.
 * @interface MergeURLParams
 */
interface MergeURLParams {
    /**
     * The original URL to be modified.
     */
    href: string;

    /**
     * Optional: The protocol part of the URL (e.g., 'http:', 'https:').
     */
    protocol?: string;

    /**
     * Optional: The hostname part of the URL (e.g., 'example.com').
     */
    hostname?: string;

    /**
     * Optional: The port part of the URL (e.g., '8080').
     */
    port?: string;

    /**
     * Optional: The pathname part of the URL (e.g., '/path/to/resource').
     */
    pathname?: string;

    /**
     * Optional: The search parameters of the URL, which can be provided as either a string or URLSearchParams object.
     */
    searchParams?: URLSearchParams | string;

    /**
     * Optional: The hash part of the URL (e.g., '#section1').
     */
    hash?: string;
}

/**
 * Merge parts of a URL to create a new URL string.
 * @param {MergeURLParams} params - The parameters for merging the URL parts.
 * @returns {string} The merged URL as a string.
 */
export function merge({
    href,
    protocol,
    hostname,
    port,
    pathname,
    searchParams,
    hash,
}: MergeURLParams): string {
    const parsedURL = new URL(href);

    if (protocol) {
        parsedURL.protocol = protocol;
    }
    if (hostname) {
        parsedURL.hostname = hostname;
    }
    if (port) {
        parsedURL.port = port;
    }
    if (pathname) {
        parsedURL.pathname = pathname;
    }
    if (searchParams !== undefined) {
        if (typeof searchParams === "string") {
            parsedURL.search = searchParams;
        } else if (searchParams instanceof URLSearchParams) {
            parsedURL.search = searchParams.toString();
        }
    }
    if (hash) {
        parsedURL.hash = hash;
    }

    return parsedURL.toString();
}
