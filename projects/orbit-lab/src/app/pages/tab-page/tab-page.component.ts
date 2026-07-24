import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  OrbitBadgeComponent,
  OrbitTabComponent,
  OrbitTabPanelComponent,
  OrbitTablistComponent,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

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
  ],
  templateUrl: './tab-page.component.html',
})
export class TabPageComponent {
  protected readonly active = signal('general');
  protected readonly snippet = `<orbit-tablist ariaLabel="Sezioni" (selectedChange)="active.set($event)">
  <orbit-tab value="general" label="Generale" [selected]="active() === 'general'" />
  <orbit-tab value="docs" label="Documenti" [selected]="active() === 'docs'">
    <orbit-badge orbitTabBadge label="3" tone="neutral" />
  </orbit-tab>
  <orbit-tab value="closed" label="Chiuso" [selected]="active() === 'closed'" disabled />
</orbit-tablist>`;
}
