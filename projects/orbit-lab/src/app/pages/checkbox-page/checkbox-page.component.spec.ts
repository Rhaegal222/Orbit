import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { CheckboxPageComponent } from './checkbox-page.component';

describe('CheckboxPageComponent', () => {
  let fixture: ComponentFixture<CheckboxPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckboxPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the base example unchecked', () => {
    const input = fixture.nativeElement.querySelector('[data-example="base"] input');
    expect(input.checked).toBe(false);
  });

  it('renders the checked example checked', () => {
    const input = fixture.nativeElement.querySelector('[data-example="checked"] input');
    expect(input.checked).toBe(true);
  });

  it('disables the native input in the disabled example via a disabled FormControl', () => {
    const input = fixture.nativeElement.querySelector('[data-example="disabled"] input');
    expect(input.disabled).toBe(true);
  });

  it('documents that the plain disabled input is dead (Core note)', () => {
    expect(fixture.nativeElement.textContent).toContain('non è collegato a nulla nel template');
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-checkbox',
    );
  });
});
