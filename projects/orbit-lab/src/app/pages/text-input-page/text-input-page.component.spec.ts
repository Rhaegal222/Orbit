import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TextInputPageComponent } from './text-input-page.component';

describe('TextInputPageComponent', () => {
  let fixture: ComponentFixture<TextInputPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TextInputPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one example per supported type', () => {
    const examples = fixture.nativeElement.querySelectorAll('[data-type-example]');
    expect(examples.length).toBe(8);
  });

  it('marks the invalid example as invalid via the host class', () => {
    const el = fixture.nativeElement.querySelector('[data-example="invalid"] orbit-text-input');
    expect(el.classList.contains('orbit-input--invalid')).toBe(true);
  });

  it('disables the native input in the disabled example via a disabled FormControl', () => {
    const input = fixture.nativeElement.querySelector('[data-example="disabled"] input');
    expect(input.disabled).toBe(true);
  });

  it('shows the password visibility toggle for the password type example', () => {
    const toggle = fixture.nativeElement.querySelector(
      '[data-type-example="password"] .orbit-input__action',
    );
    expect(toggle.getAttribute('aria-label')).toBe('Mostra password');
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-text-input',
    );
  });
});
