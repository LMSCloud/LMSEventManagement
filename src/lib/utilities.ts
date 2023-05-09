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
