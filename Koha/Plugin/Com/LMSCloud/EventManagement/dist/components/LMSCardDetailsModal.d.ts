import { LitElement, nothing } from "lit";
import { EventType, LMSEvent, LMSLocation, TargetGroupFee } from "../sharedDeclarations";
import { Gettext } from "gettext.js";
type LMSEventFull = Omit<LMSEvent, "event_type" | "location" | "target_groups"> & {
    event_type: EventType;
    location: LMSLocation;
    target_groups: TargetGroupFee[];
};
export default class LMSCardDetailsModal extends LitElement {
    event: LMSEvent | LMSEventFull;
    isOpen: boolean;
    event_types: EventType[];
    locations: LMSLocation[];
    target_groups: TargetGroupFee[];
    locale: string;
    closeButton: HTMLButtonElement | undefined;
    protected i18n: Gettext;
    private translationHandler;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    handleSimulatedBackdropClick(event: MouseEvent): void;
    private toggleModal;
    willUpdate(): void;
    updated(): void;
    render(): import("lit").TemplateResult<1>;
    formatDatetimeByLocale(datetime: string): string | typeof nothing;
    formatAddressByLocale(address: LMSLocation): typeof nothing | import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=LMSCardDetailsModal.d.ts.map