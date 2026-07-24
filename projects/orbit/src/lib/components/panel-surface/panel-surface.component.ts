import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Visual shell for content opened through OrbitPanelService — the offcanvas analogue of orbit-modal. */
@Component({
  selector: 'orbit-panel-surface',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule],
  template: `<section
    class="orbit-panel-surface"
    role="dialog"
    aria-modal="true"
    cdkTrapFocus
    cdkTrapFocusAutoCapture
    [attr.aria-labelledby]="labelledBy() || null"
    [attr.aria-label]="labelledBy() ? null : ariaLabel() || null"
    [attr.aria-describedby]="describedBy() || null"
  >
    <ng-content />
  </section>`,
  styleUrl: './panel-surface.component.css',
})
export class OrbitPanelSurfaceComponent {
  labelledBy = input('');
  ariaLabel = input('');
  describedBy = input('');
}
