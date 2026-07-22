import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  OrbitIconComponent,
  OrbitSidebarComponent,
  type OrbitSidebarItem,
  type OrbitSidebarSection,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-sidebar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LabExampleComponent, OrbitIconComponent, OrbitSidebarComponent],
  templateUrl: './sidebar-page.component.html',
  styleUrl: './sidebar-page.component.css',
})
export class SidebarPageComponent {
  protected readonly collapsed = signal(false);
  protected readonly activeId = signal('overview');
  protected readonly sections: readonly OrbitSidebarSection[] = [
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

  protected readonly snippet = `<orbit-sidebar
  brand="Orbit"
  brandShort="O"
  brandIcon="layers"
  [sections]="sections"
  [activeId]="activeId"
  [collapsed]="collapsed"
  (itemSelected)="activeId = $event.id"
  (collapsedChange)="collapsed = $event"
>
  <div orbitSidebarFooter>Contenuto footer proiettato</div>
</orbit-sidebar>`;

  select(item: OrbitSidebarItem): void {
    this.activeId.set(item.id);
  }
}
