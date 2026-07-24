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
  protected readonly bannerSuccessVisible = signal(true);
  protected readonly bannerDangerVisible = signal(true);
  protected readonly bannerWarningVisible = signal(true);
  protected readonly bannerInfoVisible = signal(true);
  protected readonly dismissibleVisible = signal(true);

  protected readonly usageSnippet = `<header class="app-header">
  <orbit-banner tone="info" dismissible>
    Manutenzione straordinaria programmata per questa sera dalle 22:00 alle 23:00.
  </orbit-banner>
  <div class="app-header__title">Dashboard Operativa</div>
</header>`;

  protected readonly dismissibleSnippet = `<orbit-banner tone="danger" dismissible (dismissed)="visible = false">
  Servizio temporaneamente non disponibile.
</orbit-banner>`;

  toggleTone(tone: 'success' | 'danger' | 'warning' | 'info'): void {
    if (tone === 'success') this.bannerSuccessVisible.update((v) => !v);
    if (tone === 'danger') this.bannerDangerVisible.update((v) => !v);
    if (tone === 'warning') this.bannerWarningVisible.update((v) => !v);
    if (tone === 'info') this.bannerInfoVisible.update((v) => !v);
  }

  resetAllTones(): void {
    this.bannerSuccessVisible.set(true);
    this.bannerDangerVisible.set(true);
    this.bannerWarningVisible.set(true);
    this.bannerInfoVisible.set(true);
  }

  resetDismissible(): void {
    this.dismissibleVisible.set(true);
  }

  hideDismissible(): void {
    this.dismissibleVisible.set(false);
  }
}
