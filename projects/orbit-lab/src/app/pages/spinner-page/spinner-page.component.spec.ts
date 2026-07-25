import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { SpinnerPageComponent } from './spinner-page.component';

describe('SpinnerPageComponent', () => {
  let fixture: ComponentFixture<SpinnerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SpinnerPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the sm example at the sm size', () => {
    const spinner = fixture.nativeElement.querySelector(
      '[data-example="sm"] .orbit-spinner',
    ) as HTMLElement;
    expect(spinner.classList.contains('orbit-spinner--sm')).toBe(true);
  });

  it('renders the md example at the md size', () => {
    const spinner = fixture.nativeElement.querySelector(
      '[data-example="md"] .orbit-spinner',
    ) as HTMLElement;
    expect(spinner.classList.contains('orbit-spinner--md')).toBe(true);
  });

  it('renders the lg example at the lg size', () => {
    const spinner = fixture.nativeElement.querySelector(
      '[data-example="lg"] .orbit-spinner',
    ) as HTMLElement;
    expect(spinner.classList.contains('orbit-spinner--lg')).toBe(true);
  });

  it('renders a custom aria-label example', () => {
    const spinner = fixture.nativeElement.querySelector(
      '[data-example="custom-label"] .orbit-spinner',
    ) as HTMLElement;
    expect(spinner.getAttribute('aria-label')).toBe('Caricamento allegato in corso');
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-spinner',
    );
  });
});
