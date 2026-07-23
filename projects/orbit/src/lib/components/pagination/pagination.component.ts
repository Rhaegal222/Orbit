import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

type OrbitPaginationRangeItem = { type: 'page'; page: number } | { type: 'ellipsis'; id: string };

@Component({
  selector: 'orbit-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class OrbitPaginationComponent {
  protected readonly i18n = inject(ORBIT_I18N);

  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  protected readonly visiblePages = computed(() => this.computeRange(this.currentPage(), this.totalPages()));
  protected readonly isFirstPage = computed(() => this.currentPage() <= 1);
  protected readonly isLastPage = computed(() => this.currentPage() >= this.totalPages());

  rangeTrackId(entry: OrbitPaginationRangeItem): string {
    return entry.type === 'page' ? `page-${entry.page}` : entry.id;
  }

  goToPage(page: number): void {
    if (page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  goToPrevious(): void {
    if (this.isFirstPage()) return;
    this.pageChange.emit(this.currentPage() - 1);
  }

  goToNext(): void {
    if (this.isLastPage()) return;
    this.pageChange.emit(this.currentPage() + 1);
  }

  private computeRange(current: number, total: number): OrbitPaginationRangeItem[] {
    if (total <= 0) return [];
    const pages = new Set<number>();
    pages.add(1);
    pages.add(total);
    for (let page = current - 1; page <= current + 1; page++) {
      if (page >= 1 && page <= total) pages.add(page);
    }
    const sorted = [...pages].sort((a, b) => a - b);
    const result: OrbitPaginationRangeItem[] = [];
    let previous: number | null = null;
    for (const page of sorted) {
      if (previous !== null && page - previous > 1) {
        result.push({ type: 'ellipsis', id: `ellipsis-${previous}-${page}` });
      }
      result.push({ type: 'page', page });
      previous = page;
    }
    return result;
  }
}
