import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';
import type { OrbitIconName } from '../../icons/icon-registry';

export type OrbitBannerTone = 'success' | 'danger' | 'warning' | 'info';

const TONE_ICON: Record<OrbitBannerTone, OrbitIconName> = {
  success: 'check',
  danger: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info',
};

@Component({
  selector: 'orbit-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent, OrbitIconButtonComponent],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
  host: {
    class: 'orbit-banner',
    '[class.orbit-banner--success]': "tone() === 'success'",
    '[class.orbit-banner--danger]': "tone() === 'danger'",
    '[class.orbit-banner--warning]': "tone() === 'warning'",
    '[class.orbit-banner--info]': "tone() === 'info'",
    '[attr.role]': "tone() === 'danger' ? 'alert' : 'status'",
  },
})
export class OrbitBannerComponent {
  private readonly i18n = inject(ORBIT_I18N);

  tone = input<OrbitBannerTone>('info');
  dismissible = input(false, { transform: booleanAttribute });
  dismissed = output<void>();

  protected readonly icon = computed<OrbitIconName>(() => TONE_ICON[this.tone()]);
  protected readonly closeLabel = computed(() => this.i18n.labels.close);

  onDismiss(): void {
    this.dismissed.emit();
  }
}
