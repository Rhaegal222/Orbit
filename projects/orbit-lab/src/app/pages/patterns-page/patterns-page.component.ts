import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  OrbitButtonComponent,
  OrbitConfirmDialogComponent,
  OrbitDialogService,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-patterns-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LabExampleComponent, OrbitButtonComponent],
  templateUrl: './patterns-page.component.html',
  styleUrl: './patterns-page.component.css',
})
export class PatternsPageComponent {
  private readonly dialog = inject(OrbitDialogService);
  protected readonly result = signal<'confirmed' | 'cancelled' | null>(null);
  protected readonly modalSnippet = `const ref = dialog.open(OrbitConfirmDialogComponent, {
  size: 'sm',
  data: { title: 'Archivia elemento', message: 'Puoi ripristinarlo in seguito.', confirmLabel: 'Archivia' },
});
ref.componentInstance.confirmed.subscribe(() => ref.close());`;

  openConfirmation(): void {
    const ref = this.dialog.open(OrbitConfirmDialogComponent, {
      size: 'sm',
      data: {
        title: 'Archivia elemento',
        message: 'Puoi ripristinarlo in seguito dalla sezione archivio.',
        confirmLabel: 'Archivia',
      },
    });
    ref.componentInstance.confirmed.subscribe(() => {
      this.result.set('confirmed');
      ref.close();
    });
    ref.componentInstance.cancelled.subscribe(() => {
      this.result.set('cancelled');
      ref.close();
    });
  }
}
