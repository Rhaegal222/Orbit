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
  styles: `
    .navbar-tone-demo,
    .navbar-size-demo,
    .navbar-variant-demo,
    .navbar-combo-demo {
      display: flex;
      flex-direction: column;
    }
  `,
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

  protected readonly toneSnippet = `<orbit-navbar
  tone="dark"
  brand="Orbit"
  [items]="items"
  [activeId]="activeId"
  (itemSelected)="activeId = $event.id"
/>

<orbit-navbar
  tone="primary"
  brand="Orbit"
  [items]="items"
  [activeId]="activeId"
  (itemSelected)="activeId = $event.id"
/>

<orbit-navbar
  tone="transparent"
  brand="Orbit"
  [items]="items"
  [activeId]="activeId"
  (itemSelected)="activeId = $event.id"
/>`;

  protected readonly sizeSnippet = `<orbit-navbar size="sm" brand="Orbit" [items]="items" [activeId]="activeId" />
<orbit-navbar size="md" brand="Orbit" [items]="items" [activeId]="activeId" />
<orbit-navbar size="lg" brand="Orbit" [items]="items" [activeId]="activeId" />`;

  protected readonly variantSnippet = `<orbit-navbar variant="filled" brand="Orbit" [items]="items" [activeId]="activeId" />
<orbit-navbar variant="underline" brand="Orbit" [items]="items" [activeId]="activeId" />
<orbit-navbar variant="pills" brand="Orbit" [items]="items" [activeId]="activeId" />`;

  selectItem(item: OrbitNavbarItem): void {
    this.activeId.set(item.id);
  }
}
