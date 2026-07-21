import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type OrbitBadgeTone = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

@Component({
  selector: 'orbit-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
})
export class OrbitBadgeComponent {
  tone = input<OrbitBadgeTone>('neutral');
  label = input('');
}
