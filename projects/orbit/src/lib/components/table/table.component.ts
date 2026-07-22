import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orbit-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<table class="orbit-table"><ng-content /></table>`,
  styleUrl: './table.component.css',
})
export class OrbitTableComponent {}
