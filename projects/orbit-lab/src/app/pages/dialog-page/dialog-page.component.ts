import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  OrbitButtonComponent,
  OrbitConfirmDialogComponent,
  OrbitDialogService,
  OrbitModalComponent,
  OrbitModalHeaderComponent,
  OrbitModalBodyComponent,
  OrbitModalFooterComponent,
  ORBIT_DIALOG_DATA,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-custom-dialog-example',
  standalone: true,
  imports: [
    OrbitModalComponent,
    OrbitModalHeaderComponent,
    OrbitModalBodyComponent,
    OrbitModalFooterComponent,
    OrbitButtonComponent,
  ],
  template: `
    <orbit-modal [size]="data.size || 'md'" labelledBy="demo-dialog-title">
      <orbit-modal-header
        titleId="demo-dialog-title"
        [title]="'Modal Personalizzato (' + (data.size || 'md').toUpperCase() + ')'"
        subtitle="Configurazione con titolo e pulsanti a sinistra e destra"
        (closeClicked)="close()"
      />
      <orbit-modal-body>
        <p>
          Questo è un esempio di dialogo personalizzato con dimensione
          <strong>{{ data.size || 'md' }}</strong
          >.
        </p>
        <p>
          Contiene un'intestazione con titolo/sottotitolo, testo di corpo e una footer con un
          pulsante a sinistra e uno a destra.
        </p>
      </orbit-modal-body>
      <orbit-modal-footer>
        <orbit-button
          orbitModalFooterLeft
          label="Annulla"
          variant="outline"
          tone="neutral"
          (clicked)="close()"
        />
        <orbit-button
          orbitModalFooterRight
          label="Salva modifiche"
          variant="solid"
          tone="primary"
          (clicked)="close()"
        />
      </orbit-modal-footer>
    </orbit-modal>
  `,
})
export class LabCustomDialogExampleComponent {
  private readonly dialogRef = inject(OrbitDialogService);
  data = inject<{ size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' }>(ORBIT_DIALOG_DATA);

  close(): void {
    this.dialogRef.closeAll();
  }
}

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

  protected readonly confirmSnippet = `const ref = dialog.open(OrbitConfirmDialogComponent, {
  size: 'sm',
  data: {
    title: 'Elimina allegato',
    message: 'Confermi la rimozione? L’operazione non è reversibile.',
    confirmLabel: 'Elimina',
    tone: 'danger',
  },
});
ref.componentInstance.confirmed.subscribe(() => ref.close());
ref.componentInstance.cancelled.subscribe(() => ref.close());`;

  protected readonly sizeSnippet = `// Aprire un dialogo specificando la taglia ('sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full')
dialog.open(MyCustomComponent, { size: 'lg' });`;

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

  openSize(size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'): void {
    this.dialog.open(LabCustomDialogExampleComponent, {
      size,
      data: { size },
    });
  }
}
