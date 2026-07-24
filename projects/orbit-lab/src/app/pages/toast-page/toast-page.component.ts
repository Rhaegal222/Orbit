import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrbitButtonComponent, OrbitToastService } from '@galileo/orbit';
import type { OrbitToastTone } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-toast-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, LabExampleComponent],
  templateUrl: './toast-page.component.html',
  styleUrl: './toast-page.component.css',
})
export class ToastPageComponent {
  private readonly toast = inject(OrbitToastService);

  protected readonly toneMessages: Record<OrbitToastTone, string> = {
    success: 'Modifiche salvate con successo',
    danger: "Impossibile completare l'operazione",
    warning: 'Controlla i campi obbligatori',
    info: 'Sincronizzazione in corso',
  };

  protected readonly usageSnippet = `import { OrbitToastService } from '@galileo/orbit';

private readonly toast = inject(OrbitToastService);

this.toast.show({
  message: 'Modifiche salvate con successo',
  tone: 'success',
  position: 'bottom-end',
});`;

  protected readonly dismissibleSnippet = `this.toast.show({
  message: 'Nessun auto-dismiss: chiudi manualmente',
  duration: 0,
  dismissible: true,
});`;

  showTone(tone: OrbitToastTone): void {
    this.toast.show({ message: this.toneMessages[tone], tone, position: 'bottom-end' });
  }

  showMultipleBottomStart(): void {
    const tones: OrbitToastTone[] = ['success', 'danger', 'warning', 'info'];
    tones.forEach((tone) => {
      this.toast.show({
        message: this.toneMessages[tone],
        tone,
        position: 'bottom-start',
        duration: 0,
      });
    });
  }

  showManual(): void {
    this.toast.show({
      message: 'Nessun auto-dismiss: chiudi manualmente',
      duration: 0,
      dismissible: true,
    });
  }

  dismissAll(): void {
    this.toast.dismissAll();
  }
}
