[% INCLUDE "$PLUGIN_DIR/includes/breadcrumbs.inc" %]

<div>
  <lms-container>
    <h3>Koha: LMSEventManagement: Loading...</h3>
    <div slot="menu">[% INCLUDE "$PLUGIN_DIR/includes/menu.inc" %]</div>
    <lms-view slot="content"> [% content %] </lms-view>

    <script defer>
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (target, name) => target.get(name) || "",
      });
      const lang = document.documentElement.lang.slice(0, 2);
      const translations = {
        tool: {
          en: "Tool",
          de: "Werkzeug",
        },
        configure: {
          en: "Configuration",
          de: "Konfiguration",
        },
      };
      document.title = document.title.replace(
        "Loading...",
        translations[params.method][lang]
      );
      const lastBreadcrumb = document.querySelector(
        "li.breadcrumb-item:last-child"
      );
      lastBreadcrumb.textContent = lastBreadcrumb.textContent.replace(
        "Loading...",
        translations[params.method][lang]
      );
      /*
      const lmseHeadingMain = document.getElementById("lmse-heading-main");
      lmseHeadingMain.textContent = lmseHeadingMain.textContent.replace(
        "Loading...",
        translations[params.method][lang]
      );
      */
    </script>
  </lms-container>
  [% INCLUDE 'intranet-bottom.inc' %]
</div>
