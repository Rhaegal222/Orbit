import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Compositional, focus-trapped modal surface for an Orbit CDK dialog overlay. */
@Component({
  selector: 'orbit-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule],
  template: `<section
    class="orbit-modal"
    role="dialog"
    aria-modal="true"
    cdkTrapFocus
    cdkTrapFocusAutoCapture
    [class.orbit-modal--sm]="size() === 'sm'"
    [class.orbit-modal--lg]="size() === 'lg'"
    [class.orbit-modal--xl]="size() === 'xl'"
    [class.orbit-modal--xxl]="size() === 'xxl'"
    [attr.aria-labelledby]="labelledBy() || null"
    [attr.aria-describedby]="describedBy() || null"
  >
    <ng-content />
  </section>`,
  styleUrl: './modal.component.css',
})
export class OrbitModalComponent {
  labelledBy = input('');
  describedBy = input('');
  /** `sm` confirmations, `md` linear forms, `lg`–`xxl` multi-column work. */
  size = input<'sm' | 'md' | 'lg' | 'xl' | 'xxl'>('md');
}
