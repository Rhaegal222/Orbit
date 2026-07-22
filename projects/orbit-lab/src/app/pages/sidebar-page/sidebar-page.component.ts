import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  OrbitIconComponent,
  OrbitSelectableTileComponent,
  OrbitSidebarComponent,
  type OrbitSidebarItem,
  type OrbitSidebarSection,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

const SIDEBAR_SECTIONS: readonly OrbitSidebarSection[] = [
  {
    id: 'workspace',
    items: [{ id: 'overview', label: 'Panoramica', icon: 'home' }],
  },
  {
    id: 'manage',
    label: 'Gestione',
    items: [
      { id: 'collections', label: 'Raccolte', icon: 'layers', badge: 3 },
      { id: 'settings', label: 'Configurazione', icon: 'settings' },
    ],
  },
];

const SIDEBAR_STATE_SECTIONS: readonly OrbitSidebarSection[] = [
  {
    id: 'states',
    label: 'Stati',
    items: [
      { id: 'active', label: 'Attivo', icon: 'home' },
      { id: 'badge', label: 'Con badge', icon: 'layers', badge: 125 },
      { id: 'disabled', label: 'Non disponibile', icon: 'settings', disabled: true },
    ],
  },
];

@Component({
  selector: 'lab-sidebar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LabExampleComponent,
    OrbitIconComponent,
    OrbitSelectableTileComponent,
    OrbitSidebarComponent,
  ],
  templateUrl: './sidebar-page.component.html',
  styleUrl: './sidebar-page.component.css',
})
export class SidebarPageComponent {
  protected readonly sections = SIDEBAR_SECTIONS;
  protected readonly stateSections = SIDEBAR_STATE_SECTIONS;
  protected readonly railVariant = signal<'expanded' | 'compact'>('expanded');
  protected readonly showItemStates = signal(false);
  protected readonly showBrandIcon = signal(false);
  protected readonly activeId = signal('overview');
  protected readonly collapsed = signal(false);
  protected readonly currentSections = computed(() =>
    this.showItemStates() ? this.stateSections : this.sections,
  );
  protected readonly variantLabel = computed(() => {
    const railLabel = this.collapsed() ? 'Rail compatta' : 'Rail espansa';
    return this.showItemStates() ? `Stati item · ${railLabel.toLowerCase()}` : railLabel;
  });

  protected readonly snippet = `<orbit-sidebar
  brand="Orbit"
  [sections]="sections"
  [activeId]="activeId"
  [collapsed]="collapsed"
  (itemSelected)="activeId = $event.id"
  (collapsedChange)="collapsed = $event"
>
  <span orbitSidebarFooter>Footer proiettato</span>
</orbit-sidebar>`;

  select(item: OrbitSidebarItem): void {
    this.activeId.set(item.id);
  }

  selectRailVariant(variant: 'expanded' | 'compact'): void {
    this.railVariant.set(variant);
    this.collapsed.set(variant === 'compact');
    if (!this.showItemStates()) {
      this.activeId.set(variant === 'compact' ? 'collections' : 'overview');
    }
  }

  setShowItemStates(show: boolean): void {
    this.showItemStates.set(show);
    this.activeId.set(show ? 'active' : this.collapsed() ? 'collections' : 'overview');
  }

  selectBrandIcon(showIcon: boolean): void {
    this.showBrandIcon.set(showIcon);
  }

  setCollapsed(collapsed: boolean): void {
    this.collapsed.set(collapsed);
    this.railVariant.set(collapsed ? 'compact' : 'expanded');
    if (!this.showItemStates()) {
      this.activeId.set(collapsed ? 'collections' : 'overview');
    }
  }
}
