import { faBars, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { litFontawesome } from "@weavedev/lit-fontawesome";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TranslatedString } from "../sharedDeclarations";
import { tailwindStyles } from "../tailwind.lit";

type MenuEntry = {
    name: string | TranslatedString;
    icon: IconDefinition;
    url: string;
    method: string;
};

type Logo = {
    src: string;
    alt: string;
};

@customElement("lms-floating-menu")
export default class LMSFloatingMenu extends LitElement {
    @property({ type: String }) brand = "Navigation";

    @property({
        type: Object,
        converter: (value) => (value ? JSON.parse(value) : {}),
    })
    logo: Logo = {} as Logo;

    @property({ type: Array }) items: MenuEntry[] = [];

    static override styles = [
        tailwindStyles,
        css`
            svg {
                width: 1rem;
                height: 1rem;
            }
        `,
    ];

    override render() {
        return html`
            <div class="navbar mb-8 rounded-lg bg-base-100 shadow-md">
                <div class="navbar-start">
                    <div class="dropdown">
                        <label tabindex="0" class="btn-ghost btn lg:hidden">
                            ${litFontawesome(faBars)}
                        </label>
                        <ul
                            tabindex="0"
                            class="dropdown-content menu rounded-box menu-sm z-50 mt-3 w-56 bg-base-100 p-2 shadow"
                        >
                            ${this.items.map(
                                ({ url, icon, name }) =>
                                    html`
                                        <li
                                            class="rounded-lg hover:bg-base-200"
                                        >
                                            <a
                                                href=${url}
                                                class="text-base font-medium"
                                            >
                                                ${litFontawesome(icon)}&nbsp;
                                                ${name}</a
                                            >
                                        </li>
                                    `
                            )}
                        </ul>
                    </div>
                    <figure class="p-4" ?hidden=${Boolean(!this.logo?.src)}>
                        <img
                            src=${this.logo?.src}
                            alt=${this.logo?.alt}
                            class="h-8 w-8"
                        />
                    </figure>
                    <a class="text-xl normal-case" href="#"
                        ><strong ?hidden=${!this.brand}
                            >${this.brand}</strong
                        ></a
                    >
                </div>
                <div class="navbar-center hidden lg:flex">
                    <ul class="menu menu-horizontal px-1">
                        ${this.items.map(
                            ({ url, icon, name }) =>
                                html`
                                    <li
                                        class="rounded-lg text-base hover:bg-base-200"
                                    >
                                        <a href=${url}
                                            >${litFontawesome(icon)}&nbsp;
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
