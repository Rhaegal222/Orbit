import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitAttachmentDropzoneComponent, OrbitAttachmentListComponent, OrbitDividerComponent } from '@galileo/orbit';

@Component({
  selector: 'lab-attachment-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitAttachmentDropzoneComponent, OrbitAttachmentListComponent, OrbitDividerComponent],
  templateUrl: './attachment-page.component.html',
})
export class AttachmentPageComponent {
  protected readonly editable = [{ id: 'editable', name: 'report.pdf', metadata: 'PDF · 246 KB', actions: [{ id: 'view', label: 'Visualizza', icon: 'view' as const }, { id: 'download', label: 'Scarica', icon: 'download' as const }, { id: 'remove', label: 'Rimuovi', icon: 'remove' as const }] }];
  protected readonly readOnly = [{ id: 'readonly', name: 'riepilogo.pdf', metadata: 'Origine importata', status: 'readonly' as const, statusLabel: 'Sola lettura', readonly: true }];
  protected readonly completed = [{ id: 'completed', name: 'import.csv', metadata: '42 KB', status: 'success' as const, statusLabel: 'Completato' }];
  protected readonly failed = [{ id: 'failed', name: 'dati.zip', metadata: 'Errore di elaborazione', status: 'danger' as const, statusLabel: 'Non disponibile', actions: [{ id: 'retry', label: 'Riprova', icon: 'retry' as const }] }];
}
