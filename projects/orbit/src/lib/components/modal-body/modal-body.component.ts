import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

@Component({
  selector: 'orbit-modal-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal-body.component.html',
  styleUrl: './modal-body.component.css',
})
export class OrbitModalBodyComponent {
  readonly i18n = inject(ORBIT_I18N);
  loading = input(false, { transform: booleanAttribute });
  loadingLabel = input('');
  loaderSmall = input(false, { transform: booleanAttribute });
}
