import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { OrbitBannerComponent, OrbitButtonComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-banner-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitBannerComponent, OrbitButtonComponent, LabExampleComponent],
  templateUrl: './banner-page.component.html',
})
export class BannerPageComponent {
  protected readonly dismissibleVisible = signal(true);

  protected readonly usageSnippet = `<orbit-banner tone="info">Manutenzione programmata alle 22:00.</orbit-banner>`;

  protected readonly dismissibleSnippet = `<orbit-banner tone="danger" dismissible (dismissed)="visible = false">
  Servizio temporaneamente non disponibile.
</orbit-banner>`;

  resetDismissible(): void {
    this.dismissibleVisible.set(true);
  }

  hideDismissible(): void {
    this.dismissibleVisible.set(false);
  }
}
