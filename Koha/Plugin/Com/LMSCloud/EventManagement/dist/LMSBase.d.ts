import { LitElement } from "lit";
export default abstract class LMSBase extends LitElement {
    private _translationsLoaded;
    private _initialUpdate;
    constructor();
    loadTranslations(): void;
    performUpdate(): void;
}
//# sourceMappingURL=LMSBase.d.ts.map