import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  OrbitButtonComponent,
  OrbitIconButtonComponent,
  OrbitIconComponent,
  OrbitModalBodyComponent,
  OrbitModalFooterComponent,
  OrbitModalHeaderComponent,
  OrbitPanelService,
  OrbitPanelSurfaceComponent,
  OrbitSelectableTileComponent,
  OrbitSidebarComponent,
  OrbitSliderComponent,
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
  selector: 'lab-panel-demo-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitModalBodyComponent,
    OrbitModalFooterComponent,
    OrbitModalHeaderComponent,
    OrbitPanelSurfaceComponent,
  ],
  template: `<orbit-panel-surface labelledBy="panel-demo-title">
    <orbit-modal-header
      title="Dettaglio"
      subtitle="Pannello operativo laterale"
      titleId="panel-demo-title"
      (closeClicked)="close()"
    />
    <orbit-modal-body>
      <p>Il contenuto scorre fra header e footer, come in un modal Orbit.</p>
    </orbit-modal-body>
    <orbit-modal-footer>
      <span orbitModalFooterLeft>Salvataggio automatico attivo</span>
      <span orbitModalFooterRight>
        <orbit-button label="Chiudi" variant="outline" tone="neutral" (clicked)="close()" />
      </span>
    </orbit-modal-footer>
  </orbit-panel-surface>`,
})
class LabPanelDemoContentComponent {
  private readonly panel = inject(OrbitPanelService);
  close(): void {
    this.panel.closeAll();
  }
}

/** Demonstrates the drawer-nav composition pattern: orbit-sidebar embedded inside the existing OrbitPanelService overlay — no new Core primitive. */
@Component({
  selector: 'lab-sidebar-drawer-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitPanelSurfaceComponent, OrbitSidebarComponent],
  template: `<orbit-panel-surface ariaLabel="Navigazione mobile">
    <orbit-sidebar
      embedded
      brand="Orbit"
      [sections]="sections"
      [activeId]="activeId()"
      (itemSelected)="select($event)"
    />
  </orbit-panel-surface>`,
})
class LabSidebarDrawerContentComponent {
  private readonly panel = inject(OrbitPanelService);
  readonly sections = SIDEBAR_SECTIONS;
  readonly activeId = signal('overview');

  select(item: OrbitSidebarItem): void {
    this.activeId.set(item.id);
    this.panel.closeAll();
  }
}

@Component({
  selector: 'lab-panel-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitIconButtonComponent,
    OrbitIconComponent,
    OrbitSelectableTileComponent,
    OrbitSidebarComponent,
    OrbitSliderComponent,
    LabExampleComponent,
  ],
  templateUrl: './panel-page.component.html',
  styleUrl: './panel-page.component.css',
})
export class PanelPageComponent {
  private readonly panel = inject(OrbitPanelService);
  protected readonly lastOpenedSide = signal<'left' | 'right' | null>(null);
  protected readonly sections = SIDEBAR_SECTIONS;
  protected readonly stateSections = SIDEBAR_STATE_SECTIONS;
  protected readonly railVariant = signal<'expanded' | 'compact'>('expanded');
  protected readonly showActiveItem = signal(false);
  protected readonly showBadgeItem = signal(false);
  protected readonly showDisabledItem = signal(false);
  protected readonly showBrandIcon = signal(false);
  protected readonly showSidebarHeader = signal(true);
  protected readonly showSidebarFooter = signal(true);
  protected readonly toggleMargin = signal(0);
  protected readonly activeId = signal('overview');
  protected readonly collapsed = signal(false);
  protected readonly showItemStates = computed(
    () => this.showActiveItem() || this.showBadgeItem() || this.showDisabledItem(),
  );
  protected readonly currentSections = computed(() => {
    if (!this.showItemStates()) {
      return this.sections;
    }

    const stateSection = this.stateSections[0];
    if (!stateSection) {
      return this.sections;
    }

    return [
      {
        ...stateSection,
        items: stateSection.items.filter((item) =>
          (item.id === 'active' && this.showActiveItem()) ||
          (item.id === 'badge' && this.showBadgeItem()) ||
          (item.id === 'disabled' && this.showDisabledItem()),
        ),
      },
    ];
  });
  protected readonly variantLabel = computed(() => {
    const railLabel = this.collapsed() ? 'Rail compatta' : 'Rail espansa';
    return this.showItemStates() ? `Stati item · ${railLabel.toLowerCase()}` : railLabel;
  });

  protected readonly offcanvasSnippet = `<orbit-panel-surface labelledBy="panel-title">
  <orbit-modal-header title="Dettaglio" titleId="panel-title" />
  <orbit-modal-body>Contenuto operativo</orbit-modal-body>
  <orbit-modal-footer>Azioni</orbit-modal-footer>
</orbit-panel-surface>`;

  protected readonly sidebarSnippet = `<!-- Brand, sezioni e modalità compatta sono controllati dal consumer. -->
<orbit-sidebar
  brand="Orbit"
  [brandIcon]="showBrandIcon ? 'layers' : null"
  [sections]="showItemStates ? stateSections : sections"
  [activeId]="activeId"
  [collapsed]="collapsed"
  [showHeader]="showHeader"
  [showFooter]="showFooter"
  [toggleMargin]="toggleMargin"
  (itemSelected)="activeId = $event.id"
  (collapsedChange)="collapsed = $event"
>
  <span orbitSidebarFooter>Footer proiettato</span>
</orbit-sidebar>`;

  protected readonly drawerNavSnippet = `<!-- Sotto --orbit-breakpoint-sm: apri via OrbitPanelService -->
<orbit-icon-button icon="menu" ariaLabel="Apri navigazione" (clicked)="openNav()" />

<!-- openNav(): this.panel.open(NavContentComponent, { side: 'left', size: 'sm' }) -->
<!-- NavContentComponent template: -->
<orbit-panel-surface ariaLabel="Navigazione mobile">
  <orbit-sidebar embedded [sections]="sections" [activeId]="activeId" (itemSelected)="select($event)" />
</orbit-panel-surface>`;

  openOffcanvas(side: 'left' | 'right'): void {
    this.lastOpenedSide.set(side);
    this.panel.open(LabPanelDemoContentComponent, { side });
  }

  openSidebarDrawer(): void {
    this.panel.open(LabSidebarDrawerContentComponent, { side: 'left', size: 'sm' });
  }

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

  setItemState(state: 'active' | 'badge' | 'disabled', show: boolean): void {
    const stateVisibility = {
      active: this.showActiveItem,
      badge: this.showBadgeItem,
      disabled: this.showDisabledItem,
    };
    stateVisibility[state].set(show);

    const visibleItems = this.currentSections()[0]?.items ?? [];
    const firstAvailableItem = visibleItems.find((item) => !item.disabled) ?? visibleItems[0];
    this.activeId.set(
      firstAvailableItem?.id ?? (this.collapsed() ? 'collections' : 'overview'),
    );
  }

  selectBrandIcon(showIcon: boolean): void {
    this.showBrandIcon.set(showIcon);
  }

  setShowSidebarHeader(show: boolean): void {
    this.showSidebarHeader.set(show);
  }

  setShowSidebarFooter(show: boolean): void {
    this.showSidebarFooter.set(show);
  }

  setToggleMargin(margin: number): void {
    this.toggleMargin.set(margin);
  }

  setCollapsed(collapsed: boolean): void {
    this.collapsed.set(collapsed);
    this.railVariant.set(collapsed ? 'compact' : 'expanded');
    if (!this.showItemStates()) {
      this.activeId.set(collapsed ? 'collections' : 'overview');
    }
  }
}
