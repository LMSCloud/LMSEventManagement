export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj as T;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (Array.isArray(obj))
    return obj.map((item) => deepCopy(item)) as unknown as T;

  const newObj = Object.create(Object.getPrototypeOf(obj)) as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
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

  const keys1 = Object.keys(obj1 as object);
  const keys2 = Object.keys(obj2 as object);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (
      typeof (obj1 as any)[key] === "function" ||
      typeof (obj2 as any)[key] === "function"
    ) {
      if ((obj1 as any)[key].toString() !== (obj2 as any)[key].toString()) {
        return false;
      }
    } else if (
      typeof (obj1 as any)[key] === "object" &&
      typeof (obj2 as any)[key] === "object"
    ) {
      if (!isDeepEqual((obj1 as any)[key], (obj2 as any)[key])) {
        return false;
      }
    } else if ((obj1 as any)[key] !== (obj2 as any)[key]) {
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
