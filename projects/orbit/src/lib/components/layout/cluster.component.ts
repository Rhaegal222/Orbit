import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ORBIT_LAYOUT_GAPS, type OrbitLayoutGap } from './layout.types';

@Component({
  selector: 'orbit-cluster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './cluster.component.css',
  host: {
    '[style.--orbit-layout-cluster-gap]': 'gapValue()',
    '[style.align-items]': 'align()',
    '[style.justify-content]': 'justifyValue()',
  },
})
export class OrbitClusterComponent {
  gap = input<OrbitLayoutGap>('sm');
  align = input<'start' | 'center' | 'end' | 'stretch'>('center');
  justify = input<'start' | 'center' | 'end' | 'between'>('start');
  protected gapValue(): string {
    return ORBIT_LAYOUT_GAPS[this.gap()];
  }
  protected justifyValue(): string {
    return this.justify() === 'between' ? 'space-between' : this.justify();
  }
}
