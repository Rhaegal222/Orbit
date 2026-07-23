import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FormSectionPageComponent } from './form-section-page.component';

describe('FormSectionPageComponent', () => {
  let fixture: ComponentFixture<FormSectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSectionPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FormSectionPageComponent);
    fixture.detectChanges();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders a titled and a divided example', () => {
    expect(
      fixture.nativeElement.querySelector('[data-example="titled"] .orbit-form-section__title'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('[data-example="divided"] .orbit-form-section--divided'),
    ).toBeTruthy();
  });

  it('renders a collapsible example with an accessible toggle button', () => {
    const button = fixture.nativeElement.querySelector(
      '[data-example="collapsible"] .orbit-form-section__toggle',
    );
    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const bodyId = button.getAttribute('aria-controls');
    const body = fixture.nativeElement.querySelector(`#${bodyId}`);
    expect(body).toBeTruthy();
    expect(body.getAttribute('role')).toBe('region');
  });

  it('collapses the body and flips aria-expanded on click', () => {
    const button = fixture.nativeElement.querySelector(
      '[data-example="collapsible"] .orbit-form-section__toggle',
    );
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    const bodyId = button.getAttribute('aria-controls');
    const body = fixture.nativeElement.querySelector(`#${bodyId}`);
    expect(body.getAttribute('aria-hidden')).toBe('true');
    expect(body.classList.contains('orbit-form-section__body--collapsed')).toBe(true);
  });
});
