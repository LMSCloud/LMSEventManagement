$(document).ready(function() {
    const isMainPage =
        window.location.pathname === '/cgi-bin/koha/opac-main.pl' ||
        window.location.pathname === '/' ||
        document.body.classList.contains('opac-main');

    if (!isMainPage) {
        return;
    }

    fetch('/api/v1/contrib/eventmanagement/public/settings')
        .then(response => response.json())
        .then(settings => {
            const autoInject = settings.find(s => s.plugin_key === 'widget_auto_inject');

            if (!autoInject || autoInject.plugin_value != 1) {
                return;
            }

            let container = document.getElementById('opacmainuserblock');

            if (!container) {
                const mainContent = document.querySelector('.maincontent .row');
                container = mainContent;
            }

            if (container) {
                const widget = document.createElement('lms-opac-events-widget');
                container.appendChild(widget);
            }
        })
        .catch(error => {
            console.error('Failed to load widget settings:', error);
        });
});
