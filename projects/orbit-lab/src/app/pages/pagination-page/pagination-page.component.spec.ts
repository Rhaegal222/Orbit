import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PaginationPageComponent } from './pagination-page.component';

describe('PaginationPageComponent', () => {
  let fixture: ComponentFixture<PaginationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PaginationPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('advances the current page in the base example when next is clicked', () => {
    expect(fixture.componentInstance.currentPage).toBe(1);
    fixture.nativeElement.querySelector('[data-example="base"] .orbit-pagination__next').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.currentPage).toBe(2);
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-pagination',
    );
  });
});
