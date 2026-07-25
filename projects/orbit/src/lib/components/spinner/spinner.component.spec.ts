import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { OrbitSpinnerComponent } from './spinner.component';

describe('OrbitSpinnerComponent', () => {
  let fixture: ComponentFixture<OrbitSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitSpinnerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitSpinnerComponent);
  });

  function spinner(): HTMLElement {
    return fixture.nativeElement.querySelector('.orbit-spinner') as HTMLElement;
  }

  it('defaults to the md size with role=status and the default i18n label', () => {
    fixture.detectChanges();

    expect(spinner().classList.contains('orbit-spinner--md')).toBe(true);
    expect(spinner().getAttribute('role')).toBe('status');
    expect(spinner().getAttribute('aria-label')).toBe('Operazione in corso');
  });

  it('applies the sm size class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect(spinner().classList.contains('orbit-spinner--sm')).toBe(true);
    expect(spinner().classList.contains('orbit-spinner--md')).toBe(false);
  });

  it('applies the lg size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(spinner().classList.contains('orbit-spinner--lg')).toBe(true);
    expect(spinner().classList.contains('orbit-spinner--md')).toBe(false);
  });

  it('applies the xl size class', () => {
    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();

    expect(spinner().classList.contains('orbit-spinner--xl')).toBe(true);
    expect(spinner().classList.contains('orbit-spinner--md')).toBe(false);
  });

  it('applies the xxl size class', () => {
    fixture.componentRef.setInput('size', 'xxl');
    fixture.detectChanges();

    expect(spinner().classList.contains('orbit-spinner--xxl')).toBe(true);
    expect(spinner().classList.contains('orbit-spinner--md')).toBe(false);
  });

  it('overrides the default aria-label when one is provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Caricamento allegato in corso');
    fixture.detectChanges();

    expect(spinner().getAttribute('aria-label')).toBe('Caricamento allegato in corso');
  });
});
