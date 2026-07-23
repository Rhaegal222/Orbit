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
 * Redirects every CDK overlay (panels, dialogs, selects, popovers, date-pickers, tooltips…)
 * into the Lab's mobile-preview mockup instead of `document.body`, whenever one is registered.
 * `.lab-shell__phone-screen` establishes a `contain: layout` box, which — per the CSS
 * Containment spec — makes it a containing block for `position: fixed` descendants too, so the
 * relocated `.cdk-overlay-container` (itself `position: fixed; inset: 0`) stays confined to the
 * phone bezel instead of covering the real browser viewport.
 */
@Injectable({ providedIn: 'root' })
export class LabScopedOverlayContainer extends OverlayContainer {
  private readonly mobileHost = inject(LabMobilePreviewOverlayHost);
  private readonly document = inject(DOCUMENT);
  private mockupContainerElement: HTMLElement | null = null;

  override getContainerElement(): HTMLElement {
    const host = this.mobileHost.element();
    if (!host) {
      return super.getContainerElement();
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
      this.mockupContainerElement.classList.add('cdk-overlay-container', 'cdk-overlay-container--lab-mockup');
      host.appendChild(this.mockupContainerElement);
    }

    // Measured directly (rather than left to `85cqw`/`100cqw` in styles.css) so the very first
    // paint of a newly-opened overlay already has the right clamp: a query container needs a
    // completed layout pass before container query units resolve, and on the first frame that
    // can lag a tick behind, showing a brief "too wide, then snaps to size" flash.
    const width = host.getBoundingClientRect().width;
    const spaceUnit = parseFloat(getComputedStyle(host).getPropertyValue('--orbit-space-3')) || 0;
    this.mockupContainerElement.style.setProperty('--orbit-mockup-panel-max-width', `${width * 0.85}px`);
    this.mockupContainerElement.style.setProperty(
      '--orbit-mockup-dialog-max-width',
      `${width - 2 * spaceUnit}px`,
    );
    return this.mockupContainerElement;
  }
}
