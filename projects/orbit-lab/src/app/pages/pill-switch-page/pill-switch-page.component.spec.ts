import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PillSwitchPageComponent } from './pill-switch-page.component';

describe('PillSwitchPageComponent', () => {
  let fixture: ComponentFixture<PillSwitchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillSwitchPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PillSwitchPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('marks the initial value as checked in the base example', () => {
    const buttons = fixture.nativeElement.querySelectorAll('[data-example="base"] button');
    expect(buttons[0].getAttribute('aria-checked')).toBe('true');
  });

  it('disables every option button in the disabled example via a disabled FormControl', () => {
    const buttons = fixture.nativeElement.querySelectorAll('[data-example="disabled"] button');
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of Array.from(buttons) as HTMLButtonElement[]) {
      expect(button.disabled).toBe(true);
    }
  });

  it('disables the single "Mese" option in the base example via per-option disabled', () => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('[data-example="base"] button'),
    ) as HTMLButtonElement[];
    const monthButton = buttons.find((b) => b.textContent?.trim() === 'Mese');
    expect(monthButton?.disabled).toBe(true);
  });

  it('documents that the plain disabled input is wired correctly (unlike orbit-checkbox)', () => {
    expect(fixture.nativeElement.textContent).toContain('collegato correttamente al template');
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-pill-switch',
    );
  });
});
