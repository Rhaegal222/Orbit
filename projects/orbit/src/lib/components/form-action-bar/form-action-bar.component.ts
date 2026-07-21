import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'orbit-form-action-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-action-bar.component.html',
  styleUrl: './form-action-bar.component.css',
  host: {
    '[class.orbit-form-action-bar--loading]': 'loading()',
  },
})
export class OrbitFormActionBarComponent {
  confirmLabel = input('SALVA E CONTINUA');
  draftLabel = input('SALVA BOZZA');
  cancelLabel = input('ANNULLA');
  showCancel = input(true, { transform: booleanAttribute });
  showDraft = input(true, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  confirmDisabled = input(false, { transform: booleanAttribute });

  cancel = output<void>();
  saveDraft = output<void>();
  confirm = output<void>();
}
