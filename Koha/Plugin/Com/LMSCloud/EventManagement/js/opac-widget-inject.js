// Auto-inject OPAC events widget on homepage
$(document).ready(function() {
    // Only inject on the main OPAC page
    const isMainPage =
        window.location.pathname === '/cgi-bin/koha/opac-main.pl' ||
        window.location.pathname === '/' ||
        document.body.classList.contains('opac-main');

    if (!isMainPage) {
        return;
    }

    // Find a suitable container - adjust selector based on your OPAC theme
    let container = document.getElementById('opacmainuserblock');

    if (!container) {
        const mainContent = document.querySelector('.maincontent .row');
        container = mainContent;
    }

    if (container) {
        // Create widget element
        const widget = document.createElement('lms-opac-events-widget');

        // Prepend to container
        container.insertBefore(widget, container.firstChild);
    }
});
