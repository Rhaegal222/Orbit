import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ORBIT_PANEL_DATA,
  OrbitPanelService,
  OrbitPanelSurfaceComponent,
  OrbitSidebarComponent,
  type OrbitSidebarItem,
  type OrbitSidebarSection,
} from '@galileo/orbit';
import type { LabExampleSwitcherItem } from './example-switcher.types';

export interface LabExampleSwitcherSidebarData {
  readonly items: readonly LabExampleSwitcherItem[];
  readonly selected: string;
  readonly onSelect: (value: string) => void;
}

/** Offcanvas content opened by `LabExampleSwitcherComponent` in 'offcanvas' mode — the
 * drawer-nav composition pattern documented in panel-page (`orbit-sidebar embedded` inside
 * `OrbitPanelService`), applied to switching examples-page's demo scenario instead of app
 * navigation. */
@Component({
  selector: 'lab-example-switcher-sidebar-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitPanelSurfaceComponent, OrbitSidebarComponent],
  template: `<orbit-panel-surface ariaLabel="Cambia scheda">
    <orbit-sidebar
      embedded
      brand="Esempi"
      [sections]="sections"
      [activeId]="data.selected"
      (itemSelected)="select($event)"
      (closed)="close()"
    />
  </orbit-panel-surface>`,
})
export class LabExampleSwitcherSidebarContentComponent {
  private readonly panel = inject(OrbitPanelService);
  protected readonly data = inject(ORBIT_PANEL_DATA) as LabExampleSwitcherSidebarData;

  protected readonly sections: readonly OrbitSidebarSection[] = [
    {
      id: 'examples',
      items: this.data.items.map((item) => ({
        id: item.value,
        label: item.label,
        badge: item.badge,
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
