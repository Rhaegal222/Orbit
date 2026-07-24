import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  OrbitBadgeComponent,
  OrbitTabComponent,
  OrbitTabPanelComponent,
  OrbitTablistComponent,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';
import { LabExampleSwitcherComponent } from '../../catalog/example-switcher/example-switcher.component';
import type { LabExampleSwitcherItem } from '../../catalog/example-switcher/example-switcher.types';

const RESPONSIVE_SWITCHER_ITEMS: readonly LabExampleSwitcherItem[] = [
  { value: 'general', label: 'Generale', badge: 'Predefinita' },
  { value: 'docs', label: 'Documenti', badge: 'Badge "3"' },
  { value: 'closed', label: 'Chiuso', badge: 'Disabilitata' },
];

@Component({
  selector: 'lab-tab-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitTablistComponent,
    OrbitTabComponent,
    OrbitTabPanelComponent,
    OrbitBadgeComponent,
    LabExampleComponent,
    LabExampleSwitcherComponent,
  ],
  templateUrl: './tab-page.component.html',
})
export class TabPageComponent {
  protected readonly active = signal('general');
  protected readonly responsiveSwitcherItems = RESPONSIVE_SWITCHER_ITEMS;
  protected readonly responsiveActive = signal('general');

  protected readonly snippet = `<orbit-tablist ariaLabel="Sezioni" (selectedChange)="active.set($event)">
  <orbit-tab value="general" label="Generale" [selected]="active() === 'general'" />
  <orbit-tab value="docs" label="Documenti" [selected]="active() === 'docs'">
    <orbit-badge orbitTabBadge label="3" tone="neutral" />
  </orbit-tab>
  <orbit-tab value="closed" label="Chiuso" [selected]="active() === 'closed'" disabled />
</orbit-tablist>`;

  protected readonly responsiveSnippet = `<!-- Sotto --orbit-breakpoint-sm, quando orbit-tablist andrebbe a capo su più righe -->
<lab-example-switcher
  [items]="items"
  [selected]="selected"
  (selectedChange)="selected = $event"
/>`;

  selectResponsiveExample(value: string): void {
    this.responsiveActive.set(value);
  }
}
