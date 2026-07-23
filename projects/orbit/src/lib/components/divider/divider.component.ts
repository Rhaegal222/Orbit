import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './divider.component.css',
  host: { '[class.orbit-divider--dashed]': "variant() === 'dashed'" },
})
export class OrbitDividerComponent {
  variant = input<'solid' | 'dashed'>('solid');
}
