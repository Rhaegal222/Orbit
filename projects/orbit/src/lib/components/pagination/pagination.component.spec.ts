import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitPaginationComponent } from './pagination.component';

describe('OrbitPaginationComponent', () => {
  let fixture: ComponentFixture<OrbitPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitPaginationComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitPaginationComponent);
  });

  function pageButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.orbit-pagination__page'));
  }

  it('creates', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows first, last, current and adjacent pages, collapsing the rest at the start', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const labels = pageButtons().map((b) => b.textContent?.trim());
    expect(labels).toEqual(['1', '2', '10']);
    expect(fixture.nativeElement.querySelectorAll('.orbit-pagination__ellipsis').length).toBe(1);
  });

  it('shows first, last, current and adjacent pages, collapsing both sides in the middle', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const labels = pageButtons().map((b) => b.textContent?.trim());
    expect(labels).toEqual(['1', '4', '5', '6', '10']);
    expect(fixture.nativeElement.querySelectorAll('.orbit-pagination__ellipsis').length).toBe(2);
  });

  it('shows first, last, current and adjacent pages, collapsing the rest at the end', () => {
    fixture.componentRef.setInput('currentPage', 10);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const labels = pageButtons().map((b) => b.textContent?.trim());
    expect(labels).toEqual(['1', '9', '10']);
    expect(fixture.nativeElement.querySelectorAll('.orbit-pagination__ellipsis').length).toBe(1);
  });

  it('renders no ellipsis when every page fits', () => {
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('totalPages', 4);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.orbit-pagination__ellipsis').length).toBe(0);
    expect(pageButtons().map((b) => b.textContent?.trim())).toEqual(['1', '2', '3', '4']);
  });

  it('disables the previous button on the first page', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const prev = fixture.nativeElement.querySelector('.orbit-pagination__prev') as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
  });

  it('disables the next button on the last page', () => {
    fixture.componentRef.setInput('currentPage', 10);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const next = fixture.nativeElement.querySelector('.orbit-pagination__next') as HTMLButtonElement;
    expect(next.disabled).toBe(true);
  });

  it('emits pageChange with the clicked page number', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    let emitted: number | undefined;
    fixture.componentInstance.pageChange.subscribe((page) => (emitted = page));
    pageButtons()[1].click();
    expect(emitted).toBe(4);
  });

  it('emits pageChange(currentPage - 1) when previous is clicked', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    let emitted: number | undefined;
    fixture.componentInstance.pageChange.subscribe((page) => (emitted = page));
    fixture.nativeElement.querySelector('.orbit-pagination__prev').click();
    expect(emitted).toBe(4);
  });

  it('emits pageChange(currentPage + 1) when next is clicked', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    let emitted: number | undefined;
    fixture.componentInstance.pageChange.subscribe((page) => (emitted = page));
    fixture.nativeElement.querySelector('.orbit-pagination__next').click();
    expect(emitted).toBe(6);
  });

  it('marks the current page with aria-current', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(current.textContent.trim()).toBe('5');
  });
});
