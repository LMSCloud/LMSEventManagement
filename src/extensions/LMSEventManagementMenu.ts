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
    @property({ type: String, attribute: "base-path" }) basePath = "";

    @property({ type: String, attribute: "plugin-class" }) pluginClass = "";

    override connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    private composeUrl(method: string, op?: string) {
        const searchParams = new URLSearchParams();
        searchParams.set("class", this.pluginClass);
        searchParams.set("method", method);
        if (op) {
            searchParams.set("op", op);
        }
        return `${this.basePath}?${searchParams.toString()}`;
    }

    public override isActive(id: string) {
        const searchParams = new URLSearchParams(window.location.search);
        if (id === "settings") {
            return (
                searchParams.get("method") === "configure" &&
                !searchParams.get("op")
            );
        }

        if (id === "events") {
            return (
                searchParams.get("method") === "tool" && !searchParams.get("op")
            );
        }

        return searchParams.get("op") === id;
    }

    private hydrate() {
        this.items = [
            {
                id: "settings",
                name: __("Settings"),
                icon: faCog,
                url: this.composeUrl("configure"),
                method: "configure",
            },
            {
                id: "target-groups",
                name: __("Target Groups"),
                icon: faBullseye,
                url: this.composeUrl("configure", "target-groups"),
                method: "configure",
            },
            {
                id: "locations",
                name: __("Locations"),
                icon: faLocationDot,
                url: this.composeUrl("configure", "locations"),
                method: "configure",
            },
            {
                id: "event-types",
                name: __("Event Types"),
                icon: faTag,
                url: this.composeUrl("configure", "event-types"),
                method: "configure",
            },
            {
                id: "events",
                name: __("Events"),
                icon: faList,
                url: this.composeUrl("tool"),
                method: "tool",
            },
            {
                id: "images",
                name: __("Images"),
                icon: faImage,
                url: this.composeUrl("tool", "images"),
                method: "tool",
            },
        ];
    }
}
