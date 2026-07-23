import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-tab-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './tab-panel.component.css',
  host: {
    role: 'tabpanel',
    '[id]': '"orbit-tab-panel-" + value()',
    '[attr.aria-labelledby]': '"orbit-tab-" + value()',
    tabindex: '0',
  },
})
export class OrbitTabPanelComponent {
  value = input.required<string>();
}
