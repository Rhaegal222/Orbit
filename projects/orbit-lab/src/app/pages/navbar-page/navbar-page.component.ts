import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { OrbitButtonComponent, OrbitNavbarComponent, type OrbitNavbarItem } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

const NAV_ITEMS: readonly OrbitNavbarItem[] = [
  { id: 'overview', label: 'Panoramica' },
  { id: 'activity', label: 'Attività' },
  { id: 'settings', label: 'Configurazione' },
  { id: 'unavailable', label: 'Non disponibile', disabled: true },
];

@Component({
  selector: 'lab-navbar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LabExampleComponent, OrbitButtonComponent, OrbitNavbarComponent],
  templateUrl: './navbar-page.component.html',
})
export class NavbarPageComponent {
  protected readonly items = NAV_ITEMS;
  protected readonly activeId = signal('overview');
  protected readonly snippet = `<orbit-navbar
  brand="Orbit"
  [items]="items"
  [activeId]="activeId"
  (itemSelected)="activeId = $event.id"
>
  <orbit-button orbitNavbarActions label="Crea elemento" />
</orbit-navbar>`;

  selectItem(item: OrbitNavbarItem): void {
    this.activeId.set(item.id);
  }
}
