import { Injectable, inject, InjectionToken, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ESCAPE } from '@angular/cdk/keycodes';
import { filter, take } from 'rxjs';

export interface OrbitPanelConfig<T = unknown> {
  data?: T;
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide';
  /** Overrides `size`: the panel spans the full viewport width. */
  fullWidth?: boolean;
  /** Lower bound the panel may shrink to (e.g. on narrow viewports), as a CSS length. */
  minWidth?: string;
  /** Upper bound the panel may grow to, as a CSS length. Ignored when `fullWidth` is true. */
  maxWidth?: string;
  disableClose?: boolean;
  panelClass?: string;
}

export const ORBIT_PANEL_DATA = new InjectionToken<unknown>('ORBIT_PANEL_DATA');

const SIZE_MAP: Record<string, string> = {
  sm: '320px',
  md: '440px',
  lg: '600px',
  xl: '760px',
  wide: '960px',
};

@Injectable({ providedIn: 'root' })
export class OrbitPanelService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private openPanels: OverlayRef[] = [];

  open<T>(component: ComponentType<T>, config: OrbitPanelConfig = {}): OrbitPanelRef<T> {
    const size = config.size ?? 'md';
    const side = config.side ?? 'right';
    const panelClasses = ['orbit-panel-pane', `orbit-panel--${side}`];
    if (config.fullWidth) panelClasses.push('orbit-panel-pane--full-width');
    if (config.panelClass) panelClasses.push(config.panelClass);

    const positionStrategy = this.overlay.position().global().top('0');
    if (side === 'left') positionStrategy.left('0');
    else positionStrategy.right('0');

    const overlayConfig: OverlayConfig = {
      hasBackdrop: true,
      backdropClass: 'orbit-panel-backdrop',
      panelClass: panelClasses,
      width: config.fullWidth ? '100vw' : SIZE_MAP[size],
      height: '100vh',
      minWidth: config.minWidth,
      maxWidth: config.fullWidth ? undefined : config.maxWidth,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
    };

    const overlayRef = this.overlay.create(overlayConfig);

    const portal = new ComponentPortal(
      component,
      null,
      Injector.create({
        parent: this.injector,
        providers: [{ provide: ORBIT_PANEL_DATA, useValue: config.data }],
      }),
    );
    const componentRef = overlayRef.attach(portal);
    componentRef.changeDetectorRef.detectChanges();

    this.openPanels.push(overlayRef);
    this.playEnterAnimation(overlayRef);

    if (!config.disableClose) {
      overlayRef
        .backdropClick()
        .pipe(take(1))
        .subscribe(() => this.close(overlayRef));
      overlayRef
        .keydownEvents()
        .pipe(
          filter((e) => e.keyCode === ESCAPE),
          take(1),
        )
        .subscribe(() => this.close(overlayRef));
    }

    return {
      close: () => this.close(overlayRef),
      overlayRef,
      componentInstance: componentRef.instance,
    };
  }

  closeAll(): void {
    [...this.openPanels].forEach((ref) => this.close(ref));
  }

  private close(ref: OverlayRef): void {
    const idx = this.openPanels.indexOf(ref);
    if (idx > -1) this.openPanels.splice(idx, 1);

    const paneEl = ref.overlayElement;
    const backdropEl = ref.backdropElement;
    paneEl.classList.add('orbit-panel-pane--closing');
    backdropEl?.classList.add('orbit-panel-backdrop--closing');

    const duration = this.getAnimationDuration(paneEl);
    if (duration <= 0) {
      ref.detach();
      ref.dispose();
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      ref.detach();
      ref.dispose();
    };
    paneEl.addEventListener('animationend', finish, { once: true });
    setTimeout(finish, duration + 50);
  }

  /**
   * Enter animation lives only on this transient class, never on the steady-state
   * `.orbit-panel-pane`/`.orbit-panel-backdrop` classes: toggling `data-orbit-motion` off→on
   * later, while the panel just sits open, would otherwise restart the animation (removing the
   * `animation: none !important` override makes any element still matching a plain `animation:
   * <name>` declaration replay it from scratch), making an open panel look like it closed and
   * reopened. Removed again once the animation finishes, so there is nothing left to restart.
   */
  private playEnterAnimation(ref: OverlayRef): void {
    const paneEl = ref.overlayElement;
    const backdropEl = ref.backdropElement;
    paneEl.classList.add('orbit-panel-pane--entering');
    backdropEl?.classList.add('orbit-panel-backdrop--entering');

    const duration = this.getAnimationDuration(paneEl);
    const finish = () => {
      paneEl.classList.remove('orbit-panel-pane--entering');
      backdropEl?.classList.remove('orbit-panel-backdrop--entering');
    };
    if (duration <= 0) {
      finish();
      return;
    }

    let finished = false;
    const onAnimationEnd = () => {
      if (finished) return;
      finished = true;
      finish();
    };
    paneEl.addEventListener('animationend', onAnimationEnd, { once: true });
    setTimeout(onAnimationEnd, duration + 50);
  }

  /** Longest `animation-duration` currently applied to the element, in milliseconds. */
  private getAnimationDuration(el: HTMLElement): number {
    return getComputedStyle(el)
      .animationDuration.split(',')
      .reduce((longest, value) => {
        const trimmed = value.trim();
        const ms = trimmed.endsWith('ms') ? parseFloat(trimmed) : parseFloat(trimmed) * 1000;
        return Number.isFinite(ms) ? Math.max(longest, ms) : longest;
      }, 0);
  }
}

export interface OrbitPanelRef<T = unknown> {
  close: () => void;
  overlayRef: OverlayRef;
  componentInstance: T;
}
