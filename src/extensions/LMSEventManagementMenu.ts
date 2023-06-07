import {
    faBullseye,
    faCog,
    faImage,
    faList,
    faLocationDot,
    faTag,
} from "@fortawesome/free-solid-svg-icons";
import { customElement, property } from "lit/decorators.js";
import LMSFloatingMenu from "../components/LMSFloatingMenu";
import { __ } from "../lib/translate";

@customElement("lms-event-management-menu")
export default class LMSEventMangementMenu extends LMSFloatingMenu {
    @property({ type: String, attribute: "base-url" }) baseUrl = "";

    @property({ type: String, attribute: "plugin-class" }) pluginClass = "";

    override connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    private composeUrl(method: string, op?: string) {
        const searchParams = new URLSearchParams(this.baseUrl);
        searchParams.set("class", this.pluginClass);
        searchParams.set("method", method);
        if (op) {
            searchParams.set("op", op);
        }
        return `${this.baseUrl}?${searchParams.toString()}`;
    }

    private hydrate() {
        this.items = [
            {
                name: __("Settings"),
                icon: faCog,
                url: this.composeUrl("configure"),
                method: "configure",
            },
            {
                name: __("Target Groups"),
                icon: faBullseye,
                url: this.composeUrl("configure", "target-groups"),
                method: "configure",
            },
            {
                name: __("Locations"),
                icon: faLocationDot,
                url: this.composeUrl("configure", "locations"),
                method: "configure",
            },
            {
                name: __("Event Types"),
                icon: faTag,
                url: this.composeUrl("configure", "event-types"),
                method: "configure",
            },
            {
                name: __("Events"),
                icon: faList,
                url: this.composeUrl("tool"),
                method: "tool",
            },
            {
                name: __("Images"),
                icon: faImage,
                url: this.composeUrl("tool", "images"),
                method: "tool",
            },
        ];
    }
}
