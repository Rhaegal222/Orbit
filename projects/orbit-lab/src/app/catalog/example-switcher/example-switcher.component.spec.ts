import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LabExampleSwitcherComponent } from './example-switcher.component';
import type { LabExampleSwitcherItem } from './example-switcher.types';

const ITEMS: readonly LabExampleSwitcherItem[] = [
  { value: 'portfolio', label: 'Portafoglio catalogo', badge: 'Tabella' },
  { value: 'dossier', label: 'Dossier prodotto', badge: 'Workspace' },
];

describe('LabExampleSwitcherComponent', () => {
  let fixture: ComponentFixture<LabExampleSwitcherComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabExampleSwitcherComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LabExampleSwitcherComponent);
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('selected', 'portfolio');
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function clickTrigger(): void {
    (
      fixture.nativeElement.querySelector(
        '.lab-example-switcher__actions orbit-button button',
      ) as HTMLElement
    ).click();
    fixture.detectChanges();
  }

  it('shows the current example label and badge', () => {
    expect(fixture.nativeElement.textContent).toContain('Portafoglio catalogo');
    expect(fixture.nativeElement.textContent).toContain('Tabella');
  });

  it('opens the offcanvas sidebar switcher by default', () => {
    clickTrigger();

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.querySelector('lab-example-switcher-sidebar-content')).toBeTruthy();
  });

  it('opens the modal switcher after toggling to modal mode', () => {
    const gridToggle = fixture.nativeElement.querySelectorAll(
      'orbit-icon-button button',
    )[1] as HTMLElement;
    gridToggle.click();
    fixture.detectChanges();

    clickTrigger();

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.querySelector('lab-example-switcher-modal')).toBeTruthy();
  });

  it('emits selectedChange with the value chosen in the offcanvas', () => {
    let emitted: string | undefined;
    fixture.componentInstance.selectedChange.subscribe((value: string) => (emitted = value));

    clickTrigger();
    const overlay = overlayContainer.getContainerElement();
    const dossierButton = [...overlay.querySelectorAll('button.orbit-sidebar__item')].find(
      (button) => button.textContent?.includes('Dossier prodotto'),
    ) as HTMLElement;
    dossierButton.click();
    fixture.detectChanges();

    expect(emitted).toBe('dossier');
  });
});
