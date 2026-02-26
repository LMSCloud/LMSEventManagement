import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { __ } from "../../lib/translate";
import { tailwindStyles } from "../../tailwind.lit";

@customElement("lms-setting-toggle")
export default class LMSSettingToggle extends LitElement {
    @property({ type: String }) name = "";
    @property({ type: String }) description = "";
    @property({ type: Boolean }) value = false;
    @property({ type: Boolean }) saving = false;

    @state() private draft = false;

    static override styles = [
        tailwindStyles,
        css`
            :host {
                display: block;
            }

            .setting-row {
                display: grid;
                gap: 0.5rem;
                padding: 0.6rem 0;
            }

            .setting-row__name {
                font-size: 0.95rem;
                font-weight: 700;
                line-height: 1.3;
            }

            .setting-row__description {
                font-size: 0.8rem;
                color: rgb(100 116 139);
                line-height: 1.3;
                margin-top: 0.1rem;
            }

            .setting-row__inline {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .setting-row__toggle-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex: 1;
                min-width: 0;
            }

            .setting-row__on-off {
                font-size: 0.875rem;
                font-weight: 500;
            }

            @media (min-width: 768px) {
                .setting-row {
                    grid-template-columns: minmax(12rem, 2fr) minmax(0, 3fr);
                    gap: 1rem;
                    align-items: center;
                }
            }
        `,
    ];

    override willUpdate(changedProperties: Map<string, unknown>) {
        if (changedProperties.has("value")) {
            this.draft = this.value;
        }
    }

    private get dirty() {
        return this.draft !== this.value;
    }

    private handleChange(e: Event) {
        this.draft = (e.target as HTMLInputElement).checked;
    }

    private save() {
        this.dispatchEvent(
            new CustomEvent("setting-save", {
                detail: { key: this.name, value: this.draft ? "1" : "0" },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private abort() {
        this.draft = this.value;
    }

    override render() {
        return html`
            <div class="setting-row">
                <div>
                    <div class="setting-row__name">${__(this.name)}</div>
                    ${this.description ? html`<div class="setting-row__description">${this.description}</div>` : null}
                </div>
                <div class="setting-row__inline">
                    <div class="setting-row__toggle-label">
                        <input
                            class="toggle toggle-primary"
                            type="checkbox"
                            name=${this.name}
                            .checked=${this.draft}
                            @change=${this.handleChange}
                        />
                        <span class="setting-row__on-off">${this.draft ? __("On") : __("Off")}</span>
                    </div>
                    <button class="btn btn-primary" ?disabled=${this.saving || !this.dirty} @click=${this.save}>
                        ${__("Save")}
                    </button>
                    <button class="btn btn-ghost" ?disabled=${this.saving || !this.dirty} @click=${this.abort}>
                        ${__("Abort")}
                    </button>
                </div>
            </div>
        `;
    }
}
