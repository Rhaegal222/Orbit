import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FormFieldPageComponent } from './form-field-page.component';

describe('FormFieldPageComponent', () => {
  let fixture: ComponentFixture<FormFieldPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FormFieldPageComponent);
    fixture.detectChanges();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders a hint example and an error example', () => {
    expect(
      fixture.nativeElement.querySelector('[data-example="hint"] .orbit-form-field__hint'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('[data-example="error"] .orbit-form-field__error'),
    ).toBeTruthy();
  });

  it('associates the label with the control via inputId/for', () => {
    const label = fixture.nativeElement.querySelector('[data-example="base"] label');
    const input = fixture.nativeElement.querySelector('[data-example="base"] input');
    expect(label.getAttribute('for')).toBe(input.id);
  });
});
