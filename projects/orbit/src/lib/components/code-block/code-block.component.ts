import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OrbitClipboardService } from '../../services/clipboard';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { OrbitIconComponent } from '../../icons/icon.component';

let codeBlockSequence = 0;

@Component({
  selector: 'orbit-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconButtonComponent, OrbitIconComponent],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.css',
})
export class OrbitCodeBlockComponent {
  code = input.required<string>();
  collapsible = input(true, { transform: booleanAttribute });
  initiallyCollapsed = input(true, { transform: booleanAttribute });
  showActions = input(true, { transform: booleanAttribute });

  private readonly clipboard = inject(OrbitClipboardService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly codeSurface = viewChild<ElementRef<HTMLElement>>('codeSurface');
  private dragStartedInsideSurface = false;

  protected readonly collapsed = linkedSignal(() => this.collapsible() && this.initiallyCollapsed());
  protected readonly copyLabel = signal('Copia');
  /** Transient success confirmation shown over the code surface after a successful copy. */
  protected readonly showCopiedFeedback = signal(false);
  protected readonly panelId = `orbit-code-block-${++codeBlockSequence}`;
  protected readonly lines = computed(() => this.code().split('\n'));

  constructor() {
    afterNextRender(() => this.setupSelectionContainment());
  }

  toggle(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }

  async copy(): Promise<void> {
    const copied = await this.clipboard.copyText(this.code());
    this.copyLabel.set(copied ? 'Copiato' : 'Copia non riuscita');
    this.showCopiedFeedback.set(copied);
    setTimeout(() => {
      this.copyLabel.set('Copia');
      this.showCopiedFeedback.set(false);
    }, 1500);
  }

  /**
   * Native text selection is not clipped by `overflow: hidden`: dragging past the
   * surface's edge lets the browser extend the range into the next page content.
   * Clamp the range back to the surface whenever a drag that started inside it
   * would otherwise escape.
   */
  private setupSelectionContainment(): void {
    const doc = this.document;

    const onMouseDown = (event: MouseEvent): void => {
      const surface = this.codeSurface()?.nativeElement;
      this.dragStartedInsideSurface = !!surface && event.target instanceof Node && surface.contains(event.target);
    };
    const onSelectionChange = (): void => {
      if (this.dragStartedInsideSurface) {
        this.clampSelectionToSurface();
      }
    };
    const onMouseUp = (): void => {
      this.dragStartedInsideSurface = false;
    };

    doc.addEventListener('mousedown', onMouseDown);
    doc.addEventListener('selectionchange', onSelectionChange);
    doc.addEventListener('mouseup', onMouseUp);

    this.destroyRef.onDestroy(() => {
      doc.removeEventListener('mousedown', onMouseDown);
      doc.removeEventListener('selectionchange', onSelectionChange);
      doc.removeEventListener('mouseup', onMouseUp);
    });
  }

  private clampSelectionToSurface(): void {
    const surface = this.codeSurface()?.nativeElement;
    const selection = this.document.getSelection();
    if (!surface || !selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const startInside = surface.contains(range.startContainer);
    const endInside = surface.contains(range.endContainer);
    if (startInside && endInside) {
      return;
    }

    const bounds = this.document.createRange();
    bounds.selectNodeContents(surface);
    const clamped = range.cloneRange();

    if (!startInside) {
      const precedesSurface =
        (surface.compareDocumentPosition(range.startContainer) & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
      if (precedesSurface) {
        clamped.setStart(bounds.startContainer, bounds.startOffset);
      } else {
        clamped.setStart(bounds.endContainer, bounds.endOffset);
      }
    }
    if (!endInside) {
      const followsSurface =
        (surface.compareDocumentPosition(range.endContainer) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      if (followsSurface) {
        clamped.setEnd(bounds.endContainer, bounds.endOffset);
      } else {
        clamped.setEnd(bounds.startContainer, bounds.startOffset);
      }
    }

    selection.removeAllRanges();
    selection.addRange(clamped);
  }
}
