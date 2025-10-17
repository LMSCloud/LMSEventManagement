import interact from "interactjs";
import { css, html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import pell from "pell";
import { __, attr__ } from "../../lib/translate";
import { skeletonStyles } from "../../styles/skeleton";
import { utilityStyles } from "../../styles/utilities";
import { tailwindStyles } from "../../tailwind.lit";

@customElement("lms-pell-editor")
export default class LMSPellEditor extends LitElement {
    @property({ type: String }) value = "";

    @query("#modal") modal!: HTMLDialogElement;

    @query("#editor") editor!: HTMLDivElement;

    @query(".input-slot") inputSlot!: HTMLSlotElement;

    @query(".drag-handle") dragHandle!: HTMLDivElement;

    @state() hasVisibleToggle = false;

    private editedValue = "";

    private pellEditor: { content: HTMLElement } | undefined;

    private dragInteractable: Interact.Interactable | undefined;

    private resizeInteractable: Interact.Interactable | undefined;

    static override styles = [
        tailwindStyles,
        skeletonStyles,
        utilityStyles,
        css`
            #modal::part(backdrop) {
                background-color: rgb(0 0 0 / 50%);
            }

            #modal {
                position: fixed;
                padding: 0;
                border: 1px solid var(--separator-mid);
                border-radius: 0.5rem;
                margin: auto;
                box-shadow: var(--shadow-hv);
                min-width: 25vw;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                transition: opacity 0.15s ease-out;
            }

            #modal.closing {
                opacity: 0;
                pointer-events: none;
            }

            .drag-handle {
                position: relative;
                cursor: move;
                font-size: 1.2em;
                color: #999;
                user-select: none;
                padding: 0.5em 1em;
                z-index: 10;
                line-height: 1;
                border-bottom: 1px solid #e0e0e0;
                width: 100%;
                text-align: center;
                background-color: #fafafa;
                flex-shrink: 0;
                touch-action: none;
            }

            .drag-handle * {
                pointer-events: none;
            }

            .drag-handle:hover {
                color: #333;
                background-color: #f0f0f0;
            }

            #editor {
                width: 100%;
                padding: 1em;
                overflow-y: auto;
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }

            .pell-actionbar {
                display: flex;
                justify-content: space-between;
                background-color: #f5f5f5;
                padding: 1em;
                border: 1px solid #ddd;
                border-radius: 0.25rem;
                margin-bottom: 1em;
                flex-shrink: 0;
            }

            .pell-button {
                background: none;
                border: none;
                cursor: pointer;
                color: #333;
            }

            .pell-button:hover {
                color: #007bff;
            }

            .pell-content {
                flex: 1;
                width: 100%;
                border: 1px solid #ddd;
                border-radius: 0.25rem;
                padding: 1em;
                overflow-wrap: break-word;
                overflow-y: auto;
                min-height: 0;
            }

            .pell-button-selected {
                color: #007bff;
            }

            .btn-group-modal {
                flex-shrink: 0;
                padding: 1em;
                border-top: 1px solid #e0e0e0;
                background-color: #fff;
            }

            .input-slot {
                height: 100%;
            }
        `,
    ];

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanupInteractions();
    }

    override render() {
        return html`
            <dialog id="modal">
                <div class="drag-handle" title=${attr__("Drag to move")}>⠿</div>
                <div id="editor"></div>
                <div class="btn-group-modal join flex content-end">
                    <button
                        class="btn btn-secondary btn-outline mr-auto"
                        @click=${this.resetSize}
                    >
                        ${__("Reset size")}
                    </button>
                    <button
                        class="btn btn-secondary mr-3"
                        @click=${this.closeModalWithoutSaving}
                    >
                        ${__("Close")}
                    </button>
                    <button
                        class="btn btn-primary"
                        @click=${this.closeModalWithSave}
                    >
                        ${__("Save")}
                    </button>
                </div>
            </dialog>
            <slot
                @dblclick=${this.openModal}
                class="input-slot"
                title=${attr__("Double click to open the editor.")}
            ></slot>
        `;
    }

    override firstUpdated(_changedProperties: PropertyValueMap<never>) {
        super.firstUpdated(_changedProperties);
        // Initialize interactions once
        this.initResizableModal();
    }

    private getDefaultModalSize() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        return {
            width: Math.min(viewportWidth * 0.8, 1200),
            height: Math.min(viewportHeight * 0.7, 800),
        };
    }

    private setModalSize(width: number, height: number) {
        this.modal.style.width = `${width}px`;
        this.modal.style.height = `${height}px`;
    }

    private openModal(e: MouseEvent) {
        e.stopPropagation();

        // Set initial modal size before showing to prevent auto-sizing
        const { width, height } = this.getDefaultModalSize();
        this.setModalSize(width, height);

        // Initialize drag position if not set
        if (!this.modal.dataset["x"]) this.modal.dataset["x"] = '0';
        if (!this.modal.dataset["y"]) this.modal.dataset["y"] = '0';

        this.modal.showModal();

        // Read the current value from the slotted input/textarea element
        const slottedElements = this.inputSlot?.assignedElements();
        if (slottedElements && slottedElements.length > 0) {
            const element = slottedElements[0];
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                this.value = element.value;
            }
        }

        this.editedValue = this.value; // Copy the value property

        // Wait for modal to be fully displayed before initializing the editor
        // This ensures pell's event listeners are properly attached to visible elements
        requestAnimationFrame(() => {
            // Reinitialize the pell editor to ensure proper state
            this.initEditor();

            // Focus the editor content so toolbar buttons work
            if (this.pellEditor) {
                this.pellEditor.content.focus();
            }
        });
    }

    private performModalClose() {
        // Hide modal immediately for instant feedback
        this.modal.classList.add('closing');

        // Close and cleanup
        requestAnimationFrame(() => {
            this.modal.close();
            this.modal.classList.remove('closing');
            this.requestUpdate();
        });
    }

    private closeModalWithoutSaving() {
        this.performModalClose();
    }

    private closeModalWithSave() {
        // Update slotted element value
        if (this.editedValue !== this.value) {
            const slottedElements = this.inputSlot?.assignedElements();
            slottedElements?.forEach((element) => {
                if (element instanceof HTMLInputElement) {
                    element.value = this.editedValue;
                    element.blur();
                } else if (element instanceof HTMLTextAreaElement) {
                    element.value = this.editedValue;
                    element.blur();
                }
            });
        }

        this.performModalClose();
    }

    private resetSize() {
        // Reset to viewport-relative size (80% width, 70% height)
        const { width, height } = this.getDefaultModalSize();
        this.setModalSize(width, height);

        // Reset position
        this.modal.style.transform = 'translate(0px, 0px)';
        this.modal.dataset["x"] = '0';
        this.modal.dataset["y"] = '0';
    }

    private initEditor() {
        if (this.editor) {
            // Clear the editor container to avoid duplicate elements
            this.editor.innerHTML = "";

            // Initialize pell editor
            this.pellEditor = pell.init({
                element: this.editor,
                onChange: (html) => {
                    this.editedValue = html; // Update the editedValue with the edited content
                },
                defaultParagraphSeparator: "div",
                styleWithCSS: false,
                actions: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "heading1",
                    "heading2",
                    "paragraph",
                    "quote",
                    "olist",
                    "ulist",
                    "code",
                    "line",
                    "link",
                    "image",
                ],
                classes: {
                    actionbar: "pell-actionbar",
                    button: "pell-button",
                    content: "pell-content",
                    selected: "pell-button-selected",
                },
            });

            this.pellEditor.content.innerHTML = this.value; // Set the initial value

            // Add prose class for Tailwind typography styling
            this.pellEditor.content.classList.add("prose", "max-w-none");

            // Prevent toolbar buttons from stealing focus from the contenteditable area
            // This is critical for document.execCommand() to work properly
            const actionBar = this.editor.querySelector(".pell-actionbar");
            if (actionBar) {
                actionBar.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                });
            }
        }
    }

    private cleanupInteractions() {
        // Unset and destroy interact.js instances
        if (this.dragInteractable) {
            this.dragInteractable.unset();
            this.dragInteractable = undefined;
        }
        if (this.resizeInteractable) {
            this.resizeInteractable.unset();
            this.resizeInteractable = undefined;
        }
    }

    private initResizableModal() {
        // Make drag handle draggable (moves the modal)
        this.dragInteractable = interact(this.dragHandle).draggable({
            inertia: false,
            listeners: {
                move: (event) => {
                    let x = (parseFloat(this.modal.dataset["x"] ?? "0")|| 0) + event.dx;
                    let y = (parseFloat(this.modal.dataset["y"] ?? "0") || 0) + event.dy;

                    this.modal.style.transform = `translate(${x}px, ${y}px)`;

                    this.modal.dataset["x"] = x.toString();
                    this.modal.dataset["y"] = y.toString();
                }
            }
        });

        // Make modal resizable
        this.resizeInteractable = interact(this.modal).resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            ignoreFrom: '.drag-handle',
            listeners: {
                move: (event) => {
                    let { x, y } = event.target.dataset;

                    x = (parseFloat(x) || 0) + event.deltaRect.left;
                    y = (parseFloat(y) || 0) + event.deltaRect.top;

                    Object.assign(event.target.style, {
                        width: `${event.rect.width}px`,
                        height: `${event.rect.height}px`,
                        transform: `translate(${x}px, ${y}px)`,
                    });

                    Object.assign(event.target.dataset, { x, y });
                },
            },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: { width: 200, height: 150 },
                }),
                interact.modifiers.aspectRatio({
                    ratio: 'preserve',
                    enabled: false,
                    modifiers: [
                        interact.modifiers.restrictSize({
                            min: { width: 200, height: 150 }
                        })
                    ]
                })
            ],
            inertia: false,
        });
    }
}
