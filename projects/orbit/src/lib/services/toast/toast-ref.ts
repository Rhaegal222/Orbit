import { Subject } from 'rxjs';

/**
 * Removes a single toast's own rendered content. Implemented by
 * `OrbitToastService` — since several toasts can share one CDK overlay
 * (stacked at the same position), dismissing one toast must not detach the
 * whole overlay, only destroy that toast's own component.
 */
export interface OrbitToastHost {
  detach(): void;
}

/**
 * Handle returned by `OrbitToastService.show()`. Lets the caller dismiss the
 * toast programmatically and observe when it has actually been removed.
 */
export class OrbitToastRef {
  private readonly afterDismissedSubject = new Subject<void>();
  readonly afterDismissed$ = this.afterDismissedSubject.asObservable();

  private dismissed = false;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private remainingMs = 0;
  private startedAt = 0;

  constructor(
    private readonly host: OrbitToastHost,
    private readonly duration: number,
    private readonly onDismissed: () => void,
  ) {
    this.remainingMs = duration;
    this.startTimer();
  }

  dismiss(): void {
    if (this.dismissed) return;
    this.dismissed = true;
    this.clearTimer();
    this.host.detach();
    this.onDismissed();
    this.afterDismissedSubject.next();
    this.afterDismissedSubject.complete();
  }

  pauseAutoDismiss(): void {
    if (this.dismissed || this.timeoutId === null) return;
    this.remainingMs -= Date.now() - this.startedAt;
    this.clearTimer();
  }

  resumeAutoDismiss(): void {
    if (this.dismissed || this.duration <= 0 || this.timeoutId !== null) return;
    this.startTimer();
  }

  private startTimer(): void {
    if (this.duration <= 0 || this.remainingMs <= 0) return;
    this.startedAt = Date.now();
    this.timeoutId = setTimeout(() => this.dismiss(), this.remainingMs);
  }

  private clearTimer(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
