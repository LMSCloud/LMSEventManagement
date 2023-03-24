import { LitElement, nothing } from "lit";
import { EventType, LMSEvent, LMSLocation, TargetGroupState } from "../sharedDeclarations";
export default class LMSCardDetailsModal extends LitElement {
    event: LMSEvent;
    isOpen: boolean;
    event_types: EventType[];
    locations: LMSLocation[];
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    handleSimulatedBackdropClick(event: MouseEvent): void;
    private toggleModal;
    willUpdate(): void;
    render(): import("lit").TemplateResult<1>;
    getMarkupByObjectProperty(entry: [string, string | number | TargetGroupState[]]): typeof nothing | import("lit").TemplateResult<1>;
}
//# sourceMappingURL=LMSCardDetailsModal.d.ts.map