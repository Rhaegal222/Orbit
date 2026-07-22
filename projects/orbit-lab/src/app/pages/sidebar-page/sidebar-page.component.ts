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
  protected readonly variant = signal<'expanded' | 'compact' | 'states'>('expanded');
  protected readonly selectedVariant = signal<'expanded' | 'compact' | 'states'>('expanded');
  protected readonly showBrandIcon = signal(false);
  protected readonly activeId = signal('overview');
  protected readonly collapsed = signal(false);
  protected readonly currentSections = computed(() =>
    this.variant() === 'states' ? this.stateSections : this.sections,
  );
  protected readonly variantLabel = computed(() => {
    const railLabel = this.collapsed() ? 'Rail compatta' : 'Rail espansa';

    switch (this.variant()) {
      case 'states':
        return `Stati item · ${railLabel.toLowerCase()}`;
      default:
        return railLabel;
    }
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

  selectVariant(variant: 'expanded' | 'compact' | 'states'): void {
    this.selectedVariant.set(variant);
    this.variant.set(variant);
    this.collapsed.set(variant === 'compact');
    this.activeId.set(variant === 'states' ? 'active' : variant === 'compact' ? 'collections' : 'overview');
  }

  selectBrandIcon(showIcon: boolean): void {
    this.showBrandIcon.set(showIcon);
  }

  setCollapsed(collapsed: boolean): void {
    this.collapsed.set(collapsed);
    if (this.variant() !== 'states') {
      this.variant.set(collapsed ? 'compact' : 'expanded');
      this.selectedVariant.set(this.variant());
    }
  }
}
