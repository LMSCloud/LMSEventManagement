// Side-effect module: patches LitElement.prototype.createRenderRoot to append
// the Koha staff theme as the last adopted stylesheet, overriding emerald defaults.
// Import this ONCE at the top of the staff entry point before any component imports.

import { LitElement } from "lit";
import { kohaStaffTheme } from "./koha-staff-theme";

const PATCHED = Symbol.for("koha-staff-theme-applied");

const proto = LitElement.prototype as any;

if (!proto[PATCHED]) {
    const original = proto.createRenderRoot;

    proto.createRenderRoot = function () {
        const root = original.call(this) as ShadowRoot;
        root.adoptedStyleSheets = [...root.adoptedStyleSheets, kohaStaffTheme];
        return root;
    };

    proto[PATCHED] = true;
}
