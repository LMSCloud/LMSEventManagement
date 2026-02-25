import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { P, match } from "ts-pattern";
import { __ } from "../lib/translate";
import { tailwindStyles } from "../tailwind.lit";

type OpenApiError = {
    message: string;
    path?: string;
};

type OpenApiErrors = Array<OpenApiError>;

@customElement("lms-open-api-errors")
export default class LMSOpenApiErrors extends LitElement {
    @property({ type: Array }) openApiErrors?: OpenApiErrors;

    private href: URL = new URL(window.location.href);

    static override styles = [tailwindStyles];

    private _renderHighlighted(substring: string, text: string) {
        const parts = text.split(substring);
        return parts.map((part, i) =>
            i < parts.length - 1
                ? html`${part}<span class="text-error">${substring}</span>`
                : html`${part}`
        );
    }

    private _composeHrefWithRemovedOffender(href: string, offender: string) {
        const url = new URL(href);
        url.searchParams.delete(offender);

        return url.toString();
    }

    private _renderErrorDescription({ message, path }: OpenApiError) {
        const pointers = path?.split("/").filter((pointer) => pointer !== "");
        return match(pointers)
            .with(
                P.nullish,
                () => html`
                    <div
                        class="card w-full bg-base-100 shadow-xl lg:w-3/4 xl:w-1/2"
                    >
                        <div class="card-body">
                            <h2 class="card-title">${message}</h2>
                        </div>
                    </div>
                `
            )
            .when(
                (ps) => ps.includes("path"),
                (ps) => html`
                    <div
                        class="card w-full bg-base-100 shadow-xl lg:w-3/4 xl:w-1/2"
                    >
                        <div class="card-body">
                            <h2 class="card-title">${message}</h2>
                            <code>
                                ...${this._renderHighlighted(
                                    ps.slice(-1).toString(),
                                    this.href.pathname
                                )}...</code
                            >
                            <div class="card-actions justify-end">
                                <a
                                    href="/cgi-bin/koha/plugins-home.pl"
                                    class="btn btn-primary"
                                >
                                    ${__("Go to plugins overview")}
                                </a>
                            </div>
                        </div>
                    </div>
                `
            )
            .when(
                (ps) => ps.includes("query"),
                (ps) => {
                    const offender = ps.slice(-1).toString();
                    return html`
                        <div
                            class="card w-full bg-base-100 shadow-xl lg:w-3/4 xl:w-1/2"
                        >
                            <div class="card-body">
                                <h2 class="card-title">${message}</h2>
                                <code
                                    >...${this._renderHighlighted(
                                        offender,
                                        this.href.search
                                    )}...</code
                                >
                                <div class="card-actions justify-end">
                                    <a
                                        href=${this._composeHrefWithRemovedOffender(
                                            window.location.href,
                                            offender
                                        )}
                                        class="btn btn-primary"
                                    >
                                        ${__("Reload without")} ${offender}
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
                }
            )
            .otherwise(() => nothing);
    }

    private _renderHeading() {
        return match(this.openApiErrors?.length)
            .with(P.nullish, () => nothing)
            .with(1, () => html`${"An error has occured"}`)
            .with(P.number.gt(1), () => html`${__("Errors have occured")}`)
            .otherwise(() => nothing);
    }

    override render() {
        return html`
            <div class="flex flex-col items-center gap-4">
                <h1 class="p-4 text-center text-error">
                    ${this._renderHeading()}
                </h1>
                ${map(this.openApiErrors, (error) =>
                    this._renderErrorDescription(error)
                )}
            </div>
        `;
    }
}
