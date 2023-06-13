import { html, TemplateResult } from "lit";

function createWrapper(breakpoints: string[]): TemplateResult {
    const [block, none] = breakpoints;
    return html`
        <div
            class="w-100 d-none ${`d-${block}-block`} ${none
                ? `d-${none}-none`
                : `d-none`}"
        ></div>
    `;
}

export default function insertResponsiveWrapper(
    index: number
): TemplateResult[] {
    const breakpoints = [
        { n: 2, breakpoints: ["sm", "md"] },
        { n: 3, breakpoints: ["md", "lg"] },
        { n: 4, breakpoints: ["lg", "xl"] },
        { n: 5, breakpoints: ["xl", ""] },
    ];

    const wrappers = breakpoints
        .filter(({ n }) => (index + 1) % n === 0)
        .map(({ breakpoints }) => createWrapper(breakpoints));

    return wrappers;
}
