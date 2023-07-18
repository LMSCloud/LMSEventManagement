import interact from "interactjs";
import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import pell from "pell";
import { __ } from "../../lib/translate";
import { debounce } from "../../lib/utilities";
import { skeletonStyles } from "../../styles/skeleton";
import { utilityStyles } from "../../styles/utilities";
import { tailwindStyles } from "../../tailwind.lit";

type StyleProperties =
    | "marginTop"
    | "marginBottom"
    | "paddingTop"
    | "paddingBottom"
    | "borderTopWidth"
    | "borderBottomWidth";

@customElement("lms-pell-editor")
export default class LMSPellEditor extends LitElement {
    @property({ type: String }) value = "";

    @query("#modal") modal!: HTMLDialogElement;

    @query("#editor") editor!: HTMLDivElement;

    @query(".input-slot") inputSlot!: HTMLSlotElement;

    @query(".pell-actionbar") actionBar!: HTMLDivElement;

    @query(".pell-content") pellContent!: HTMLDivElement;

    @query(".btn-group-modal") buttonGroupModal!: HTMLDivElement;

    @state() hasVisibleToggle = false;

    private editedValue = "";

    private resizeObserver: ResizeObserver | undefined;

    private originalSize: { width: number; height: number } = {
        width: 0,
        height: 0,
    };

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
                padding: 1em;
                border: 1px solid var(--separator-mid);
                border-radius: 0.5rem;
                margin: auto;
                box-shadow: var(--shadow-hv);
                min-width: 25vw;
            }

            #editor {
                width: 100%;
            }

            .pell-actionbar {
                display: flex;
                justify-content: space-between;
                background-color: #f5f5f5;
                padding: 1em;
                border: 1px solid #ddd;
                border-radius: 0.25rem;
                margin-bottom: 1em;
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
                min-height: 15vh;
                min-height: 15dvh;
                width: 100%;
                border: 1px solid #ddd;
                border-radius: 0.25rem;
                padding: 1em;
            }

            .pell-button-selected {
                color: #007bff;
            }

            .input-slot {
                height: 100%;
            }
        `,
    ];

    override connectedCallback() {
        super.connectedCallback();

        // Create a new ResizeObserver instance linked to the updateSize method
        this.resizeObserver = new ResizeObserver(() =>
            this.adjustContentHeight()
        );
    }

    override disconnectedCallback() {
        super.disconnectedCallback();

        // Disconnect the ResizeObserver when the component is disconnected
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
    }

    override render() {
        return html`
            <dialog id="modal">
                <div id="editor" class="m-auto"></div>
                <div class="btn-group-modal join mt-3 flex content-end">
                    <button
                        class="btn-secondary btn-outline btn mr-auto"
                        @click=${this.resetSize}
                    >
                        ${__("Reset size")}
                    </button>
                    <button
                        class="btn-secondary btn mr-3"
                        @click=${this.closeModalWithoutSaving}
                    >
                        ${__("Close")}
                    </button>
                    <button
                        class="btn-primary btn"
                        @click=${this.closeModalWithSave}
                    >
                        ${__("Save")}
                    </button>
                </div>
            </dialog>
            <slot @click=${this.openModal} class="input-slot"></slot>
        `;
    }

    override firstUpdated(changedProperties: PropertyValues) {
        super.firstUpdated(changedProperties);

        // Initialize pell editor
        this.initEditor();

        // Initialize resizable modal
        this.initResizableModal();

        // Observe size changes on modal
        this.resizeObserver?.observe(this.modal);
    }

    private openModal(e: MouseEvent) {
        e.stopPropagation();
        this.modal.showModal();
        this.editedValue = this.value; // Copy the value property

        // Store the original size of the modal
        this.originalSize = {
            width: this.modal.offsetWidth,
            height: this.modal.offsetHeight,
        };
    }

    private closeModalWithoutSaving() {
        this.modal.close();

        // Disconnect the ResizeObserver when the modal is closed
        this.resizeObserver?.disconnect();
    }

    private closeModalWithSave() {
        this.modal.close();

        // Disconnect the ResizeObserver when the modal is closed
        this.resizeObserver?.disconnect();

        // Update slotted element value
        if (this.editedValue !== this.value) {
            const slottedElements = this.inputSlot?.assignedElements();
            slottedElements?.forEach((element) => {
                if (element instanceof HTMLInputElement) {
                    element.value = this.editedValue;
                    element.blur();
                } else if (element instanceof HTMLTextAreaElement) {
                    element.innerHTML = this.editedValue;
                    element.blur();
                }
            });
        }
    }

    private resetSize() {
        // Reset the size of the modal to the original size
        this.modal.style.width = `${this.originalSize.width}px`;
        this.modal.style.height = `${this.originalSize.height}px`;

        // Adjust the content height after resizing
        this.adjustContentHeight();
    }

    private initEditor() {
        if (this.editor) {
            // Initialize pell editor
            const editor = pell.init({
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

            editor.content.innerHTML = this.value; // Set the initial value
        }
    }

    private adjustContentHeight = debounce(
        () => {
            const dialogHeight = this.modal.offsetHeight;

            // Calculate the total vertical space (height + margin + padding + border) occupied by the actionBar and buttons
            const actionBarSpace = this.calculateTotalVerticalSpace(
                this.actionBar
            );
            const buttonsSpace = this.calculateTotalVerticalSpace(
                this.buttonGroupModal
            );

            // Calculate the total vertical padding inside the modal
            const computedStyle = window.getComputedStyle(this.modal);
            const paddingY =
                parseFloat(computedStyle.paddingTop) +
                parseFloat(computedStyle.paddingBottom);

            // Calculate the contentHeight
            let contentHeight =
                dialogHeight - actionBarSpace - buttonsSpace - paddingY;

            // Ensure that contentHeight is not negative
            contentHeight = Math.max(0, contentHeight);

            // Set the height of pellContent
            this.pellContent.style.height = `${contentHeight}px`;
        },
        10,
        true
    );

    private sumStyleValues(
        computedStyle: CSSStyleDeclaration,
        values: StyleProperties[]
    ): number {
        return values.reduce(
            (sum, value) => sum + parseFloat(computedStyle[value] || "0"),
            0
        );
    }

    private calculateTotalVerticalSpace(element: HTMLElement) {
        const computedStyle = window.getComputedStyle(element);

        const marginY = this.sumStyleValues(computedStyle, [
            "marginTop",
            "marginBottom",
        ]);
        const paddingY = this.sumStyleValues(computedStyle, [
            "paddingTop",
            "paddingBottom",
        ]);
        const borderY = this.sumStyleValues(computedStyle, [
            "borderTopWidth",
            "borderBottomWidth",
        ]);

        return element.offsetHeight + Math.max(0, marginY, paddingY, borderY);
    }

    private initResizableModal() {
        interact(this.modal).resizable({
            edges: { left: true, right: true, bottom: true, top: true },
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

                    // Also resize the pell-content
                    this.adjustContentHeight();
                },
            },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: { width: 100, height: 50 },
                }),
            ],
            inertia: true,
        });
    }
}
