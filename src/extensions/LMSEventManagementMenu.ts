import LMSFloatingMenu from "../components/LMSFloatingMenu";
import {
  faCog,
  faTag,
  faList,
  faBullseye,
  faLocationDot,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { customElement, property } from "lit/decorators.js";
import { __ } from "../lib/TranslationHandler";

@customElement("lms-event-management-menu")
export default class LMSEventMangementMenu extends LMSFloatingMenu {
  @property({ type: String }) baseurl = "";
  @property({ type: String }) pluginclass = "";

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("translations-loaded", () => {
      this.hydrate();
    });
  }

  private hydrate() {
    this.items = [
      {
        name: __("Settings"),
        icon: faCog,
        url: `${this.baseurl}?class=${this.pluginclass}&method=configure`,
        method: "configure",
      },
      {
        name: __("Target Groups"),
        icon: faBullseye,
        url: `${this.baseurl}?class=${this.pluginclass}&method=configure&op=target-groups`,
        method: "configure",
      },
      {
        name: __("Locations"),
        icon: faLocationDot,
        url: `${this.baseurl}?class=${this.pluginclass}&method=configure&op=locations`,
        method: "configure",
      },
      {
        name: __("Event Types"),
        icon: faTag,
        url: `${this.baseurl}?class=${this.pluginclass}&method=configure&op=event-types`,
        method: "configure",
      },
      {
        name: __("Events"),
        icon: faList,
        url: `${this.baseurl}?class=${this.pluginclass}&method=tool`,
        method: "tool",
      },
      {
        name: __("Images"),
        icon: faImage,
        url: `${this.baseurl}?class=${this.pluginclass}&method=tool&op=images`,
        method: "tool",
      },
    ];
  }
}
