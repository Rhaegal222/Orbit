import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { OrbitButtonComponent, OrbitClipboardService, OrbitCodeBlockComponent } from '@galileo/orbit';

@Component({
  selector: 'lab-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, OrbitCodeBlockComponent],
  templateUrl: './example-panel.component.html',
  styleUrl: './example-panel.component.css',
})
export class LabExampleComponent {
  /** Optional source snippet rendered below the interactive preview. */
  code = input('');
  protected readonly isCodeVisible = signal(false);
  protected readonly copyLabel = signal('Copia');
  private readonly clipboard = inject(OrbitClipboardService);

  toggleCode(): void {
    this.isCodeVisible.update((visible) => !visible);
  }

  async copyCode(): Promise<void> {
    const copied = await this.clipboard.copyText(this.code());
    this.copyLabel.set(copied ? 'Copiato' : 'Copia non riuscita');
  }
}
