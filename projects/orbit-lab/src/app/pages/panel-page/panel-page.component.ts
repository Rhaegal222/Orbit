import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  OrbitButtonComponent,
  OrbitIconComponent,
  OrbitModalBodyComponent,
  OrbitModalFooterComponent,
  OrbitModalHeaderComponent,
  OrbitPanelService,
  OrbitPanelSurfaceComponent,
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

@Component({
  selector: 'lab-panel-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitIconComponent,
    OrbitSelectableTileComponent,
    OrbitSidebarComponent,
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
  (itemSelected)="activeId = $event.id"
  (collapsedChange)="collapsed = $event"
>
  <span orbitSidebarFooter>Footer proiettato</span>
</orbit-sidebar>`;

  openOffcanvas(side: 'left' | 'right'): void {
    this.lastOpenedSide.set(side);
    this.panel.open(LabPanelDemoContentComponent, { side });
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
