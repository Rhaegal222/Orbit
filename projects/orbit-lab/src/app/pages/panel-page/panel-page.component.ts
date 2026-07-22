import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  OrbitButtonComponent,
  OrbitModalBodyComponent,
  OrbitModalFooterComponent,
  OrbitModalHeaderComponent,
  OrbitPanelComponent,
  OrbitPanelService,
  OrbitPanelSurfaceComponent,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

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
  imports: [OrbitButtonComponent, OrbitPanelComponent, LabExampleComponent],
  templateUrl: './panel-page.component.html',
})
export class PanelPageComponent {
  private readonly panel = inject(OrbitPanelService);
  protected readonly lastOpenedSide = signal<'left' | 'right' | null>(null);

  protected readonly offcanvasSnippet = `<orbit-panel-surface labelledBy="panel-title">
  <orbit-modal-header title="Dettaglio" titleId="panel-title" />
  <orbit-modal-body>Contenuto operativo</orbit-modal-body>
  <orbit-modal-footer>Azioni</orbit-modal-footer>
</orbit-panel-surface>`;

  protected readonly sidebarSnippet = '<orbit-panel><p>Contenuto fisso di layout</p></orbit-panel>';

  openOffcanvas(side: 'left' | 'right'): void {
    this.lastOpenedSide.set(side);
    this.panel.open(LabPanelDemoContentComponent, { side });
  }
}
