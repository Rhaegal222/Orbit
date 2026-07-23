import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LabShellComponent } from './lab-shell.component';
import { CATALOG_ENTRIES } from '../catalog/catalog';

describe('LabShellComponent', () => {
  let fixture: ComponentFixture<LabShellComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabShellComponent],
      providers: [provideRouter([{ path: 'badge', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(LabShellComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders every catalog entry as a sidebar item', () => {
    const items = fixture.nativeElement.querySelectorAll(
      'orbit-sidebar button.orbit-sidebar__item',
    );
    expect(items.length).toBe(CATALOG_ENTRIES.length);
  });

  it('keeps the sidebar footer disabled in the application shell', () => {
    expect(fixture.nativeElement.querySelector('.orbit-sidebar__footer')).toBeNull();
  });

  it('switches to a centered mobile preview without the sidebar, keeping the options action', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('orbit-sidebar')).toBeNull();
    expect(fixture.nativeElement.querySelector('.lab-shell__phone')).toBeTruthy();
    expect(
      fixture.nativeElement
        .querySelector('.lab-shell__body')
        .classList.contains('lab-shell__body--mobile-preview'),
    ).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Vista desktop');
    expect(fixture.nativeElement.textContent).toContain('Opzioni');
  });

  it('shows device and orientation toggles only in mobile preview', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Vista tablet');
    expect(fixture.nativeElement.textContent).not.toContain('Ruota orizzontale');

    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Vista tablet');
    expect(fixture.nativeElement.textContent).toContain('Ruota orizzontale');
  });

  it('toggles device and orientation state via header buttons', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    const findButton = (label: string) =>
      [...fixture.nativeElement.querySelectorAll('orbit-button')].find((button: HTMLElement) =>
        button.textContent?.includes(label),
      ) as HTMLElement;

    findButton('Vista tablet').querySelector('button')?.click();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.lab-shell__phone').getAttribute('data-lab-device'),
    ).toBe('tablet');
    expect(fixture.nativeElement.textContent).toContain('Vista smartphone');

    findButton('Ruota orizzontale').querySelector('button')?.click();
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('.lab-shell__phone')
        .getAttribute('data-lab-orientation'),
    ).toBe('landscape');
    expect(fixture.nativeElement.textContent).toContain('Ruota verticale');
  });

  it('toggles touch mode without blocking interaction, showing a following cursor instead', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    const screen = () => fixture.nativeElement.querySelector('.lab-shell__phone-screen');
    expect(screen().classList.contains('lab-shell__phone-screen--touch')).toBe(false);
    expect(fixture.nativeElement.querySelector('.lab-shell__phone-touch-cursor')).toBeNull();

    const findButton = (label: string) =>
      [...fixture.nativeElement.querySelectorAll('orbit-button')].find((button: HTMLElement) =>
        button.textContent?.includes(label),
      ) as HTMLElement;

    findButton('Modalità tocco').querySelector('button')?.click();
    fixture.detectChanges();

    expect(screen().classList.contains('lab-shell__phone-screen--touch')).toBe(true);
    expect(fixture.nativeElement.querySelector('.lab-shell__phone-touch-cursor')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Modalità hover');

    findButton('Modalità hover').querySelector('button')?.click();
    fixture.detectChanges();

    expect(screen().classList.contains('lab-shell__phone-screen--touch')).toBe(false);
    expect(fixture.nativeElement.querySelector('.lab-shell__phone-touch-cursor')).toBeNull();
  });

  it('drags the device viewport to scroll instead of forwarding a click to the content below', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.componentInstance.toggleTouchMode();
    fixture.detectChanges();

    const viewport = fixture.nativeElement.querySelector(
      '.lab-shell__phone-viewport',
    ) as HTMLElement;
    viewport.setPointerCapture = vi.fn();
    viewport.hasPointerCapture = vi.fn().mockReturnValue(true);
    viewport.releasePointerCapture = vi.fn();
    Object.defineProperty(viewport, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(viewport, 'clientHeight', { value: 500, configurable: true });
    viewport.scrollTop = 0;

    const button = document.createElement('button');
    viewport.appendChild(button);
    const clickSpy = vi.fn();
    button.addEventListener('click', clickSpy);

    const down = new PointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 300 });
    viewport.dispatchEvent(down);

    const move = new PointerEvent('pointermove', { pointerId: 1, clientX: 100, clientY: 200 });
    viewport.dispatchEvent(move);

    expect(viewport.scrollTop).toBe(100);

    const up = new PointerEvent('pointerup', { pointerId: 1, clientX: 100, clientY: 200 });
    viewport.dispatchEvent(up);

    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('renders an icon for every sidebar item so the collapsed view is never empty', () => {
    const icons = fixture.nativeElement.querySelectorAll('orbit-sidebar .orbit-sidebar__item-icon');
    expect(icons.length).toBe(CATALOG_ENTRIES.length);
  });

  it('filters the sidebar items as the search box changes', () => {
    fixture.componentInstance.searchControl.setValue('badge');
    fixture.detectChanges();

    const items = [
      ...fixture.nativeElement.querySelectorAll('orbit-sidebar button.orbit-sidebar__item'),
    ] as HTMLElement[];
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Badge');
  });

  it('shows no sidebar items when the search matches nothing', () => {
    fixture.componentInstance.searchControl.setValue('zzz-no-match');
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll(
      'orbit-sidebar button.orbit-sidebar__item',
    );
    expect(items.length).toBe(0);
  });

  it('navigates to the selected catalog entry route', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.onSidebarItemSelected({ id: 'badge', label: 'Badge' });

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'badge']);
  });

  it('opens theme and density options in a right offcanvas', () => {
    const optionsButton = [...fixture.nativeElement.querySelectorAll('orbit-button')].find(
      (button: HTMLElement) => button.textContent?.includes('Opzioni'),
    ) as HTMLElement;
    optionsButton.querySelector('button')?.click();
    fixture.detectChanges();

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.querySelector('.orbit-panel--right')).toBeTruthy();
    expect(overlay.querySelectorAll('.lab-catalog-panel__field')).toHaveLength(7);
  });

  it('opens the Google Fonts dialog from the catalog options', () => {
    fixture.componentInstance.openGoogleFonts();
    fixture.detectChanges();

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.querySelector('lab-google-fonts-dialog')).toBeTruthy();
    expect(overlay.textContent).toContain('Aggiungi Google Fonts');
  });

  it('applies an option selected in the right offcanvas to the Lab surface', () => {
    const optionsButton = [...fixture.nativeElement.querySelectorAll('orbit-button')].find(
      (button: HTMLElement) => button.textContent?.includes('Opzioni'),
    ) as HTMLElement;
    optionsButton.querySelector('button')?.click();

    const themeTrigger = overlayContainer
      .getContainerElement()
      .querySelector(
        '.lab-catalog-panel__field orbit-select .orbit-select__trigger',
      ) as HTMLButtonElement;
    themeTrigger.click();
    fixture.detectChanges();
    const darkOption = [
      ...overlayContainer.getContainerElement().querySelectorAll('.orbit-select__option'),
    ].find((option) => option.textContent?.includes('Scuro')) as HTMLButtonElement;
    darkOption.click();
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-theme')).toBe('dark');
  });

  it('defaults to default theme and comfortable density', () => {
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-theme')).toBeNull();
    expect(container.getAttribute('data-orbit-density')).toBe('comfortable');
    expect(fixture.nativeElement.getAttribute('data-orbit-shape')).toBe('soft');
  });

  it('applies dark theme attribute when selected', () => {
    fixture.componentInstance.setTheme('dark');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-theme')).toBe('dark');
    expect(fixture.nativeElement.getAttribute('data-orbit-theme')).toBe('dark');
  });

  it('applies the selected shadow intensity to the shared shadow token scope', () => {
    fixture.componentInstance.setShadowIntensity('0');
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('data-orbit-shadow-intensity')).toBe('0');
  });

  it('applies the selected shape to the shared geometry token scope', () => {
    fixture.componentInstance.setShape('square');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-shape')).toBe('square');
    expect(fixture.nativeElement.getAttribute('data-orbit-shape')).toBe('square');
  });

  it('applies the motion setting to the document so overlays are covered too', () => {
    fixture.componentInstance.setMotionEnabled(false);
    fixture.detectChanges();

    expect(document.body.getAttribute('data-orbit-motion')).toBe('off');
  });

  it('applies compact density attribute when selected', () => {
    fixture.componentInstance.setDensity('compact');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-density')).toBe('compact');
    expect(fixture.nativeElement.getAttribute('data-orbit-density')).toBe('compact');
  });

  it('applies spacious and dense density attributes when selected', () => {
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    fixture.componentInstance.setDensity('spacious');
    fixture.detectChanges();
    expect(container.getAttribute('data-orbit-density')).toBe('spacious');

    fixture.componentInstance.setDensity('dense');
    fixture.detectChanges();
    expect(container.getAttribute('data-orbit-density')).toBe('dense');
  });

  it('applies one text-scale value to the Lab surface', () => {
    fixture.componentInstance.setTextScale('1.25');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.style.getPropertyValue('--orbit-text-scale')).toBe('1.25');
    expect(container.style.getPropertyValue('--orbit-optional-icon-display')).toBe('none');
  });

  it('applies the selected font stack to the Lab surface', () => {
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    const publicSansStack = container.style.getPropertyValue('--orbit-font-sans');

    fixture.componentInstance.setFont('inter');
    fixture.detectChanges();
    const interStack = container.style.getPropertyValue('--orbit-font-sans');

    expect(publicSansStack).toContain('Public Sans');
    expect(interStack).toContain('Inter');
    expect(interStack).not.toBe(publicSansStack);
  });
});
