import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTableColumnComponent } from './table-column.component';

describe('OrbitTableColumnComponent', () => {
  let fixture: ComponentFixture<OrbitTableColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitTableColumnComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitTableColumnComponent);
  });

  it('has no aria-sort when not sortable', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBeNull();
  });

  it('reports aria-sort "none" when sortable with no current direction', () => {
    fixture.componentRef.setInput('sortable', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBe('none');
  });

  it('reports aria-sort "ascending"/"descending" matching sortDirection', () => {
    fixture.componentRef.setInput('sortable', true);
    fixture.componentRef.setInput('sortDirection', 'asc');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBe('ascending');

    fixture.componentRef.setInput('sortDirection', 'desc');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBe('descending');
  });

  it('emits "asc" on click when currently unsorted, and toggles thereafter', () => {
    fixture.componentRef.setInput('sortable', true);
    fixture.detectChanges();

    let emitted: string | undefined;
    fixture.componentInstance.sortChange.subscribe((dir) => (emitted = dir));

    fixture.nativeElement.click();
    expect(emitted).toBe('asc');

    fixture.componentRef.setInput('sortDirection', 'asc');
    fixture.detectChanges();
    fixture.nativeElement.click();
    expect(emitted).toBe('desc');
  });

  it('does not emit sortChange when not sortable', () => {
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.sortChange.subscribe(() => (emitted = true));
    fixture.nativeElement.click();
    expect(emitted).toBe(false);
  });
});
