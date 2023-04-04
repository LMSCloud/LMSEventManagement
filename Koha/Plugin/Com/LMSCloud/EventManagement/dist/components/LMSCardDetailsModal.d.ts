import { LitElement } from "lit";
import { EventType, LMSEvent, LMSLocation } from "../sharedDeclarations";
export default class LMSCardDetailsModal extends LitElement {
    event: LMSEvent;
    isOpen: boolean;
    event_types: EventType[];
    locations: LMSLocation[];
    locale: string;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    handleSimulatedBackdropClick(event: MouseEvent): void;
    private toggleModal;
    willUpdate(): void;
    render(): import("lit").TemplateResult<1>;
    formatDatetimeByLocale(datetime: string): string;
}
//# sourceMappingURL=LMSCardDetailsModal.d.ts.map