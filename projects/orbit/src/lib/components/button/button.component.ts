import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type OrbitButtonTone = 'primary' | 'success' | 'danger' | 'neutral';
export type OrbitButtonVariant = 'solid' | 'soft' | 'translucent' | 'outline' | 'flat';

@Component({
  selector: 'orbit-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  host: {
    '[class.orbit-button-host--icon-only]': 'iconOnly()',
  },
})
export class OrbitButtonComponent {
  label = input('');
  variant = input<OrbitButtonVariant>('solid');
  tone = input<OrbitButtonTone>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  iconOnly = input(false, { transform: booleanAttribute });
  icon = input('');
  ariaLabel = input('');

  clicked = output<void>();

  onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
