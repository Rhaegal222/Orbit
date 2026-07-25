import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BreadcrumbPageComponent } from './breadcrumb-page.component';

describe('BreadcrumbPageComponent', () => {
  let fixture: ComponentFixture<BreadcrumbPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BreadcrumbPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the short example without collapsing', () => {
    expect(
      fixture.nativeElement.querySelectorAll('[data-example="short"] .orbit-breadcrumb__item')
        .length,
    ).toBe(3);
  });

  it('renders the long example collapsed', () => {
    expect(
      fixture.nativeElement.querySelector('[data-example="long"] .orbit-breadcrumb__ellipsis'),
    ).toBeTruthy();
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-breadcrumb',
    );
  });
});
