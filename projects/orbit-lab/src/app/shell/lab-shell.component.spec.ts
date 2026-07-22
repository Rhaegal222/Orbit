import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LabShellComponent } from './lab-shell.component';
import { CATALOG_ENTRIES } from '../catalog/catalog';

describe('LabShellComponent', () => {
  let fixture: ComponentFixture<LabShellComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabShellComponent],
      providers: [provideRouter([])],
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

  it('opens the catalog navigation in a left offcanvas', () => {
    const navigationButton = [...fixture.nativeElement.querySelectorAll('orbit-button')].find(
      (button: HTMLElement) => button.textContent?.includes('Navigazione'),
    ) as HTMLElement;
    navigationButton.querySelector('button')?.click();
    fixture.detectChanges();

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.querySelector('.orbit-panel--left')).toBeTruthy();
    expect(overlay.querySelectorAll('[data-lab-panel-nav-link]')).toHaveLength(
      CATALOG_ENTRIES.length,
    );
  });

  it('opens theme and density options in a right offcanvas', () => {
    const optionsButton = [...fixture.nativeElement.querySelectorAll('orbit-button')].find(
      (button: HTMLElement) => button.textContent?.includes('Opzioni'),
    ) as HTMLElement;
    optionsButton.querySelector('button')?.click();
    fixture.detectChanges();

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.querySelector('.orbit-panel--right')).toBeTruthy();
    expect(overlay.querySelectorAll('.lab-catalog-panel__field')).toHaveLength(4);
  });

  it('applies an option selected in the right offcanvas to the Lab surface', () => {
    const optionsButton = [...fixture.nativeElement.querySelectorAll('orbit-button')].find(
      (button: HTMLElement) => button.textContent?.includes('Opzioni'),
    ) as HTMLElement;
    optionsButton.querySelector('button')?.click();

    const themeInput = overlayContainer
      .getContainerElement()
      .querySelector('.lab-catalog-panel__field orbit-select input') as HTMLInputElement;
    themeInput.click();
    fixture.detectChanges();
    const darkOption = [
      ...overlayContainer.getContainerElement().querySelectorAll('.orbit-select__option'),
    ].find((option) => option.textContent?.includes('Regressione')) as HTMLButtonElement;
    darkOption.click();
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-theme')).toBe('dark');
  });

  it('defaults to default theme and comfortable density', () => {
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-theme')).toBeNull();
    expect(container.getAttribute('data-orbit-density')).toBe('comfortable');
  });

  it('applies dark theme attribute when selected', () => {
    fixture.componentInstance.setTheme('dark');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-theme')).toBe('dark');
  });

  it('applies compact density attribute when selected', () => {
    fixture.componentInstance.setDensity('compact');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-density')).toBe('compact');
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
