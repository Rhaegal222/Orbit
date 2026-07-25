import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'orbit-table-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent],
  templateUrl: './table-column.component.html',
  styleUrl: './table-column.component.css',
  host: {
    '[class.orbit-table-column--sortable]': 'sortable()',
    '[attr.aria-sort]': 'ariaSort()',
    '(click)': 'onClick()',
  },
})
export class OrbitTableColumnComponent {
  sortable = input(false, { transform: booleanAttribute });
  sortDirection = input<'asc' | 'desc' | null>(null);
  sortChange = output<'asc' | 'desc'>();

  protected readonly ariaSort = computed(() => {
    if (!this.sortable()) return null;
    if (this.sortDirection() === 'asc') return 'ascending';
    if (this.sortDirection() === 'desc') return 'descending';
    return 'none';
  });

  onClick(): void {
    if (!this.sortable()) return;
    this.sortChange.emit(this.sortDirection() === 'asc' ? 'desc' : 'asc');
  }
}
