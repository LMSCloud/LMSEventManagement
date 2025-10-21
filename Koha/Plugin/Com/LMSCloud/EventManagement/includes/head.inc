[% USE gtx = Gettext('com.lmscloud.eventmanagement', LANG, 'utf-8', LOCALES) %]

[% INCLUDE 'doc-head-open.inc' %]
<title>Plugins - Koha: LMSEventManagement: ...</title>
<script src="/api/v1/contrib/eventmanagement/static/dist/staff.js" type="module"></script>
<script>
    {
        const searchParams = new URLSearchParams(window.location.search);
        const pluginMethod = searchParams.get("method");
        const options = {
            configure: '[% "Configure" | gettext %]',
            tool: '[% "Tool" | gettext %]',
        }
        document.title = document.title.replace("...", options[pluginMethod]);
    }
</script>
[% INCLUDE 'doc-head-close.inc' %]
</head>