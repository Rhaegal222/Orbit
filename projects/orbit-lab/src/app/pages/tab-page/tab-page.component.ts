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
  protected readonly scrollActive = signal('tab-1');
  protected readonly modalActive = signal('tab-1');
  protected readonly offcanvasActive = signal('tab-1');

  protected readonly scrollTabs = Array.from({ length: 8 }, (_, i) => ({
    value: `tab-${i + 1}`,
    label: `Sezione ${i + 1}`,
  }));

  protected readonly snippet = `<orbit-tablist ariaLabel="Sezioni" (selectedChange)="active.set($event)">
  <orbit-tab value="general" label="Generale" [selected]="active() === 'general'" />
  <orbit-tab value="docs" label="Documenti" [selected]="active() === 'docs'">
    <orbit-badge orbitTabBadge label="3" tone="neutral" />
  </orbit-tab>
  <orbit-tab value="closed" label="Chiuso" [selected]="active() === 'closed'" disabled />
</orbit-tablist>`;
  protected readonly scrollSnippet = `<orbit-tablist
  ariaLabel="Molte sezioni"
  (selectedChange)="scrollActive.set($event)"
>
  @for (tab of scrollTabs; track tab.value) {
    <orbit-tab [value]="tab.value" [label]="tab.label"
      [selected]="scrollActive() === tab.value" />
  }
</orbit-tablist>`;
  protected readonly modalSnippet = `<orbit-tablist
  pickerMode="modal"
  style="max-width: 30rem"
  ariaLabel="Sezioni"
  (selectedChange)="modalActive.set($event)"
>
  @for (tab of scrollTabs; track tab.value) {
    <orbit-tab [value]="tab.value" [label]="tab.label"
      [selected]="modalActive() === tab.value" />
  }
</orbit-tablist>`;
  protected readonly offcanvasSnippet = `<orbit-tablist
  pickerMode="offcanvas"
  style="max-width: 30rem"
  ariaLabel="Sezioni"
  (selectedChange)="offcanvasActive.set($event)"
>
  @for (tab of scrollTabs; track tab.value) {
    <orbit-tab [value]="tab.value" [label]="tab.label"
      [selected]="offcanvasActive() === tab.value" />
  }
</orbit-tablist>`;
}
