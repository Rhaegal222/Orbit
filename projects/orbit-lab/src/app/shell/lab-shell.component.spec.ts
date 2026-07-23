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

  it('shows the orientation toggle only in mobile preview', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Ruota orizzontale');

    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Ruota orizzontale');
  });

  it('toggles orientation state via the header button', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    const findButton = (label: string) =>
      [...fixture.nativeElement.querySelectorAll('orbit-button')].find((button: HTMLElement) =>
        button.textContent?.includes(label),
      ) as HTMLElement;

    findButton('Ruota orizzontale').querySelector('button')?.click();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.lab-shell__phone').getAttribute('data-lab-orientation'),
    ).toBe('landscape');
    expect(fixture.nativeElement.textContent).toContain('Ruota verticale');
  });

  it('defaults touch mode to on when entering mobile preview, blocking real hover via an overlay', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.lab-shell__phone-touch-overlay')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.lab-shell__phone-touch-cursor')).toBeTruthy();

    const touchModeTile = fixture.nativeElement.querySelector(
      '.lab-shell__touch-mode-tile button',
    ) as HTMLElement;
    expect(touchModeTile.getAttribute('aria-pressed')).toBe('true');

    touchModeTile.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.lab-shell__phone-touch-overlay')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.lab-shell__touch-mode-tile button')?.getAttribute('aria-pressed'),
    ).toBe('false');

    fixture.nativeElement.querySelector('.lab-shell__touch-mode-tile button')?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.lab-shell__phone-touch-overlay')).toBeTruthy();
  });

  it('turns touch mode off when leaving mobile preview, so it never blocks the desktop view', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lab-shell__phone-touch-overlay')).toBeTruthy();

    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.lab-shell__phone-touch-overlay')).toBeNull();

    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lab-shell__phone-touch-overlay')).toBeTruthy();
  });

  it('drags the device viewport to scroll instead of forwarding a tap to the content below', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector(
      '.lab-shell__phone-touch-overlay',
    ) as HTMLElement;
    const viewport = fixture.nativeElement.querySelector(
      '.lab-shell__phone-viewport',
    ) as HTMLElement;
    overlay.setPointerCapture = vi.fn();
    overlay.hasPointerCapture = vi.fn().mockReturnValue(true);
    overlay.releasePointerCapture = vi.fn();
    viewport.scrollTop = 0;

    const down = new PointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 300 });
    overlay.dispatchEvent(down);

    const move = new PointerEvent('pointermove', { pointerId: 1, clientX: 100, clientY: 200 });
    overlay.dispatchEvent(move);

    expect(viewport.scrollTop).toBe(100);

    const elementFromPointSpy = vi.fn();
    document.elementFromPoint = elementFromPointSpy;
    const up = new PointerEvent('pointerup', { pointerId: 1, clientX: 100, clientY: 200 });
    overlay.dispatchEvent(up);

    // A drag beyond the threshold must not forward a synthetic tap once released.
    expect(elementFromPointSpy).not.toHaveBeenCalled();
  });

  it('forwards a tap (no drag) through the overlay to the element below it', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector(
      '.lab-shell__phone-touch-overlay',
    ) as HTMLElement;
    overlay.setPointerCapture = vi.fn();
    overlay.hasPointerCapture = vi.fn().mockReturnValue(true);
    overlay.releasePointerCapture = vi.fn();

    const button = document.createElement('button');
    const clickSpy = vi.fn();
    button.addEventListener('click', clickSpy);
    document.body.appendChild(button);
    document.elementFromPoint = vi.fn().mockReturnValue(button);

    overlay.dispatchEvent(
      new PointerEvent('pointerdown', { pointerId: 1, clientX: 10, clientY: 10 }),
    );
    overlay.dispatchEvent(
      new PointerEvent('pointerup', { pointerId: 1, clientX: 10, clientY: 10 }),
    );

    expect(clickSpy).toHaveBeenCalledTimes(1);
    button.remove();
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

  it('setFrameWidth updates the frame width signal to the given rem value', () => {
    const instance = fixture.componentInstance as unknown as {
      frameWidthRem: () => number;
      setFrameWidth: (rem: number) => void;
    };
    instance.setFrameWidth(48);
    expect(instance.frameWidthRem()).toBe(48);
  });

  it('binds the frame dimensions dynamically and offers size preset selection via dropdown', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    const phone = fixture.nativeElement.querySelector('.lab-shell__phone') as HTMLElement;
    expect(phone.style.width).toBe('23.4375rem');
    expect(phone.style.height).toContain('56rem');

    const sizeTrigger = fixture.nativeElement.querySelector(
      '.lab-shell__frame-presets orbit-select .orbit-select__trigger',
    ) as HTMLButtonElement;
    sizeTrigger.click();
    fixture.detectChanges();

    const mdOption = [
      ...overlayContainer.getContainerElement().querySelectorAll('.orbit-select__option'),
    ].find((option) => option.textContent?.includes('768px')) as HTMLButtonElement;
    mdOption.click();
    fixture.detectChanges();

    expect(phone.style.width).toBe('48rem');
    expect(phone.style.height).toContain('56rem');

    fixture.componentInstance.toggleOrientation();
    fixture.detectChanges();

    expect(phone.style.width).toBe('56rem');
    expect(phone.style.height).toContain('48rem');
  });

  it('opens the navigation drawer on mobile viewports', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    const navButton = fixture.nativeElement.querySelector(
      '.lab-shell__phone-menu-btn button',
    ) as HTMLButtonElement;
    expect(navButton).toBeTruthy();

    navButton.click();
    fixture.detectChanges();

    const drawer = fixture.nativeElement.querySelector(
      '.lab-shell__mobile-nav-container orbit-panel-surface',
    );
    expect(drawer).toBeTruthy();
    expect(drawer?.querySelector('orbit-sidebar[embedded]')).toBeTruthy();
    expect(drawer?.textContent).toContain('Orbit Lab');
  });

  it('opens the options offcanvas on mobile viewports', () => {
    fixture.componentInstance.toggleMobilePreview();
    fixture.detectChanges();

    const optionsButton = fixture.nativeElement.querySelector(
      '.lab-shell__phone-options-btn button',
    ) as HTMLButtonElement;
    expect(optionsButton).toBeTruthy();

    optionsButton.click();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector(
      '.lab-shell__mobile-options-container lab-mobile-options-host',
    );
    expect(panel).toBeTruthy();
    expect(panel?.textContent).toContain('Opzioni catalogo');
  });
});
