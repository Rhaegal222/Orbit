if (typeof window !== 'undefined') {
  class ResizeObserverMock {
    observe(): void {
      // Intentionally empty test double.
    }

    unobserve(): void {
      // Intentionally empty test double.
    }

    disconnect(): void {
      // Intentionally empty test double.
    }
  }

  Object.assign(globalThis, { ResizeObserver: ResizeObserverMock });
  Object.assign(window, { ResizeObserver: ResizeObserverMock });
}
