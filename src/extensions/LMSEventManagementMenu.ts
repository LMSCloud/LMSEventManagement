import LMSFloatingMenu from "../components/LMSFloatingMenu";
import {
  faCog,
  faTag,
  faList,
  faBullseye,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { customElement, property } from "lit/decorators";
import { Gettext } from "gettext.js";

@customElement("lms-event-management-menu")
export default class LMSEventMangementMenu extends LMSFloatingMenu {
  @property({ type: String }) baseurl = "";
  @property({ type: String }) pluginclass = "";
  @property({ type: Function, attribute: false }) menuEntries = (
    i18n: Gettext
  ) => [
    {
      name: i18n.gettext("Settings") ?? "Settings",
      icon: faCog,
      url: `${this.baseurl}?class=${this.pluginclass}&method=configure`,
      method: "configure",
    },
    {
      name: i18n.gettext("Event Types") ?? "Event Types",
      icon: faTag,
      url: `${this.baseurl}?class=${this.pluginclass}&method=configure&op=event-types`,
      method: "configure",
    },
    {
      name: i18n.gettext("Target Groups") ?? "Target Groups",
      icon: faBullseye,
      url: `${this.baseurl}?class=${this.pluginclass}&method=configure&op=target-groups`,
      method: "configure",
    },
    {
      name: i18n.gettext("Locations") ?? "Locations",
      icon: faLocationDot,
      url: `${this.baseurl}?class=${this.pluginclass}&method=configure&op=locations`,
      method: "configure",
    },
    {
      name: i18n.gettext("Events") ?? "Events",
      icon: faList,
      url: `${this.baseurl}?class=${this.pluginclass}&method=tool`,
      method: "tool",
    },
  ];

  override connectedCallback() {
    super.connectedCallback();

    if (this._i18n instanceof Promise) {
      this.items = [];
      this._i18n.then((i18n) => {
        this.items = this.menuEntries(i18n);
      });
      return;
    }

    this.items = this.menuEntries(this._i18n);
  }
}
