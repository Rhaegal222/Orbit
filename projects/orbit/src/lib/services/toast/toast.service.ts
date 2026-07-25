import { ComponentRef, Injectable, InjectionToken, Injector, inject } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OrbitToastComponent } from '../../components/toast/toast.component';
import { OrbitToastContainerComponent } from './toast-container.component';
import { OrbitToastRef } from './toast-ref';

export type OrbitToastTone = 'success' | 'danger' | 'warning' | 'info';

export type OrbitToastPosition =
  'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

export interface OrbitToastConfig {
  message: string;
  tone?: OrbitToastTone;
  position?: OrbitToastPosition;
  duration?: number;
  dismissible?: boolean;
}

export interface OrbitToastData {
  message: string;
  tone: OrbitToastTone;
  dismissible: boolean;
}

export const ORBIT_TOAST_DATA = new InjectionToken<OrbitToastData>('ORBIT_TOAST_DATA');
export const ORBIT_TOAST_REF = new InjectionToken<OrbitToastRef>('ORBIT_TOAST_REF');

const DEFAULT_DURATION = 5000;

interface ToastContainer {
  overlayRef: OverlayRef;
  containerComponent: OrbitToastContainerComponent;
  refs: OrbitToastRef[];
}

@Injectable({ providedIn: 'root' })
export class OrbitToastService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private containers = new Map<OrbitToastPosition, ToastContainer>();

  show(config: OrbitToastConfig): OrbitToastRef {
    const position = config.position ?? 'bottom-end';
    const tone = config.tone ?? 'info';
    const dismissible = config.dismissible ?? true;
    const rawDuration = config.duration ?? DEFAULT_DURATION;
    const duration = rawDuration < 0 ? 0 : rawDuration;

    const container = this.getOrCreateContainer(position);
    const outlet = container.containerComponent.outlet();

    let componentRef: ComponentRef<OrbitToastComponent> | undefined;

    const ref: OrbitToastRef = new OrbitToastRef(
      {
        detach: () => {
          if (!componentRef) return;
          const idx = outlet.indexOf(componentRef.hostView);
          if (idx > -1) outlet.remove(idx);
        },
      },
      duration,
      () => this.removeRef(position, ref),
    );

    const toastInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: ORBIT_TOAST_DATA, useValue: { message: config.message, tone, dismissible } },
        { provide: ORBIT_TOAST_REF, useValue: ref },
      ],
    });

    const isTop = position.startsWith('top');
    componentRef = isTop
      ? outlet.createComponent(OrbitToastComponent, { injector: toastInjector })
      : outlet.createComponent(OrbitToastComponent, { injector: toastInjector, index: 0 });
    componentRef.changeDetectorRef.detectChanges();

    if (isTop) container.refs.push(ref);
    else container.refs.unshift(ref);

    return ref;
  }

  dismissAll(): void {
    for (const container of this.containers.values()) {
      [...container.refs].forEach((ref) => ref.dismiss());
    }
  }

  private getOrCreateContainer(position: OrbitToastPosition): ToastContainer {
    const existing = this.containers.get(position);
    if (existing) return existing;

    const positionStrategy = this.overlay.position().global();
    if (position.startsWith('top')) positionStrategy.top('16px');
    else positionStrategy.bottom('16px');
    if (position.endsWith('start')) positionStrategy.left('16px');
    else if (position.endsWith('end')) positionStrategy.right('16px');
    else positionStrategy.centerHorizontally();

    const overlayConfig: OverlayConfig = {
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      panelClass: ['orbit-toast-container', `orbit-toast-container--${position}`],
    };

    const overlayRef = this.overlay.create(overlayConfig);
    const portal = new ComponentPortal(OrbitToastContainerComponent, null, this.injector);
    const containerComponentRef = overlayRef.attach(portal);
    containerComponentRef.changeDetectorRef.detectChanges();

    const container: ToastContainer = {
      overlayRef,
      containerComponent: containerComponentRef.instance,
      refs: [],
    };
    this.containers.set(position, container);
    return container;
  }

  private removeRef(position: OrbitToastPosition, ref: OrbitToastRef): void {
    const container = this.containers.get(position);
    if (!container) return;
    const idx = container.refs.indexOf(ref);
    if (idx > -1) container.refs.splice(idx, 1);
    if (container.refs.length === 0) {
      container.overlayRef.dispose();
      this.containers.delete(position);
    }
  }
}
