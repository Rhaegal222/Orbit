import { ChangeDetectionStrategy, Component, inject, Injectable, signal } from '@angular/core';
import {
  OrbitButtonComponent,
  OrbitModalHeaderComponent,
  OrbitPanelComponent,
  OrbitPanelService,
  OrbitPanelSurfaceComponent,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-panel-demo-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitPanelSurfaceComponent, OrbitModalHeaderComponent],
  template: `<orbit-panel-surface labelledBy="panel-demo-title">
    <orbit-modal-header title="Dettaglio" titleId="panel-demo-title" (closeClicked)="close()" />
    <div style="padding: 1rem">Contenuto del pannello offcanvas.</div>
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
  imports: [OrbitButtonComponent, OrbitPanelComponent, LabExampleComponent],
  templateUrl: './panel-page.component.html',
})
export class PanelPageComponent {
  private readonly panel = inject(OrbitPanelService);
  protected readonly lastOpenedSide = signal<'left' | 'right' | null>(null);

  protected readonly offcanvasSnippet = `const panel = inject(OrbitPanelService);
panel.open(MyPanelContentComponent, { side: 'right', size: 'md' });`;

  protected readonly sidebarSnippet = '<orbit-panel><p>Contenuto fisso di layout</p></orbit-panel>';

  openOffcanvas(side: 'left' | 'right'): void {
    this.lastOpenedSide.set(side);
    this.panel.open(LabPanelDemoContentComponent, { side });
  }
}
