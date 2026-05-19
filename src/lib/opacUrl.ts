/**
 * Build a URL relative to the current OPAC page that overrides our routing
 * params (action / event_id / token) while preserving every other query param
 * already on window.location. Koha 22.11 mounts the plugin's events.html under
 * opac-page.pl?code=lmscloud-eventmanagement, so a naive `?action=book` would
 * drop the `code` param and 404. Newer Koha versions that don't need `code`
 * are unaffected since the helper only carries forward what's already there.
 */
export function buildOpacUrl(
    params: Record<string, string | null>,
    search: string = typeof window !== "undefined"
        ? window.location.search
        : "",
    pathname: string = typeof window !== "undefined"
        ? window.location.pathname
        : "",
): string {
    const next = new URLSearchParams(search);

    // Strip every routing param the plugin owns so callers don't have to.
    next.delete("action");
    next.delete("event_id");
    next.delete("token");

    for (const [key, value] of Object.entries(params)) {
        if (value === null) {
            next.delete(key);
        } else {
            next.set(key, value);
        }
    }

    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
}
