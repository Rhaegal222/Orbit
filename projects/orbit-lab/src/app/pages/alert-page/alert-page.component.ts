import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { OrbitAlertComponent, OrbitButtonComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-alert-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitAlertComponent, OrbitButtonComponent, LabExampleComponent],
  templateUrl: './alert-page.component.html',
})
export class AlertPageComponent {
  protected readonly dismissibleVisible = signal(true);

  protected readonly usageSnippet = `<orbit-alert tone="success">Modifiche salvate con successo.</orbit-alert>`;

  protected readonly dismissibleSnippet = `<orbit-alert tone="warning" dismissible (dismissed)="visible = false">
  Alcuni campi richiedono attenzione.
</orbit-alert>`;

  resetDismissible(): void {
    this.dismissibleVisible.set(true);
  }

  hideDismissible(): void {
    this.dismissibleVisible.set(false);
  }
}
