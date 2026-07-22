import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { LabShellComponent } from './lab-shell.component';
import { CATALOG_ENTRIES } from '../catalog/catalog';

describe('LabShellComponent', () => {
  let fixture: ComponentFixture<LabShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(LabShellComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one nav link per catalog entry', () => {
    const links = fixture.nativeElement.querySelectorAll('[data-lab-nav-link]');
    expect(links.length).toBe(CATALOG_ENTRIES.length);
  });

  it('renders the static technical-catalog context in the sidebar', () => {
    const navigation = fixture.nativeElement.querySelector('nav[aria-label="Catalogo Orbit"]');

    expect(navigation.textContent).toContain('Catalogo tecnico');
    expect(navigation.textContent).toContain('Orbit Core');
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
