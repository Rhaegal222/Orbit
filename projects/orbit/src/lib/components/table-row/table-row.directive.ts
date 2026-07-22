import { booleanAttribute, Directive, input } from '@angular/core';

@Directive({
  selector: '[orbitTableRow]',
  standalone: true,
  host: {
    '[class.orbit-table-row--disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled() || null',
  },
})
export class OrbitTableRowDirective {
  disabled = input(false, { transform: booleanAttribute });
}
