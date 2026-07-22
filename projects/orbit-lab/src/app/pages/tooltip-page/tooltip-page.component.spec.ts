import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TooltipPageComponent } from './tooltip-page.component';

describe('TooltipPageComponent', () => {
  let fixture: ComponentFixture<TooltipPageComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TooltipPageComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('shows the tooltip text on focus', async () => {
    const button = fixture.nativeElement.querySelector('button[orbitTooltip]') as HTMLButtonElement;
    button.dispatchEvent(new FocusEvent('focus'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const overlayEl = overlayContainer.getContainerElement();
    expect(overlayEl.textContent).toContain('Testo del tooltip');
  });
});
