import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'orbit-modal-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconButtonComponent],
  templateUrl: './modal-header.component.html',
  styleUrl: './modal-header.component.css',
  host: {
    '[class.orbit-modal-header--form]': 'variant() === "form"',
    '[class.orbit-modal-header--no-subtitle]': '!subtitle()',
  },
})
export class OrbitModalHeaderComponent {
  readonly i18n = inject(ORBIT_I18N);
  title = input('');
  titleId = input('');
  subtitle = input('');
  variant = input<'default' | 'form'>('default');
  closable = input(true, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });

  closeClicked = output<void>();

  onClose(): void {
    this.closeClicked.emit();
  }
}
