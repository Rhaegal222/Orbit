import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';
import { ORBIT_TOAST_DATA, ORBIT_TOAST_REF } from '../../services/toast/toast.service';
import type { OrbitToastTone } from '../../services/toast/toast.service';
import type { OrbitIconName } from '../../icons/icon-registry';

const TONE_ICON: Record<OrbitToastTone, OrbitIconName> = {
  success: 'check',
  danger: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info',
};

@Component({
  selector: 'orbit-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent, OrbitIconButtonComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  host: {
    class: 'orbit-toast',
    '[class.orbit-toast--success]': "data.tone === 'success'",
    '[class.orbit-toast--danger]': "data.tone === 'danger'",
    '[class.orbit-toast--warning]': "data.tone === 'warning'",
    '[class.orbit-toast--info]': "data.tone === 'info'",
    '[attr.role]': "data.tone === 'danger' ? 'alert' : 'status'",
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onMouseEnter()',
    '(focusout)': 'onMouseLeave()',
  },
})
export class OrbitToastComponent {
  protected readonly data = inject(ORBIT_TOAST_DATA);
  protected readonly ref = inject(ORBIT_TOAST_REF);
  protected readonly i18n = inject(ORBIT_I18N);

  protected readonly icon = computed(() => TONE_ICON[this.data.tone]);

  onMouseEnter(): void {
    this.ref.pauseAutoDismiss();
  }

  onMouseLeave(): void {
    this.ref.resumeAutoDismiss();
  }

  dismiss(): void {
    this.ref.dismiss();
  }
}
