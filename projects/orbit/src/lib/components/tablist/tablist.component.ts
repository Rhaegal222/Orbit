import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChildren,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { OrbitTabComponent } from '../tab/tab.component';
import { OrbitBadgeComponent, OrbitBadgeTone } from '../badge/badge.component';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { OrbitModalBodyComponent } from '../modal-body/modal-body.component';
import { OrbitModalComponent } from '../modal/modal.component';
import { OrbitModalHeaderComponent } from '../modal-header/modal-header.component';
import { OrbitPanelSurfaceComponent } from '../panel-surface/panel-surface.component';
import {
  OrbitSidebarComponent,
  type OrbitSidebarItem,
  type OrbitSidebarSection,
} from '../sidebar/sidebar.component';
import { OrbitDialogService, ORBIT_DIALOG_DATA } from '../../services/dialog/dialog.service';
import { OrbitPanelService, ORBIT_PANEL_DATA } from '../../services/panel/panel.service';

interface TabPickerData {
  tabs: Array<{
    value: string;
    label: string;
    selected: boolean;
    badge?: { label: string; tone: OrbitBadgeTone };
  }>;
  selected: string;
  onSelect: (value: string) => void;
}

/** Internal offcanvas sidebar content opened by OrbitTablistComponent when in overflow +
 * offcanvas mode. Not part of the public API of orbit. */
@Component({
  selector: 'orbit-tablist-picker-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitPanelSurfaceComponent, OrbitSidebarComponent],
  template: `<orbit-panel-surface ariaLabel="Seleziona scheda">
    <orbit-sidebar
      embedded
      [collapsible]="false"
      brand="Schede"
      [sections]="sections"
      [activeId]="data.selected"
      (itemSelected)="select($event)"
      (closed)="close()"
    />
  </orbit-panel-surface>`,
})
export class OrbitTablistPickerSidebarComponent {
  private readonly panel = inject(OrbitPanelService);
  protected readonly data = inject(ORBIT_PANEL_DATA) as TabPickerData;

  protected readonly sections: readonly OrbitSidebarSection[] = [
    {
      id: 'tabs',
      items: this.data.tabs.map((tab) => ({
        id: tab.value,
        label: tab.label,
        badge: tab.badge?.label,
      })),
    },
  ];

  select(item: OrbitSidebarItem): void {
    this.data.onSelect(item.id);
    this.close();
  }

  close(): void {
    this.panel.closeAll();
  }
}

export type OrbitTablistPickerMode = 'modal' | 'offcanvas' | 'scroll';

/** Internal preview-card modal opened by OrbitTablistComponent when in overflow mode.
 * Not part of the public API of orbit. */
@Component({
  selector: 'orbit-tablist-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitModalBodyComponent,
    OrbitModalComponent,
    OrbitModalHeaderComponent,
    OrbitBadgeComponent,
  ],
  template: `
    <orbit-modal labelledBy="orbit-tablist-picker-title" size="md">
      <orbit-modal-header
        titleId="orbit-tablist-picker-title"
        title="Seleziona scheda"
        subtitle="Scegli la sezione da visualizzare."
        (closeClicked)="close()"
      />
      <orbit-modal-body>
        <div class="orbit-tablist-picker__grid">
          @for (tab of data.tabs; track tab.value) {
            <button
              class="orbit-tablist-picker__card"
              [class.orbit-tablist-picker__card--selected]="tab.selected"
              type="button"
              [attr.aria-pressed]="tab.selected"
              (click)="select(tab.value)"
            >
              <div class="orbit-tablist-picker__preview" aria-hidden="true">
                <span class="orbit-tablist-picker__initial">{{ tab.label[0] }}</span>
              </div>
              <div class="orbit-tablist-picker__details">
                <span class="orbit-tablist-picker__label">{{ tab.label }}</span>
                @if (tab.badge) {
                  <orbit-badge [label]="tab.badge.label" [tone]="tab.badge.tone" />
                }
              </div>
            </button>
          }
        </div>
      </orbit-modal-body>
    </orbit-modal>
  `,
  styles: `
    :host {
      display: block;
      width: min(100%, var(--orbit-modal-size-md));
      container-type: inline-size;
      container-name: orbit-tablist-picker;
    }
    .orbit-tablist-picker__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--orbit-space-3);
    }
    /* Below this width the 2-column grid squeezes each card enough that the badge (which
       doesn't shrink or wrap) gets clipped by the card's overflow: hidden — collapse to a
       single column instead of letting content get cut off. */
    @container orbit-tablist-picker (max-width: 28rem) {
      .orbit-tablist-picker__grid {
        grid-template-columns: 1fr;
      }
      .orbit-tablist-picker__card {
        grid-template-rows: 5rem minmax(0, 1fr);
      }
    }
    .orbit-tablist-picker__card {
      display: grid;
      grid-template-rows: 7rem minmax(0, 1fr);
      position: relative;
      overflow: hidden;
      border: 1.5px solid var(--orbit-border-subtle);
      border-radius: var(--orbit-radius-tile);
      background: var(--orbit-surface-raised);
      cursor: pointer;
      text-align: left;
      padding: 0;
      transition:
        border-color var(--orbit-motion-fast) var(--orbit-easing-standard),
        box-shadow var(--orbit-motion-fast) var(--orbit-easing-standard);
    }
    .orbit-tablist-picker__card:hover {
      border-color: var(--orbit-border-strong);
      box-shadow: var(--orbit-shadow-sm);
    }
    .orbit-tablist-picker__card--selected {
      border-color: var(--orbit-action-primary-bg);
      box-shadow: 0 0 0 0.125rem color-mix(in srgb, var(--orbit-action-primary-bg) 25%, transparent);
    }
    .orbit-tablist-picker__card:focus-visible {
      outline: 2px solid var(--orbit-action-primary-bg);
      outline-offset: 0.125rem;
    }
    .orbit-tablist-picker__preview {
      display: grid;
      place-items: center;
      background: var(--orbit-surface-subtle);
    }
    .orbit-tablist-picker__card--selected .orbit-tablist-picker__preview {
      background: color-mix(
        in srgb,
        var(--orbit-action-primary-bg) 10%,
        var(--orbit-surface-subtle)
      );
    }
    .orbit-tablist-picker__initial {
      font-size: calc(var(--orbit-font-size-display) * 1.5);
      font-weight: var(--orbit-font-weight-emphasis);
      line-height: 1;
      color: var(--orbit-text-secondary);
    }
    .orbit-tablist-picker__card--selected .orbit-tablist-picker__initial {
      color: var(--orbit-action-primary-bg);
    }
    .orbit-tablist-picker__details {
      display: flex;
      align-items: center;
      gap: var(--orbit-space-2);
      padding: var(--orbit-space-2) var(--orbit-space-3);
      border-top: 1px solid var(--orbit-border-subtle);
    }
    .orbit-tablist-picker__label {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: var(--orbit-font-size-sm);
      font-weight: var(--orbit-font-weight-emphasis);
      color: var(--orbit-text-primary);
    }
  `,
})
export class OrbitTablistPickerComponent {
  private readonly dialogService = inject(OrbitDialogService);
  protected readonly data = inject(ORBIT_DIALOG_DATA) as TabPickerData;

  select(value: string): void {
    this.data.onSelect(value);
    this.close();
  }

  close(): void {
    this.dialogService.closeAll();
  }
}

@Component({
  selector: 'orbit-tablist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tablist.component.html',
  styleUrl: './tablist.component.css',
  imports: [OrbitBadgeComponent, OrbitIconButtonComponent],
  host: {
    role: 'tablist',
    '[attr.aria-label]': 'ariaLabel() || null',
    '(keydown)': '!(overflowing() && pickerMode() !== "scroll") && onKeydown($event)',
    '(click)': '!(overflowing() && pickerMode() !== "scroll") && onClick($event)',
    '[class.orbit-tablist--overflow]': 'overflowing() && pickerMode() !== "scroll"',
  },
})
export class OrbitTablistComponent implements OnDestroy {
  ariaLabel = input('');
  /** Fixed per instance — the surface opened by the overflow trigger when tabs don't fit. Not
   * runtime-switchable: offcanvas, modal and horizontal scroll are alternative strategies for
   * the same problem, never combined. */
  pickerMode = input<OrbitTablistPickerMode>('modal');
  selectedChange = output<string>();

  private readonly tabs = contentChildren(OrbitTabComponent);
  private readonly tabsWrapper = viewChild('tabsWrapper', { read: ElementRef<HTMLElement> });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogService = inject(OrbitDialogService);
  private readonly panelService = inject(OrbitPanelService);

  protected readonly overflowing = signal(false);

  private observer: ResizeObserver | null = null;

  constructor() {
    afterRenderEffect(() => {
      // Observe once tabs are rendered. Must measure the inner `.orbit-tablist__tabs` wrapper,
      // not the host: the host has `overflow: hidden`, so its own scrollWidth/clientWidth are
      // always equal — the actual horizontal overflow happens one level down, in the wrapper.
      const wrapper = this.tabsWrapper()?.nativeElement;
      if (!wrapper) return;
      this.observer?.disconnect();
      this.observer = new ResizeObserver(() => {
        const isOverflowing = wrapper.scrollWidth > wrapper.clientWidth;
        if (isOverflowing !== this.overflowing()) {
          this.overflowing.set(isOverflowing);
          this.cdr.markForCheck();
        }
      });
      this.observer.observe(wrapper);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  protected get currentTab(): OrbitTabComponent | undefined {
    return this.tabs().find((t) => t.selected());
  }

  protected openPicker(): void {
    const tabs = this.tabs()
      .filter((t) => !t.disabled())
      .map((t) => {
        const badgeComponent = t.badge();
        return {
          value: t.value(),
          label: t.label(),
          selected: t.selected(),
          badge: badgeComponent
            ? { label: badgeComponent.label(), tone: badgeComponent.tone() }
            : undefined,
        };
      });

    const onSelect = (value: string) => this.selectedChange.emit(value);
    const selected = this.currentTab?.value() ?? '';

    if (this.pickerMode() === 'offcanvas') {
      this.panelService.open(OrbitTablistPickerSidebarComponent, {
        side: 'left',
        size: 'sm',
        data: { tabs, selected, onSelect },
      });
    } else {
      this.dialogService.open(OrbitTablistPickerComponent, {
        data: { tabs, selected, onSelect },
      });
    }
  }

  onClick(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest('[role="tab"]') as HTMLElement | null;
    if (!target) return;
    const index = this.tabs().findIndex((tab) => target.id === `orbit-tab-${tab.value()}`);
    if (index === -1) return;
    this.activateIndex(index);
  }

  onKeydown(event: KeyboardEvent): void {
    const components = this.tabs();
    if (!components.length) return;

    const currentIndex = components.findIndex(
      (tab) => document.activeElement?.id === `orbit-tab-${tab.value()}`,
    );

    let nextIndex: number | null = null;
    if (event.key === 'Home') nextIndex = this.firstEnabled(components, 0, 1);
    if (event.key === 'End') nextIndex = this.firstEnabled(components, components.length - 1, -1);
    if (event.key === 'ArrowLeft') nextIndex = this.step(components, currentIndex, -1);
    if (event.key === 'ArrowRight') nextIndex = this.step(components, currentIndex, 1);
    if (nextIndex === null) return;

    event.preventDefault();
    this.activateIndex(nextIndex);
  }

  private activateIndex(index: number): void {
    const component = this.tabs()[index];
    if (!component || component.disabled()) return;
    component.focus();
    this.selectedChange.emit(component.value());
  }

  private step(
    components: readonly OrbitTabComponent[],
    from: number,
    direction: number,
  ): number | null {
    if (!components.length) return null;
    let idx = from;
    for (let i = 0; i < components.length; i++) {
      idx = (idx + direction + components.length) % components.length;
      if (!components[idx].disabled()) return idx;
    }
    return null;
  }

  private firstEnabled(
    components: readonly OrbitTabComponent[],
    start: number,
    direction: number,
  ): number | null {
    let idx = start;
    for (let i = 0; i < components.length; i++) {
      if (!components[idx].disabled()) return idx;
      idx = (idx + direction + components.length) % components.length;
    }
    return null;
  }
}
