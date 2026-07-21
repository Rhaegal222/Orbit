import { Directive, ElementRef, inject, input, OnDestroy, Renderer2 } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject, takeUntil } from 'rxjs';
import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[orbitTooltip]',
  exportAs: 'orbitTooltip',
  host: {
    '[attr.aria-describedby]': 'tooltipId',
  },
})
export class OrbitTooltipDirective implements OnDestroy {
  orbitTooltip = input.required<string>({ alias: 'orbitTooltip' });
  orbitTooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('top');
  orbitTooltipDelay = input(0);

  private overlay = inject(Overlay);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private destroy$ = new Subject<void>();

  private overlayRef: OverlayRef | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  tooltipId = `orbit-tooltip-${Math.random().toString(36).slice(2, 8)}`;

  constructor() {
    this.renderer.listen(this.el.nativeElement, 'mouseenter', () => this.show());
    this.renderer.listen(this.el.nativeElement, 'mouseleave', () => this.scheduleHide());
    this.renderer.listen(this.el.nativeElement, 'focus', () => this.show());
    this.renderer.listen(this.el.nativeElement, 'blur', () => this.scheduleHide());
  }

  show(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.overlayRef) return;

    const delay = this.orbitTooltipDelay();
    this.showTimeout = setTimeout(() => this.attach(), delay);
  }

  hide(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    this.detach();
  }

  scheduleHide(): void {
    this.hideTimeout = setTimeout(() => this.hide(), 100);
  }

  ngOnDestroy(): void {
    this.hide();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private attach(): void {
    if (this.overlayRef) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.el)
      .withPositions([
        {
          originX: 'center',
          originY: this.orbitTooltipPosition() === 'bottom' ? 'bottom' : 'top',
          overlayX: 'center',
          overlayY: this.orbitTooltipPosition() === 'bottom' ? 'top' : 'bottom',
          offsetY: this.orbitTooltipPosition() === 'bottom' ? 8 : -8,
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      panelClass: 'orbit-tooltip-panel',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const portal = new ComponentPortal(TooltipComponent);
    const ref = this.overlayRef.attach(portal);
    ref.instance.text = this.orbitTooltip();
    ref.instance.id = this.tooltipId;
    ref.changeDetectorRef.detectChanges();
  }

  private detach(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
