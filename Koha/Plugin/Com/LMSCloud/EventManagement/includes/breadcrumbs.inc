[% USE gtx = Gettext('com.lmscloud.eventmanagement', LANG, 'utf-8', LOCALES) %]

<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/cgi-bin/koha/mainpage.pl">[% "Home" | gettext %]</a></li>
        <li class="breadcrumb-item"><a href="/cgi-bin/koha/plugins/plugins-home.pl">Plugins</a></li>
        <li class="breadcrumb-item"><a id="contextual-base" href="#">LMSEventManagement</a></li>
        <li class="breadcrumb-item active" aria-current="page"><a id="contextual-page" href="#"></a></li>
    </ol>
</nav>

<script async="false">
    {
        const contextualBaseAnchor = document.getElementById("contextual-base");
        const contextualPageAnchor = document.getElementById("contextual-page");

        const searchParams = new URLSearchParams(window.location.search);
        const pluginClass = searchParams.get("class");
        const pluginMethod = searchParams.get("method");
        const pluginOp = searchParams.get("op");

        const options = {
            "settings": '[% "Settings" | gettext %]',
            "target-groups": '[% "Target Groups" | gettext %]',
            "locations": '[% "Locations" | gettext %]',
            "event-types": '[% "Event Types" | gettext %]',
            "opac-widget": '[% "OPAC Widget" | gettext %]',
            "events": '[% "Events" | gettext %]',
            "images": '[% "Images" | gettext %]',
        };

        if (pluginMethod) {
            contextualBaseAnchor.href = `/cgi-bin/koha/plugins/run.pl?class=${pluginClass}&method=${pluginMethod}`;
        }

        if (pluginOp) {
            contextualPageAnchor.href = `/cgi-bin/koha/plugins/run.pl?class=${pluginClass}&method=${pluginMethod}&op=${pluginOp}`;
            contextualPageAnchor.textContent = options[pluginOp];
        } else {
            contextualPageAnchor.parentElement.remove();
            contextualBaseAnchor.ariaCurrent = "page";
        }
    }
</script>