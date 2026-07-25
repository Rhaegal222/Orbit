import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

/**
 * Holds the current mobile-preview mockup host (LabShellComponent's `.lab-shell__phone-screen`),
 * or null when the Lab isn't simulating a mobile viewport. LabScopedOverlayContainer reads this
 * to decide where CDK overlays attach — every Orbit page/component that opens a panel, dialog,
 * select, popover, date-picker, or tooltip goes through this same registry with no per-feature
 * wiring, instead of each one needing its own embedded-mockup duplicate.
 */
@Injectable({ providedIn: 'root' })
export class LabMobilePreviewOverlayHost {
  readonly element = signal<HTMLElement | null>(null);
}

/**
 * Redirects most CDK overlays (panels, dialogs, selects, popovers, date-pickers, tooltips…)
 * into the Lab's mobile-preview mockup instead of `document.body`, whenever one is registered.
 * `.lab-shell__phone-screen` establishes a `contain: layout` box, which — per the CSS
 * Containment spec — makes it a containing block for `position: fixed` descendants too, so the
 * relocated `.cdk-overlay-container` (itself `position: fixed; inset: 0`) stays confined to the
 * phone bezel instead of covering the real browser viewport.
 *
 * A real chrome control around the mockup (the frame-size select, the touch-mode tile) has
 * nothing to do with the previewed app and must stay a normal, full-viewport overlay instead of
 * being clipped by the phone bezel's `overflow: hidden` — marking its container
 * `[data-lab-overlay-exempt]` opts it out. `document.activeElement` at the moment the overlay is
 * created is the trigger that just opened it (native focus-on-click), so this is decided per
 * open, not per component: the same `orbit-select` still redirects normally when it's one of the
 * previewed app's own controls inside the mockup.
 */
@Injectable({ providedIn: 'root' })
export class LabScopedOverlayContainer extends OverlayContainer {
  private readonly mobileHost = inject(LabMobilePreviewOverlayHost);
  private readonly document = inject(DOCUMENT);
  private mockupContainerElement: HTMLElement | null = null;
  private panePositionObserver: MutationObserver | null = null;

  override getContainerElement(): HTMLElement {
    const host = this.mobileHost.element();
    if (!host) {
      return super.getContainerElement();
    }

    const trigger = this.document.activeElement;
    if (trigger instanceof HTMLElement && trigger.closest('[data-lab-overlay-exempt]')) {
      // The touch-mode simulation overlay (`.lab-shell__phone-touch-overlay`, z-index 1300) is
      // itself sized and positioned to the phone bezel, but an exempt trigger living just above
      // it (the frame-size select in the toolbar) opens a menu that drops *down*, past the
      // bezel's top edge and into the touch overlay's own covered area — without its own z-index
      // bump the exempt pane would render there but still sit under the touch overlay, unusable
      // and cursor-less for that whole overlap region.
      const container = super.getContainerElement();
      container.classList.add('cdk-overlay-container--lab-exempt');
      return container;
    }

    if (!this.mockupContainerElement || !host.contains(this.mockupContainerElement)) {
      this.mockupContainerElement = this.document.createElement('div');
      // Marks overlays here to skip their transform-based slide/scale entrance (see the
      // `--lab-mockup` rules in styles.css): this container's `position: fixed` resolves
      // against .lab-shell__phone-screen's own `transform`-established containing block, and a
      // *second*, animated transform on the pane itself (its own enter/exit slide) on top of
      // that combination is a known class of browser compositing quirk — the clip/paint can
      // visibly overshoot mid-animation before settling once the animation ends. A plain fade
      // has no transform to conflict with, so it doesn't trigger it.
      this.mockupContainerElement.classList.add(
        'cdk-overlay-container',
        'cdk-overlay-container--lab-mockup',
      );
      host.appendChild(this.mockupContainerElement);
      this.observePanePositioning(this.mockupContainerElement, host);
    }

    // Measured directly (rather than left to `85cqw`/`100cqw` in styles.css) so the very first
    // paint of a newly-opened overlay already has the right clamp: a query container needs a
    // completed layout pass before container query units resolve, and on the first frame that
    // can lag a tick behind, showing a brief "too wide, then snaps to size" flash.
    const width = host.getBoundingClientRect().width;
    const spaceUnit = parseFloat(getComputedStyle(host).getPropertyValue('--orbit-space-3')) || 0;
    this.mockupContainerElement.style.setProperty(
      '--orbit-mockup-panel-max-width',
      `${width * 0.85}px`,
    );
    this.mockupContainerElement.style.setProperty(
      '--orbit-mockup-dialog-max-width',
      `${width - 2 * spaceUnit}px`,
    );
    return this.mockupContainerElement;
  }

  /**
   * `FlexibleConnectedPositionStrategy` (select, autocomplete, date/time picker, popover,
   * tooltip) writes `top`/`left` on `.cdk-overlay-pane` as real-viewport-absolute pixels,
   * computed from the trigger's real `getBoundingClientRect()` — it assumes its container sits
   * at real screen (0, 0), which is true for the default `document.body`-attached container but
   * not here: this container's `position: fixed` resolves against `host`'s own containing block,
   * so its local (0, 0) is actually `host`'s on-screen position. Left uncorrected, every
   * connected overlay renders offset by that amount (further right/down than the trigger it's
   * meant to hang off). The global position strategy (dialog/panel centering) isn't affected —
   * it centers via flex layout, not `getBoundingClientRect()` math, so it has no `top`/`left` to
   * correct here.
   */
  private observePanePositioning(container: HTMLElement, host: HTMLElement): void {
    this.panePositionObserver?.disconnect();

    // Keyed by pane, the `style` attribute text this correction last wrote — lets the callback
    // tell "CDK just wrote a new raw position" apart from "this mutation is our own previous
    // write echoing back through the observer", without disconnecting/reconnecting (which races
    // against reposition bursts that land more than one record per callback: the whole batch is
    // still processed against a single `getBoundingClientRect()` read, so re-entrant corrections
    // within a batch amplify the offset instead of converging on it).
    const lastWritten = new WeakMap<HTMLElement, string>();

    const observer = new MutationObserver((mutations) => {
      const hostRect = host.getBoundingClientRect();
      for (const mutation of mutations) {
        const pane = mutation.target as HTMLElement;
        if (!(pane instanceof HTMLElement) || !pane.classList.contains('cdk-overlay-pane')) {
          continue;
        }
        const currentStyle = pane.getAttribute('style') ?? '';
        if (lastWritten.get(pane) === currentStyle) {
          continue;
        }
        const left = parseFloat(pane.style.left);
        const top = parseFloat(pane.style.top);
        if (Number.isNaN(left) && Number.isNaN(top)) {
          continue;
        }
        if (!Number.isNaN(left)) {
          pane.style.left = `${left - hostRect.left}px`;
        }
        if (!Number.isNaN(top)) {
          pane.style.top = `${top - hostRect.top}px`;
        }
        lastWritten.set(pane, pane.getAttribute('style') ?? '');
      }
    });

    observer.observe(container, { subtree: true, attributes: true, attributeFilter: ['style'] });
    this.panePositionObserver = observer;
  }
}
