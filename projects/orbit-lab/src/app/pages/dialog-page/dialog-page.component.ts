import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { OrbitButtonComponent, OrbitConfirmDialogComponent, OrbitDialogService } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-dialog-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, LabExampleComponent],
  templateUrl: './dialog-page.component.html',
})
export class DialogPageComponent {
  private readonly dialog = inject(OrbitDialogService);
  protected readonly lastResult = signal<'confirmed' | 'cancelled' | null>(null);

  protected readonly snippet = `const ref = dialog.open(OrbitConfirmDialogComponent, {
  data: { title: 'Elimina allegato', message: 'Confermi la rimozione?', tone: 'danger' },
});
ref.componentInstance.confirmed.subscribe(() => ref.close());
ref.componentInstance.cancelled.subscribe(() => ref.close());`;

  openConfirm(): void {
    const ref = this.dialog.open(OrbitConfirmDialogComponent, {
      size: 'sm',
      data: {
        title: 'Elimina allegato',
        message: 'Confermi la rimozione? L’operazione non è reversibile.',
        confirmLabel: 'Elimina',
        tone: 'danger',
      },
    });

    ref.componentInstance.confirmed.subscribe(() => {
      this.lastResult.set('confirmed');
      ref.close();
    });
    ref.componentInstance.cancelled.subscribe(() => {
      this.lastResult.set('cancelled');
      ref.close();
    });
  }
}
