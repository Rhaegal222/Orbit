import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ButtonPageComponent } from './button-page.component';

describe('ButtonPageComponent', () => {
  let fixture: ComponentFixture<ButtonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ButtonPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not show a blocked banner', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders every tone x variant combination as a real orbit-button', () => {
    const buttons = fixture.nativeElement.querySelectorAll('orbit-button');
    expect(buttons.length).toBeGreaterThanOrEqual(20);
    expect([...buttons].some((button) => button.querySelector('.orbit-btn--translucent'))).toBe(
      true,
    );
  });

  it('includes a disabled example', () => {
    expect(
      fixture.nativeElement.querySelector('[data-example="disabled"] orbit-button'),
    ).toBeTruthy();
  });

  it('includes a loading example', () => {
    expect(
      fixture.nativeElement.querySelector('[data-example="loading"] orbit-button'),
    ).toBeTruthy();
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    const snippet = fixture.nativeElement.querySelector('[data-code-block]');
    expect(snippet.textContent).toContain('<orbit-button');
  });
});
