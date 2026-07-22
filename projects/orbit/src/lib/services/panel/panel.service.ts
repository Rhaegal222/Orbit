import { Injectable, inject, InjectionToken, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ESCAPE } from '@angular/cdk/keycodes';
import { filter, take } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

export interface OrbitPanelConfig<T = unknown> {
  data?: T;
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide';
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
  private overlayContainer = inject(OverlayContainer);
  private injector = inject(Injector);
  private openPanels: OverlayRef[] = [];

  open<T>(component: ComponentType<T>, config: OrbitPanelConfig = {}): OrbitPanelRef<T> {
    const size = config.size ?? 'md';
    const side = config.side ?? 'right';
    const panelClasses = ['orbit-panel-pane', `orbit-panel--${side}`];
    if (config.panelClass) panelClasses.push(config.panelClass);

    const positionStrategy = this.overlay.position().global().top('0');
    if (side === 'left') positionStrategy.left('0');
    else positionStrategy.right('0');

    const overlayConfig: OverlayConfig = {
      hasBackdrop: true,
      backdropClass: 'orbit-panel-backdrop',
      panelClass: panelClasses,
      width: SIZE_MAP[size],
      height: '100vh',
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

    // Apply justifyContent to the wrapper for proper alignment
    // Query for all wrappers and apply to the last one (most recently created)
    const wrappers = this.overlayContainer
      .getContainerElement()
      .querySelectorAll('.cdk-global-overlay-wrapper');
    if (wrappers.length > 0) {
      const wrapper = wrappers[wrappers.length - 1] as HTMLElement;
      wrapper.style.justifyContent = side === 'left' ? 'flex-start' : 'flex-end';
    }

    this.openPanels.push(overlayRef);

    if (!config.disableClose) {
      overlayRef.backdropClick().pipe(take(1)).subscribe(() => this.close(overlayRef));
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
    ref.detach();
    ref.dispose();
  }
}

export interface OrbitPanelRef<T = unknown> {
  close: () => void;
  overlayRef: OverlayRef;
  componentInstance: T;
}
