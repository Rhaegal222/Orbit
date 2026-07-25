import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ChipPageComponent } from './chip-page.component';

describe('ChipPageComponent', () => {
  let fixture: ComponentFixture<ChipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ChipPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('toggles selected in the selectable example', () => {
    const chipBody = fixture.nativeElement.querySelector(
      '[data-example="selectable"] .orbit-chip__body',
    );
    expect(fixture.componentInstance.selected).toBe(false);
    chipBody.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected).toBe(true);
  });

  it('removes an item from the removable example without toggling selection', () => {
    const initialCount = fixture.nativeElement.querySelectorAll(
      '[data-example="removable"] orbit-chip',
    ).length;
    fixture.nativeElement.querySelector('[data-example="removable"] .orbit-chip__remove').click();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('[data-example="removable"] orbit-chip').length,
    ).toBe(initialCount - 1);
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-chip',
    );
  });
});
