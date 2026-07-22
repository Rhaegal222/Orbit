import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { PopoverPageComponent } from './popover-page.component';

describe('PopoverPageComponent', () => {
  let fixture: ComponentFixture<PopoverPageComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PopoverPageComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('opens the popover content on trigger click', () => {
    fixture.nativeElement.querySelector('.orbit-popover__trigger').click();
    fixture.detectChanges();

    const overlayEl = overlayContainer.getContainerElement();
    expect(overlayEl.textContent).toContain('Testo del popover');
  });
});
