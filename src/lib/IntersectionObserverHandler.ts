type Intersectable = {
  ref: HTMLElement;
  do?: () => void;
};

type Intersectables = {
  intersecting: Intersectable;
  intersected: Intersectable;
} & (
  | { intersecting: { do: () => void } }
  | { intersected: { do: () => void } }
);

export class IntersectionObserverHandler {
  intersecting: Intersectable;
  intersected: Intersectable;
  observer: IntersectionObserver | null = null;

  constructor({ intersecting, intersected }: Intersectables) {
    this.intersecting = intersecting;
    this.intersected = intersected;
  }

  init() {
    if (
      this.intersecting.ref instanceof HTMLElement &&
      this.intersected.ref instanceof HTMLElement
    ) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (
            entry.target === this.intersecting.ref &&
            entry.isIntersecting &&
            entry.intersectionRatio > 0
          ) {
            this.intersecting.do?.();
          } else if (
            entry.target === this.intersected.ref &&
            entry.isIntersecting &&
            entry.intersectionRatio > 0
          ) {
            this.intersected.do?.();
          }
        });
      });

      this.observer.observe(this.intersecting.ref);
      this.observer.observe(this.intersected.ref);
    } else {
      throw new Error(
        "Invalid parameters supplied to IntersectionObserverClass. Please ensure both 'intersecting' and 'intersected' are valid Intersectable types."
      );
    }
  }
}
