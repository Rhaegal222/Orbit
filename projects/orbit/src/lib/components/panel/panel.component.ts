import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './panel.component.css',
  host: {
    class: 'orbit-panel',
    '[class.orbit-panel--no-padding]': "padding() === 'none'",
  },
})
export class OrbitPanelComponent {
  padding = input<'none' | 'default'>('default');
}
