import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

export type OrbitSpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'orbit-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class OrbitSpinnerComponent {
  size = input<OrbitSpinnerSize>('md');
  ariaLabel = input<string | undefined>(undefined);

  protected readonly i18n = inject(ORBIT_I18N);
}
