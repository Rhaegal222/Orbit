import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitPaginationComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-pagination-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitPaginationComponent, LabExampleComponent],
  templateUrl: './pagination-page.component.html',
})
export class PaginationPageComponent {
  currentPage = 1;
  protected readonly totalPages = 10;

  protected middlePage = 5;
  protected lastPage = 20;
  protected readonly manyPages = 20;

  protected readonly usageSnippet =
    '<orbit-pagination [currentPage]="currentPage" [totalPages]="totalPages" (pageChange)="currentPage = $event" />';

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onMiddlePageChange(page: number): void {
    this.middlePage = page;
  }

  onLastPageChange(page: number): void {
    this.lastPage = page;
  }
}
