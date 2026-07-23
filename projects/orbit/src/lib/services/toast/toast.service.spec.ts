import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OrbitToastService } from './toast.service';

describe('OrbitToastService', () => {
  let service: OrbitToastService;
  let overlayContainer: OverlayContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrbitToastService);
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    vi.useRealTimers();
  });

  it('show() returns a ref synchronously', () => {
    const ref = service.show({ message: 'Ciao' });
    expect(ref).toBeTruthy();
    expect(overlayContainer.getContainerElement().textContent).toContain('Ciao');
  });

  it('stacks multiple show() calls to the same position in the correct order', () => {
    service.show({ message: 'First', position: 'bottom-end' });
    service.show({ message: 'Second', position: 'bottom-end' });

    const messages = Array.from(
      overlayContainer.getContainerElement().querySelectorAll('.orbit-toast__message'),
    ).map((el) => el.textContent);

    // bottom-* positions unshift, so the most recently shown toast is DOM-first.
    expect(messages[0]).toContain('Second');
    expect(messages[1]).toContain('First');
  });

  it('creates a separate container per position', () => {
    service.show({ message: 'A', position: 'top-start', duration: 0 });
    service.show({ message: 'B', position: 'bottom-end', duration: 0 });

    expect(
      overlayContainer.getContainerElement().querySelectorAll('.orbit-toast-container').length,
    ).toBe(2);
  });

  it('auto-dismisses after duration elapses', () => {
    vi.useFakeTimers();
    const ref = service.show({ message: 'Ciao', duration: 1000 });
    let dismissed = false;
    ref.afterDismissed$.subscribe(() => (dismissed = true));

    vi.advanceTimersByTime(999);
    expect(dismissed).toBe(false);

    vi.advanceTimersByTime(1);
    expect(dismissed).toBe(true);
  });

  it('duration=0 means manual-only, no auto-dismiss', () => {
    vi.useFakeTimers();
    const ref = service.show({ message: 'Ciao', duration: 0 });
    let dismissed = false;
    ref.afterDismissed$.subscribe(() => (dismissed = true));

    vi.advanceTimersByTime(1_000_000);
    expect(dismissed).toBe(false);

    ref.dismiss();
    expect(dismissed).toBe(true);
  });

  it('treats a negative duration as 0 (fail-soft, no throw) with no auto-dismiss', () => {
    vi.useFakeTimers();
    expect(() => service.show({ message: 'Ciao', duration: -500 })).not.toThrow();

    const ref = service.show({ message: 'Ciao2', duration: -500 });
    let dismissed = false;
    ref.afterDismissed$.subscribe(() => (dismissed = true));

    vi.advanceTimersByTime(1_000_000);
    expect(dismissed).toBe(false);
  });

  it('pauseAutoDismiss/resumeAutoDismiss actually delay the timer', () => {
    vi.useFakeTimers();
    const ref = service.show({ message: 'Ciao', duration: 1000 });
    let dismissed = false;
    ref.afterDismissed$.subscribe(() => (dismissed = true));

    vi.advanceTimersByTime(500);
    ref.pauseAutoDismiss();
    vi.advanceTimersByTime(1000);
    expect(dismissed).toBe(false);

    ref.resumeAutoDismiss();
    vi.advanceTimersByTime(499);
    expect(dismissed).toBe(false);
    vi.advanceTimersByTime(1);
    expect(dismissed).toBe(true);
  });

  it('pauses the auto-dismiss timer on mouseenter and resumes on mouseleave', () => {
    vi.useFakeTimers();
    service.show({ message: 'Hover', duration: 1000 });
    const toastEl = overlayContainer
      .getContainerElement()
      .querySelector('.orbit-toast') as HTMLElement;

    vi.advanceTimersByTime(800);
    toastEl.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(5000);
    expect(overlayContainer.getContainerElement().textContent).toContain('Hover');

    toastEl.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(199);
    expect(overlayContainer.getContainerElement().textContent).toContain('Hover');
    vi.advanceTimersByTime(1);
    expect(overlayContainer.getContainerElement().textContent).not.toContain('Hover');
  });

  it('dismissAll() closes every open toast across all positions', () => {
    service.show({ message: 'A', position: 'top-start', duration: 0 });
    service.show({ message: 'B', position: 'bottom-end', duration: 0 });

    service.dismissAll();

    expect(overlayContainer.getContainerElement().textContent).not.toContain('A');
    expect(overlayContainer.getContainerElement().textContent).not.toContain('B');
  });

  it('destroys the position container once its last toast is dismissed', () => {
    const ref = service.show({ message: 'Solo', position: 'top-center', duration: 0 });

    ref.dismiss();

    expect(
      overlayContainer.getContainerElement().querySelector('.orbit-toast-container--top-center'),
    ).toBeNull();
  });

  it('dismiss() is idempotent: afterDismissed$ emits exactly once even if called twice', () => {
    const ref = service.show({ message: 'Doppio', duration: 0 });
    let emitCount = 0;
    ref.afterDismissed$.subscribe(() => emitCount++);

    ref.dismiss();
    ref.dismiss();

    expect(emitCount).toBe(1);
  });
});
