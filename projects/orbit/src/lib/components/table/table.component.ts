import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<table
    class="orbit-table"
    [class.orbit-table--bordered]="bordered()"
    [class.orbit-table--striped]="striped()"
  ><ng-content /></table>`,
  styleUrl: './table.component.css',
})
export class OrbitTableComponent {
  bordered = input(false, { transform: booleanAttribute });
  striped = input(false, { transform: booleanAttribute });
}
