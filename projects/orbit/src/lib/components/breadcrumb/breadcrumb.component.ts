import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

export interface OrbitBreadcrumbItem {
  id: string;
  label: string;
  /** Absent = current item, rendered as non-clickable text. */
  href?: string;
}

type OrbitBreadcrumbVisibleEntry =
  | { type: 'item'; item: OrbitBreadcrumbItem }
  | { type: 'ellipsis'; hiddenItems: OrbitBreadcrumbItem[] };

/** Above this item count, the middle items collapse behind a single "…" entry. */
const COLLAPSE_THRESHOLD = 4;

@Component({
  selector: 'orbit-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class OrbitBreadcrumbComponent implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);

  items = input.required<OrbitBreadcrumbItem[]>();
  itemSelected = output<OrbitBreadcrumbItem>();

  protected readonly visibleItems = computed(() => this.collapseMiddle(this.items()));
  protected readonly isPopoverOpen = signal(false);
  protected currentHiddenItems: readonly OrbitBreadcrumbItem[] = [];

  @ViewChild('hiddenItemsTemplate') private hiddenItemsTemplate!: TemplateRef<{
    $implicit: readonly OrbitBreadcrumbItem[];
  }>;

  private overlayRef: OverlayRef | null = null;
  private ellipsisTriggerElement: HTMLElement | null = null;

  entryTrackId(entry: OrbitBreadcrumbVisibleEntry): string {
    return entry.type === 'item' ? entry.item.id : 'ellipsis';
  }

  selectItem(item: OrbitBreadcrumbItem, event: Event): void {
    event.preventDefault();
    if (!item.href) return;
    this.itemSelected.emit(item);
  }

  toggleHiddenItemsPopover(
    hiddenItems: readonly OrbitBreadcrumbItem[],
    trigger: HTMLElement,
  ): void {
    if (this.isPopoverOpen()) {
      this.closeHiddenItemsPopover();
      return;
    }
    this.ellipsisTriggerElement = trigger;
    this.currentHiddenItems = hiddenItems;
    this.openHiddenItemsPopover();
  }

  selectHiddenItem(item: OrbitBreadcrumbItem): void {
    this.closeHiddenItemsPopover();
    this.itemSelected.emit(item);
  }

  ngOnDestroy(): void {
    this.closeHiddenItemsPopover();
  }

  private collapseMiddle(items: readonly OrbitBreadcrumbItem[]): OrbitBreadcrumbVisibleEntry[] {
    if (items.length === 0) return [];
    if (items.length <= COLLAPSE_THRESHOLD) {
      return items.map((item) => ({ type: 'item', item }) as const);
    }
    const first = items[0];
    const last = items[items.length - 1];
    const hiddenItems = items.slice(1, items.length - 1);
    return [
      { type: 'item', item: first },
      { type: 'ellipsis', hiddenItems },
      { type: 'item', item: last },
    ];
  }

  private openHiddenItemsPopover(): void {
    if (!this.ellipsisTriggerElement) return;
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.ellipsisTriggerElement)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      panelClass: 'orbit-breadcrumb-popover-panel',
      hasBackdrop: true,
      backdropClass: 'orbit-breadcrumb-popover-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.overlayRef.backdropClick().subscribe(() => this.closeHiddenItemsPopover());
    this.overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') this.closeHiddenItemsPopover();
    });

    this.copyThemeToOverlay();

    const portal = new TemplatePortal(this.hiddenItemsTemplate, this.vcr, {
      $implicit: this.currentHiddenItems,
    });
    this.overlayRef.attach(portal);
    this.isPopoverOpen.set(true);
  }

  /**
   * CDK mounts the popover outside the trigger's DOM subtree. Mirror the nearest
   * Orbit theme scope so the popover receives the same semantic colour tokens.
   */
  private copyThemeToOverlay(): void {
    const themeScope = this.ellipsisTriggerElement?.closest('[data-orbit-theme]');
    const theme = themeScope?.getAttribute('data-orbit-theme');
    if (theme) this.overlayRef?.overlayElement.setAttribute('data-orbit-theme', theme);
  }

  private closeHiddenItemsPopover(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isPopoverOpen.set(false);
  }
}
