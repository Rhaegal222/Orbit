import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  OrbitTableColumnComponent,
  OrbitTableComponent,
  OrbitTableRowDirective,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

interface Row {
  name: string;
  status: string;
  active: boolean;
}

@Component({
  selector: 'lab-table-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitTableComponent,
    OrbitTableColumnComponent,
    OrbitTableRowDirective,
    LabExampleComponent,
  ],
  templateUrl: './table-page.component.html',
})
export class TablePageComponent {
  protected readonly rows: Row[] = [
    { name: 'Mario Rossi', status: 'Attivo', active: true },
    { name: 'Luca Bianchi', status: 'Scaduto', active: false },
    { name: 'Anna Verdi', status: 'Attivo', active: true },
  ];

  protected readonly sortDirection = signal<'asc' | 'desc' | null>(null);

  protected readonly sortedRows = computed(() => {
    const direction = this.sortDirection();
    if (!direction) return this.rows;
    const sorted = [...this.rows].sort((a, b) => a.name.localeCompare(b.name));
    return direction === 'asc' ? sorted : sorted.reverse();
  });

  protected readonly snippet = `<orbit-table>
  <thead>
    <tr><th><orbit-table-column sortable [sortDirection]="dir" (sortChange)="dir = $event">Nome</orbit-table-column></th></tr>
  </thead>
  <tbody>
    @for (row of rows; track row.name) {
      <tr orbitTableRow [disabled]="!row.active">
        <td>{{ row.name }}</td>
      </tr>
    }
  </tbody>
</orbit-table>`;

  protected readonly borderedSnippet = '<orbit-table bordered>…</orbit-table>';
  protected readonly stripedSnippet = '<orbit-table striped>…</orbit-table>';
  protected readonly borderedStripedSnippet = '<orbit-table bordered striped>…</orbit-table>';

  onSortChange(direction: 'asc' | 'desc'): void {
    this.sortDirection.set(direction);
  }
}
