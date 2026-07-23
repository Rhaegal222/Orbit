import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { OrbitButtonComponent, OrbitButtonTone } from '../button/button.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

@Component({
  selector: 'orbit-form-action-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent],
  templateUrl: './form-action-bar.component.html',
  styleUrl: './form-action-bar.component.css',
  host: {
    '[class.orbit-form-action-bar--loading]': 'loading()',
  },
})
export class OrbitFormActionBarComponent {
  readonly i18n = inject(ORBIT_I18N);
  confirmLabel = input('');
  draftLabel = input('');
  cancelLabel = input('');
  showCancel = input(true, { transform: booleanAttribute });
  showDraft = input(true, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  confirmDisabled = input(false, { transform: booleanAttribute });
  confirmTone = input<OrbitButtonTone>('primary');
  statusLabel = input('');

  cancel = output<void>();
  saveDraft = output<void>();
  confirm = output<void>();
}
