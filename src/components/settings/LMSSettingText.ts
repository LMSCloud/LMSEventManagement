import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { __ } from "../../lib/translate";
import { tailwindStyles } from "../../tailwind.lit";

@customElement("lms-setting-text")
export default class LMSSettingText extends LitElement {
    @property({ type: String }) name = "";
    @property({ type: String }) description = "";
    @property({ type: String }) value = "";
    @property({ type: String }) inputType: "text" | "number" | "email" = "text";
    @property({ type: String }) placeholder = "";
    @property({ type: Boolean }) saving = false;

    @state() private draft = "";

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
                gap: 0.5rem;
                align-items: center;
            }

            .setting-row__inline input {
                flex: 1;
                min-width: 0;
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

    private handleInput(e: Event) {
        this.draft = (e.target as HTMLInputElement).value;
    }

    private save() {
        this.dispatchEvent(
            new CustomEvent("setting-save", {
                detail: { key: this.name, value: this.draft },
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
                    <input
                        class="input input-bordered w-full"
                        type=${this.inputType === "email" ? "email" : "text"}
                        inputmode=${this.inputType === "number" ? "numeric" : "text"}
                        pattern=${this.inputType === "number" ? "[0-9]*" : ".*"}
                        name=${this.name}
                        placeholder=${this.placeholder}
                        .value=${this.draft}
                        @input=${this.handleInput}
                    />
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
