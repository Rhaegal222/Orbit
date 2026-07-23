import { Injectable, inject, InjectionToken, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ESCAPE } from '@angular/cdk/keycodes';
import { filter, take } from 'rxjs';

export interface OrbitDialogConfig<T = unknown> {
  data?: T;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide';
  disableClose?: boolean;
  panelClass?: string;
}

export const ORBIT_DIALOG_DATA = new InjectionToken<unknown>('ORBIT_DIALOG_DATA');

const SIZE_MAP: Record<string, string> = {
  sm: '400px',
  md: '560px',
  lg: '720px',
  xl: '900px',
  wide: '1100px',
};

@Injectable({ providedIn: 'root' })
export class OrbitDialogService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private openDialogs: OverlayRef[] = [];

  open<T>(component: ComponentType<T>, config: OrbitDialogConfig = {}): OrbitDialogRef<T> {
    const size = config.size ?? 'md';
    const panelClasses = ['orbit-dialog-panel', `orbit-dialog--${size}`];
    if (config.panelClass) panelClasses.push(config.panelClass);

    const overlayConfig: OverlayConfig = {
      hasBackdrop: true,
      backdropClass: 'orbit-dialog-backdrop',
      panelClass: panelClasses,
      width: SIZE_MAP[size],
      maxHeight: '90vh',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    };

    const overlayRef = this.overlay.create(overlayConfig);

    const portal = new ComponentPortal(
      component,
      null,
      Injector.create({
        parent: this.injector,
        providers: [{ provide: ORBIT_DIALOG_DATA, useValue: config.data }],
      }),
    );
    const componentRef = overlayRef.attach(portal);
    componentRef.changeDetectorRef.detectChanges();

    this.openDialogs.push(overlayRef);
    this.playEnterAnimation(overlayRef);

    if (!config.disableClose) {
      overlayRef.backdropClick().pipe(take(1)).subscribe(() => this.close(overlayRef));
      overlayRef.keydownEvents()
        .pipe(filter((e) => e.keyCode === ESCAPE), take(1))
        .subscribe(() => this.close(overlayRef));
    }

    return {
      close: () => this.close(overlayRef),
      overlayRef,
      componentInstance: componentRef.instance,
    };
  }

  closeAll(): void {
    [...this.openDialogs].forEach((ref) => this.close(ref));
  }

  private close(ref: OverlayRef): void {
    const idx = this.openDialogs.indexOf(ref);
    if (idx > -1) this.openDialogs.splice(idx, 1);
    ref.detach();
    ref.dispose();
  }

  /**
   * Enter animation lives only on this transient class, never on the steady-state
   * `.orbit-dialog-panel`/`.orbit-dialog-backdrop` classes: toggling `data-orbit-motion` off→on
   * later, while the dialog just sits open, would otherwise restart the animation (removing the
   * `animation: none !important` override makes any element still matching a plain `animation:
   * <name>` declaration replay it from scratch), making an open dialog look like it closed and
   * reopened. Removed again once the animation finishes, so there is nothing left to restart.
   */
  private playEnterAnimation(ref: OverlayRef): void {
    const paneEl = ref.overlayElement;
    const backdropEl = ref.backdropElement;
    paneEl.classList.add('orbit-dialog-panel--entering');
    backdropEl?.classList.add('orbit-dialog-backdrop--entering');

    const duration = this.getAnimationDuration(paneEl);
    const finish = () => {
      paneEl.classList.remove('orbit-dialog-panel--entering');
      backdropEl?.classList.remove('orbit-dialog-backdrop--entering');
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

export interface OrbitDialogRef<T = unknown> {
  close: () => void;
  overlayRef: OverlayRef;
  componentInstance: T;
}
