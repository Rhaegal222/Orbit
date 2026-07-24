import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { OrbitButtonComponent } from '../button/button.component';
import { OrbitModalComponent } from '../modal/modal.component';
import { ORBIT_DIALOG_DATA } from '../../services/dialog/dialog.service';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

export interface OrbitConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'success' | 'danger';
}

/** Generic confirmation content. Consumers close the returned dialog ref after either output. */
@Component({
  selector: 'orbit-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitModalComponent, OrbitButtonComponent],
  template: `<orbit-modal
    size="sm"
    labelledBy="orbit-confirm-title"
    describedBy="orbit-confirm-message"
  >
    <div class="orbit-confirm-dialog__body">
      <h2 id="orbit-confirm-title">{{ data.title }}</h2>
      <p id="orbit-confirm-message">{{ data.message }}</p>
    </div>
    <div class="orbit-confirm-dialog__actions">
      <orbit-button
        [label]="data.cancelLabel ?? i18n.labels.cancel"
        tone="neutral"
        variant="outline"
        (clicked)="cancelled.emit()"
      />
      <orbit-button
        [label]="data.confirmLabel ?? i18n.labels.confirm"
        [tone]="data.tone ?? 'primary'"
        (clicked)="confirmed.emit()"
      />
    </div>
  </orbit-modal>`,
  styles: [
    `
      .orbit-confirm-dialog__body {
        padding: var(--orbit-space-5);
        font-family: var(--orbit-font-sans);
      }
      .orbit-confirm-dialog__body h2 {
        margin: 0;
        color: var(--orbit-text-primary);
        font-size: var(--orbit-font-size-lg);
      }
      .orbit-confirm-dialog__body p {
        margin: var(--orbit-space-2) 0 0;
        color: var(--orbit-text-secondary);
      }
      .orbit-confirm-dialog__actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--orbit-space-2);
        padding: var(--orbit-space-3) var(--orbit-space-5);
        border-top: 1px solid var(--orbit-border-subtle);
      }
    `,
  ],
})
export class OrbitConfirmDialogComponent {
  readonly i18n = inject(ORBIT_I18N);
  data = inject(ORBIT_DIALOG_DATA) as OrbitConfirmDialogData;
  confirmed = output<void>();
  cancelled = output<void>();
}
