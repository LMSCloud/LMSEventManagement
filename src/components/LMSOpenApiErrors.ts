import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
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

    private _mark(substring: string, in_: string) {
        return in_.replaceAll(substring, `|${substring}|`);
    }

    private _indicesOf(pattern: RegExp, in_: string) {
        const indices: [number, number][] = [];
        const clonedPattern = new RegExp(pattern.source, "g");

        let match;
        while ((match = clonedPattern.exec(in_)) !== null) {
            const leftIndex = match.index;
            const rightIndex = leftIndex + match[0].length - 1;
            indices.push([leftIndex, rightIndex]);
        }

        return indices;
    }

    private _insert(into: string, value: string, at: number, end: number) {
        if (at < 0 || end < 0 || at > end || end > into.length) {
            throw new Error("Invalid indices");
        }

        return `${into.slice(0, at)}${value}${into.slice(end + 1)}`;
    }

    private _substitute(pattern: RegExp, with_: string, in_: string): string {
        let result = in_;
        let offset = 0;

        this._indicesOf(pattern, in_).forEach(([start, end]) => {
            const match = in_.slice(start, end + 1);
            const replacement = with_.replace("|x|", match);
            result = this._insert(
                result,
                replacement,
                start + offset,
                end + offset
            );
            offset += replacement.length - match.length;
        });

        return result;
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
                                ...${unsafeHTML(
                                    this._substitute(
                                        /[|](.*?)[|]/,
                                        `<span class="text-error"
                                        >|x|</span
                                    >`,
                                        this._mark(
                                            ps.slice(-1).toString(),
                                            this.href.pathname
                                        )
                                    )
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
                                    >...${unsafeHTML(
                                        this._substitute(
                                            /[|](.*?)[|]/,
                                            `<span class="text-error"
                                        >|x|</span
                                    >`,
                                            this._mark(
                                                offender,
                                                this.href.search
                                            )
                                        )
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
