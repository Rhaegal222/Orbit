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

  it('renders the interactive navigation sidebar preview inline', () => {
    const preview = fixture.nativeElement.querySelector('.panel-page__sidebar-preview');

    expect(preview.querySelector('orbit-sidebar')).toBeTruthy();
    expect(preview.querySelectorAll('orbit-selectable-tile').length).toBe(11);
    expect(preview.textContent).toContain('Con badge');
    expect(preview.textContent).toContain('Disabilitato');
    expect(preview.textContent).toContain('Con header');
    expect(preview.textContent).toContain('Senza header');
    expect(preview.textContent).toContain('Con footer');
    expect(preview.textContent).toContain('Senza footer');
  });

  it('hides the sidebar header and footer from their preview controls', () => {
    const preview = fixture.nativeElement.querySelector('.panel-page__sidebar-preview') as HTMLElement;
    const clickTile = (label: string) => {
      const tile = [...preview.querySelectorAll('orbit-selectable-tile')].find((element) =>
        element.textContent?.includes(label),
      ) as HTMLElement;
      tile.querySelector('button')?.click();
      fixture.detectChanges();
    };

    clickTile('Senza header');
    expect(preview.querySelector('.orbit-sidebar__header')).toBeNull();

    clickTile('Senza footer');
    expect(preview.querySelector('.orbit-sidebar__footer')).toBeNull();
  });

  it('opens the offcanvas panel on the overlay when "Apri da destra" is clicked', () => {
    const openButton = Array.from(fixture.nativeElement.querySelectorAll('orbit-button button')).find((btn) =>
      (btn as HTMLButtonElement).textContent?.includes('Apri da destra'),
    ) as HTMLButtonElement;
    openButton.click();
    fixture.detectChanges();

    const overlayEl = overlayContainer.getContainerElement();
    expect(overlayEl.querySelector('orbit-panel-surface')).toBeTruthy();
    expect(overlayEl.querySelector('orbit-modal-header')).toBeTruthy();
    expect(overlayEl.querySelector('orbit-modal-body')).toBeTruthy();
    expect(overlayEl.querySelector('orbit-modal-footer')).toBeTruthy();
    expect(overlayEl.textContent).toContain('Dettaglio');
  });
});
