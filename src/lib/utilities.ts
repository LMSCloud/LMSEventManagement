export function deepCopy<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") {
        return obj as T;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as T;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => deepCopy(item)) as unknown as T;
    }

    const newObj = Object.create(Object.getPrototypeOf(obj)) as T;
    for (const key in obj) {
        if ({}.hasOwnProperty.call(obj, key)) {
            (newObj as Record<string, unknown>)[key] = deepCopy(
                (obj as Record<string, unknown>)[key]
            );
        }
    }

    return newObj;
}

export function isDeepEqual<T>(obj1: T, obj2: T): boolean {
    if (obj1 === obj2) {
        return true;
    }

    if (
        typeof obj1 !== "object" ||
        obj1 === null ||
        typeof obj2 !== "object" ||
        obj2 === null
    ) {
        return false;
    }

    const keys1 = Object.keys(obj1) as Array<keyof T>;
    const keys2 = Object.keys(obj2) as Array<keyof T>;

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }
        const value1 = (obj1 as unknown as Record<keyof T, unknown>)[key];
        const value2 = (obj2 as unknown as Record<keyof T, unknown>)[key];

        if (typeof value1 === "function" || typeof value2 === "function") {
            if (String(value1) !== String(value2)) {
                return false;
            }
        } else if (typeof value1 === "object" && typeof value2 === "object") {
            if (!isDeepEqual(value1, value2)) {
                return false;
            }
        } else if (value1 !== value2) {
            return false;
        }
    }

    return true;
}

export function throttle(callback: () => void, delay: number) {
    let previousCall = new Date().getTime();
    return function () {
        const time = new Date().getTime();
        if (time - previousCall >= delay) {
            previousCall = time;
            callback();
        }
    };
}

export function debounce<F extends (...args: never[]) => void>(
    func: F,
    wait: number,
    immediate: boolean
): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
        const later = function (this: unknown) {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };

        const callNow = immediate && !timeout;
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(this, args);
        }
    };
}
