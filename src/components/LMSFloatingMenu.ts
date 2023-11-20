import { faBars, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";
import { tailwindStyles } from "../tailwind.lit";
import { TranslatedString } from "../types/common";

type MenuEntry = {
    id: string;
    name: string | TranslatedString;
    icon: IconDefinition;
    url: string;
    method: string;
};

@customElement("lms-floating-menu")
export default class LMSFloatingMenu extends LitElement {
    @property({ type: String }) brand?: string;

    @property({ type: String, attribute: "brand-href" }) brandHref?: string;

    @property({ type: String }) logo?: string;

    @property({ type: String, attribute: "logo-href" }) logoHref?: string;

    @state() items?: MenuEntry[];

    static override styles = [tailwindStyles];

    public isActive(id: string) {
        console.info(
            "Override this method in your extended LMSFloatingMenu class.",
            id
        );
        return false;
    }

    override render() {
        return html`
            <div class="navbar mb-8 rounded-lg bg-base-100 shadow-md">
                <div class="navbar-start">
                    <div class="dropdown">
                        <label tabindex="0" class="btn btn-ghost lg:hidden">
                            ${litFontawesome(faBars, {
                                className: "w-4 h-4 inline-block",
                            })}
                        </label>
                        <ul
                            tabindex="0"
                            class="menu dropdown-content rounded-box menu-sm z-50 mt-3 w-fit bg-base-100 p-4 shadow"
                        >
                            ${map(
                                this.items,
                                ({ id, url, icon, name }) =>
                                    html`
                                        <li
                                            class="${classMap({
                                                "bg-base-200":
                                                    this.isActive(id),
                                            })} rounded-lg hover:bg-base-200"
                                        >
                                            <a
                                                href=${url}
                                                class="text-base font-medium"
                                            >
                                                ${litFontawesome(icon, {
                                                    className:
                                                        "w-4 h-4 inline-block",
                                                })}&nbsp;
                                                ${name}</a
                                            >
                                        </li>
                                    `
                            )}
                        </ul>
                    </div>
                    <figure ?hidden=${!this.logo} class="p-4">
                        <a href=${ifDefined(this.logoHref)}>
                            <img src=${ifDefined(this.logo)} class="h-8 w-8" />
                        </a>
                    </figure>
                    <a
                        class="text-xl normal-case"
                        href=${ifDefined(this.brandHref)}
                        target="_blank"
                        ><strong ?hidden=${!this.brand}
                            >${this.brand}</strong
                        ></a
                    >
                </div>
                <div class="navbar-center hidden lg:flex">
                    <ul class="menu menu-horizontal px-1">
                        ${map(
                            this.items,
                            ({ id, url, icon, name }) =>
                                html`
                                    <li
                                        class="${classMap({
                                            "bg-base-200": this.isActive(id),
                                        })} mx-1 rounded-lg text-base hover:bg-base-200"
                                    >
                                        <a href=${url}
                                            >${litFontawesome(icon, {
                                                className:
                                                    "w-4 h-4 inline-block",
                                            })}&nbsp;
                                            ${name}</a
                                        >
                                    </li>
                                `
                        )}
                    </ul>
                </div>
            </div>
        `;
    }
}
