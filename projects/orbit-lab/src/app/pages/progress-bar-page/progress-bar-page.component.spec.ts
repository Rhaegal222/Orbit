import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ProgressBarPageComponent } from './progress-bar-page.component';

describe('ProgressBarPageComponent', () => {
  let fixture: ComponentFixture<ProgressBarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ProgressBarPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the initial value in the determinate example', () => {
    const bar = fixture.nativeElement.querySelector(
      '[data-example="determinate"] .orbit-progress-bar',
    ) as HTMLElement;
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
  });

  it('updates the progress bar when the control slider changes', () => {
    const control = fixture.nativeElement.querySelector(
      '[data-example="determinate"] input[type="range"]',
    ) as HTMLInputElement;

    control.value = '75';
    control.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const bar = fixture.nativeElement.querySelector(
      '[data-example="determinate"] .orbit-progress-bar',
    ) as HTMLElement;
    expect(bar.getAttribute('aria-valuenow')).toBe('75');
  });

  it('renders an indeterminate example with no aria-valuenow', () => {
    const bar = fixture.nativeElement.querySelector(
      '[data-example="indeterminate"] .orbit-progress-bar',
    ) as HTMLElement;
    expect(bar.classList.contains('orbit-progress-bar--indeterminate')).toBe(true);
    expect(bar.hasAttribute('aria-valuenow')).toBe(false);
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-progress-bar',
    );
  });
});
