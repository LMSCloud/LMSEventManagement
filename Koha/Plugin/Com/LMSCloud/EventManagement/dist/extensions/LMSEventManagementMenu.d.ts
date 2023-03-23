import LMSFloatingMenu from "../components/LMSFloatingMenu";
import { Gettext } from "gettext.js";
export default class LMSEventMangementMenu extends LMSFloatingMenu {
    baseurl: string;
    pluginclass: string;
    menuEntries: (i18n: Gettext) => {
        name: string;
        icon: import("@fortawesome/free-solid-svg-icons").IconDefinition;
        url: string;
        method: string;
    }[];
    connectedCallback(): void;
}
//# sourceMappingURL=LMSEventManagementMenu.d.ts.map