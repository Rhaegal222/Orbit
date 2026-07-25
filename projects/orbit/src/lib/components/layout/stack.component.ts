import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ORBIT_LAYOUT_GAPS, type OrbitLayoutGap } from './layout.types';

@Component({
  selector: 'orbit-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './stack.component.css',
  host: { '[style.--orbit-layout-stack-gap]': 'gapValue()', '[style.align-items]': 'align()' },
})
export class OrbitStackComponent {
  gap = input<OrbitLayoutGap>('md');
  align = input<'stretch' | 'start' | 'center' | 'end'>('stretch');
  protected gapValue(): string {
    return ORBIT_LAYOUT_GAPS[this.gap()];
  }
}
