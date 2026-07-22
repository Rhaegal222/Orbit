import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { PanelPageComponent } from './panel-page.component';

describe('PanelPageComponent', () => {
  let fixture: ComponentFixture<PanelPageComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PanelPageComponent] }).compileComponents();
    fixture = TestBed.createComponent(PanelPageComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders a persistent sidebar panel inline', () => {
    expect(fixture.nativeElement.querySelector('orbit-panel')).toBeTruthy();
  });

  it('opens the offcanvas panel on the overlay when "Apri da destra" is clicked', () => {
    const openButton = Array.from(fixture.nativeElement.querySelectorAll('orbit-button button')).find((btn) =>
      (btn as HTMLButtonElement).textContent?.includes('Apri da destra'),
    ) as HTMLButtonElement;
    openButton.click();
    fixture.detectChanges();

    const overlayEl = overlayContainer.getContainerElement();
    expect(overlayEl.querySelector('orbit-panel-surface')).toBeTruthy();
    expect(overlayEl.textContent).toContain('Dettaglio');
  });
});
