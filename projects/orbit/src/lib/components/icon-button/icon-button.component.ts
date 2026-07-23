import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import type { OrbitIconName } from '../../icons/icon-registry';

export type OrbitIconButtonTone = 'primary' | 'neutral' | 'danger';

@Component({
  selector: 'orbit-icon-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.css',
})
export class OrbitIconButtonComponent {
  icon = input<OrbitIconName | null>(null);
  ariaLabel = input.required<string>();
  tone = input<OrbitIconButtonTone>('neutral');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false, { transform: booleanAttribute });

  clicked = output<void>();

  onClick(): void {
    if (!this.disabled()) this.clicked.emit();
  }
}
