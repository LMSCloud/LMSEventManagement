import { InputsSnapshot } from "../../src/lib/InputsSnapshot";

function createContainer(...elements: Element[]): HTMLDivElement {
    const container = document.createElement("div");
    elements.forEach((el) => container.appendChild(el));
    return container;
}

describe("InputsSnapshot", () => {
    describe("text inputs", () => {
        it("snapshots and reverts text input values", () => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = "original";

            const container = createContainer(input);
            const snapshot = new InputsSnapshot(container.querySelectorAll("*"));

            input.value = "changed";
            expect(input.value).toBe("changed");

            snapshot.revert();
            expect(input.value).toBe("original");
        });

        it("snapshots multiple inputs", () => {
            const input1 = document.createElement("input");
            input1.type = "text";
            input1.value = "first";

            const input2 = document.createElement("input");
            input2.type = "text";
            input2.value = "second";

            const container = createContainer(input1, input2);
            const snapshot = new InputsSnapshot(container.querySelectorAll("*"));

            input1.value = "modified1";
            input2.value = "modified2";

            snapshot.revert();
            expect(input1.value).toBe("first");
            expect(input2.value).toBe("second");
        });
    });

    describe("checkboxes", () => {
        it("snapshots and reverts checked state", () => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = true;

            const container = createContainer(checkbox);
            const snapshot = new InputsSnapshot(container.querySelectorAll("*"));

            checkbox.checked = false;
            expect(checkbox.checked).toBe(false);

            snapshot.revert();
            expect(checkbox.checked).toBe(true);
        });

        it("reverts unchecked state", () => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = false;

            const container = createContainer(checkbox);
            const snapshot = new InputsSnapshot(container.querySelectorAll("*"));

            checkbox.checked = true;
            snapshot.revert();
            expect(checkbox.checked).toBe(false);
        });
    });

    describe("select elements", () => {
        it("snapshots and reverts value", () => {
            const select = document.createElement("select");
            const opt1 = document.createElement("option");
            opt1.value = "a";
            const opt2 = document.createElement("option");
            opt2.value = "b";
            select.appendChild(opt1);
            select.appendChild(opt2);
            select.value = "a";

            const container = createContainer(select);
            const snapshot = new InputsSnapshot(container.querySelectorAll("*"));

            select.value = "b";
            expect(select.value).toBe("b");

            snapshot.revert();
            expect(select.value).toBe("a");
        });
    });

    describe("textarea elements", () => {
        it("snapshots and reverts textarea value", () => {
            const textarea = document.createElement("textarea");
            textarea.value = "original text";

            const container = createContainer(textarea);
            const snapshot = new InputsSnapshot(container.querySelectorAll("*"));

            textarea.value = "changed text";
            snapshot.revert();
            expect(textarea.value).toBe("original text");
        });
    });

    describe("filtering", () => {
        it("filters out non-input elements", () => {
            const div = document.createElement("div");
            const span = document.createElement("span");
            const input = document.createElement("input");
            input.type = "text";
            input.value = "test";

            const container = createContainer(div, span, input);
            const snapshot = new InputsSnapshot(container.querySelectorAll("*"));

            expect(snapshot.getAmountSnapshotted()).toBe(1);
        });

        it("returns 0 for container with no input elements", () => {
            const div = document.createElement("div");
            const span = document.createElement("span");

            const container = createContainer(div, span);
            const snapshot = new InputsSnapshot(container.querySelectorAll("*"));

            expect(snapshot.getAmountSnapshotted()).toBe(0);
        });
    });

    describe("getAmountSnapshotted", () => {
        it("returns correct count of snapshotted inputs", () => {
            const input1 = document.createElement("input");
            const input2 = document.createElement("input");
            const textarea = document.createElement("textarea");
            const select = document.createElement("select");

            const container = createContainer(input1, input2, textarea, select);
            const snapshot = new InputsSnapshot(container.querySelectorAll("*"));

            expect(snapshot.getAmountSnapshotted()).toBe(4);
        });
    });

    describe("revert fires change event on first input", () => {
        it("dispatches a change event on the first input when reverting", () => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = "original";

            const container = createContainer(input);
            const snapshot = new InputsSnapshot(container.querySelectorAll("*"));

            const changeSpy = vi.fn();
            input.addEventListener("change", changeSpy);

            input.value = "changed";
            snapshot.revert();

            expect(changeSpy).toHaveBeenCalledTimes(1);
        });
    });
});
