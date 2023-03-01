import { LitElement } from "lit";
export default class LMSCard extends LitElement {
    title: string;
    text: string;
    image: {
        src: string;
        alt: string;
    };
    links: {
        href: string;
        text: string;
    }[];
    listItems: string[];
    static styles: import("lit").CSSResult[];
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSCard.d.ts.map