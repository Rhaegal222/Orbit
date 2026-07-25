import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  Renderer2,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'orbit-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="orbit-popover__trigger" (click)="toggle()">
      <ng-content></ng-content>
    </span>
  `,
  styleUrl: './popover.component.css',
  exportAs: 'orbitPopover',
})
export class OrbitPopoverComponent implements OnDestroy {
  content = input.required<string>();
  position = input<'top' | 'bottom' | 'left' | 'right'>('bottom');
  closeOnBackdrop = input(true, { transform: booleanAttribute });
  closeOnEscape = input(true, { transform: booleanAttribute });

  opened = output<void>();
  closed = output<void>();

  isOpen = signal(false);

  private overlay = inject(Overlay);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private vcr = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;

  private listeners: (() => void)[] = [];

  constructor() {
    this.listeners.push(
      this.renderer.listen(this.el.nativeElement, 'keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.closeOnEscape()) this.close();
      }),
    );
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen()) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.el)
      .withPositions([
        {
          originX: 'center',
          originY: this.position() === 'top' ? 'top' : 'bottom',
          overlayX: 'center',
          overlayY: this.position() === 'top' ? 'bottom' : 'top',
          offsetY: this.position() === 'top' ? -8 : 8,
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      panelClass: 'orbit-popover-panel',
      hasBackdrop: this.closeOnBackdrop(),
      backdropClass: 'orbit-popover-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const portal = new ComponentPortal(PopoverContentComponent, this.vcr);
    const ref = this.overlayRef.attach(portal);
    ref.instance.text = this.content();
    ref.changeDetectorRef.detectChanges();

    if (this.closeOnBackdrop()) {
      this.overlayRef.backdropClick().subscribe(() => this.close());
    }

    this.isOpen.set(true);
    this.opened.emit();
  }

  close(): void {
    if (!this.isOpen()) return;
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isOpen.set(false);
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.close();
    this.listeners.forEach((fn) => fn());
  }
}

@Component({
  selector: 'orbit-popover-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="orbit-popover__content">{{ text }}</div>`,
  styles: [
    `
      .orbit-popover__content {
        padding: var(--orbit-space-3);
        max-width: 20rem;
        font-family: var(--orbit-font-sans);
        font-size: var(--orbit-font-size-sm);
        color: var(--orbit-color-text);
        line-height: 1.5;
      }
    `,
  ],
})
class PopoverContentComponent {
  text = '';
}
