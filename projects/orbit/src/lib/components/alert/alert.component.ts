import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';
import type { OrbitIconName } from '../../icons/icon-registry';

export type OrbitAlertTone = 'success' | 'danger' | 'warning' | 'info';

const TONE_ICON: Record<OrbitAlertTone, OrbitIconName> = {
  success: 'check',
  danger: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info',
};

@Component({
  selector: 'orbit-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent, OrbitIconButtonComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  host: {
    class: 'orbit-alert',
    '[class.orbit-alert--success]': "tone() === 'success'",
    '[class.orbit-alert--danger]': "tone() === 'danger'",
    '[class.orbit-alert--warning]': "tone() === 'warning'",
    '[class.orbit-alert--info]': "tone() === 'info'",
    '[attr.role]': "tone() === 'danger' ? 'alert' : 'status'",
  },
})
export class OrbitAlertComponent {
  private readonly i18n = inject(ORBIT_I18N);

  tone = input<OrbitAlertTone>('info');
  dismissible = input(false, { transform: booleanAttribute });
  dismissed = output<void>();

  protected readonly icon = computed<OrbitIconName>(() => TONE_ICON[this.tone()]);
  protected readonly closeLabel = computed(() => this.i18n.labels.close);

  onDismiss(): void {
    this.dismissed.emit();
  }
}
