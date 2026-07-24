import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  OrbitAlertComponent,
  OrbitButtonComponent,
  OrbitFormFieldComponent,
  OrbitFormSectionComponent,
  OrbitTextInputComponent,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-alert-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitAlertComponent,
    OrbitButtonComponent,
    OrbitFormFieldComponent,
    OrbitFormSectionComponent,
    OrbitTextInputComponent,
    LabExampleComponent,
  ],
  templateUrl: './alert-page.component.html',
})
export class AlertPageComponent {
  protected readonly alertSuccessVisible = signal(true);
  protected readonly alertDangerVisible = signal(true);
  protected readonly alertWarningVisible = signal(true);
  protected readonly alertInfoVisible = signal(true);
  protected readonly dismissibleVisible = signal(true);

  protected readonly usageSnippet = `<orbit-form-section title="Modifica Profilo">
  <orbit-alert tone="warning" dismissible>
    Alcuni campi obbligatori richiedono la tua attenzione prima del salvataggio.
  </orbit-alert>

  <orbit-form-field label="Email aziendale" required>
    <orbit-text-input type="email" value="mario.rossi@azienda.it" />
  </orbit-form-field>
</orbit-form-section>`;

  protected readonly dismissibleSnippet = `<orbit-alert tone="danger" dismissible (dismissed)="onDismiss()">
  Impossibile connettersi al server per la validazione.
</orbit-alert>`;

  toggleTone(tone: 'success' | 'danger' | 'warning' | 'info'): void {
    if (tone === 'success') this.alertSuccessVisible.update((v) => !v);
    if (tone === 'danger') this.alertDangerVisible.update((v) => !v);
    if (tone === 'warning') this.alertWarningVisible.update((v) => !v);
    if (tone === 'info') this.alertInfoVisible.update((v) => !v);
  }

  resetAllTones(): void {
    this.alertSuccessVisible.set(true);
    this.alertDangerVisible.set(true);
    this.alertWarningVisible.set(true);
    this.alertInfoVisible.set(true);
  }

  resetDismissible(): void {
    this.dismissibleVisible.set(true);
  }

  hideDismissible(): void {
    this.dismissibleVisible.set(false);
  }
}
