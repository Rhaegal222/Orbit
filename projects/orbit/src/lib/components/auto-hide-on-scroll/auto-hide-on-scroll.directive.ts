import { DOCUMENT } from '@angular/common';
import {
  Directive,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';

/** Must match `--orbit-breakpoint-md` (48rem / 768px) — a native `@media` query cannot read a
 * CSS custom property, so this literal is the documented source of truth for that token. */
const HIDE_BREAKPOINT_QUERY = '(max-width: 48rem)';

/** Downward scroll distance, in pixels, that must accumulate before the host hides. Upward
 * movement of any size shows it again immediately — see the class doc comment below. */
const HIDE_THRESHOLD_PX = 8;

/**
 * @experimental Promotion to stable requires a live-browser verification pass (animation
 * smoothness, touch-target feel, a real breakpoint resize) and a second real consumer beyond
 * `LabGoogleFontsDialogComponent`, per the component lifecycle in
 * `docs/PATTERNS-AND-GOVERNANCE.md`. The directive's own logic is fully unit-tested; only that
 * live pass and a second consumer are outstanding.
 */
@Directive({
  selector: '[orbitAutoHideOnScroll]',
  host: {
    '[style.transform]': 'hidden() ? "translateY(-100%)" : "translateY(0)"',
    '[style.opacity]': 'hidden() ? "0" : "1"',
    '[style.transition]': 'transitionValue()',
    '[style.pointer-events]': 'hidden() ? "none" : null',
    '[attr.aria-hidden]': 'hidden() ? "true" : null',
    '[attr.inert]': 'hidden() ? "" : null',
  },
})
export class OrbitAutoHideOnScrollDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly hidden = signal(false);
  protected readonly transitionValue = computed(() => {
    const easing = this.hidden() ? '--orbit-easing-accelerate' : '--orbit-easing-standard';
    return `transform var(--orbit-motion-base) var(${easing}), opacity var(--orbit-motion-base) var(${easing})`;
  });

  private scrollContainer: HTMLElement | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private lastScrollTop = 0;
  private downwardRun = 0;
  private rafPending = false;

  private readonly onMediaChange = (event: MediaQueryListEvent): void => {
    if (event.matches) {
      this.attachScrollListener();
    } else {
      this.detachScrollListener();
      this.hidden.set(false);
    }
  };

  private readonly onScroll = (): void => {
    if (this.rafPending) return;
    this.rafPending = true;
    requestAnimationFrame(() => {
      this.rafPending = false;
      this.evaluateScroll();
    });
  };

  constructor() {
    afterNextRender(() => this.setup());
    this.destroyRef.onDestroy(() => this.teardown());
  }

  private setup(): void {
    this.scrollContainer = this.findScrollContainer(this.elementRef.nativeElement);
    if (!this.scrollContainer) return;

    this.mediaQuery = this.document.defaultView?.matchMedia(HIDE_BREAKPOINT_QUERY) ?? null;
    if (!this.mediaQuery) return;

    this.mediaQuery.addEventListener('change', this.onMediaChange);
    if (this.mediaQuery.matches) {
      this.attachScrollListener();
    }
  }

  private teardown(): void {
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
    this.detachScrollListener();
  }

  private attachScrollListener(): void {
    if (!this.scrollContainer) return;
    this.lastScrollTop = this.scrollContainer.scrollTop;
    this.downwardRun = 0;
    this.scrollContainer.addEventListener('scroll', this.onScroll, { passive: true });
  }

  private detachScrollListener(): void {
    this.scrollContainer?.removeEventListener('scroll', this.onScroll);
  }

  private evaluateScroll(): void {
    const container = this.scrollContainer;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const delta = scrollTop - this.lastScrollTop;
    this.lastScrollTop = scrollTop;

    if (scrollTop <= 0) {
      this.hidden.set(false);
      this.downwardRun = 0;
      return;
    }

    if (delta < 0) {
      this.hidden.set(false);
      this.downwardRun = 0;
      return;
    }

    if (delta > 0) {
      this.downwardRun += delta;
      if (this.downwardRun > HIDE_THRESHOLD_PX) {
        this.hidden.set(true);
      }
    }
  }

  private findScrollContainer(from: HTMLElement): HTMLElement | null {
    const view = this.document.defaultView;
    let node: HTMLElement | null = from.parentElement;
    while (node) {
      const overflowY = view?.getComputedStyle(node).overflowY;
      if (
        (overflowY === 'auto' || overflowY === 'scroll') &&
        node.scrollHeight > node.clientHeight
      ) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }
}
