import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TablePageComponent } from './table-page.component';

describe('TablePageComponent', () => {
  let fixture: ComponentFixture<TablePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TablePageComponent] }).compileComponents();
    fixture = TestBed.createComponent(TablePageComponent);
    fixture.detectChanges();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders one row per record with the inactive one marked disabled', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    const disabledRow = Array.from(rows).find(
      (row) => (row as HTMLElement).getAttribute('data-row-disabled') === 'true',
    ) as HTMLElement;
    expect(disabledRow.classList.contains('orbit-table-row--disabled')).toBe(true);
  });

  it('re-sorts rows alphabetically on column click, toggling direction', () => {
    const columnHeader = fixture.nativeElement.querySelector('orbit-table-column');
    columnHeader.click();
    fixture.detectChanges();

    let names = Array.from(fixture.nativeElement.querySelectorAll('tbody tr td:first-child')).map(
      (td) => (td as HTMLElement).textContent,
    );
    expect(names).toEqual(['Anna Verdi', 'Luca Bianchi', 'Mario Rossi']);

    columnHeader.click();
    fixture.detectChanges();
    names = Array.from(fixture.nativeElement.querySelectorAll('tbody tr td:first-child')).map(
      (td) => (td as HTMLElement).textContent,
    );
    expect(names).toEqual(['Mario Rossi', 'Luca Bianchi', 'Anna Verdi']);
  });
});
