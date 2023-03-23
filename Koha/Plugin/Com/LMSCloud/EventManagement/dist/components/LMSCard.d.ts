import { LitElement } from "lit";
type Image = {
    src: string;
    alt: string;
};
type Link = {
    href: string;
    text: string;
};
export default class LMSCard extends LitElement {
    title: string;
    text: string;
    image: Image;
    links: Link[];
    listItems: never[];
    static styles: import("lit").CSSResult[];
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSCard.d.ts.map