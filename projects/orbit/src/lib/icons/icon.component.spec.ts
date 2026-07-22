import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitIconComponent } from './icon.component';

describe('OrbitIconComponent', () => {
  let fixture: ComponentFixture<OrbitIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitIconComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitIconComponent);
  });

  it('renders one path per registry entry for the given icon', () => {
    fixture.componentRef.setInput('name', 'close');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('path').length).toBe(2);
  });

  it('renders a single path for a single-path icon', () => {
    fixture.componentRef.setInput('name', 'check');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('path').length).toBe(1);
  });

  it('uses a 24x24 viewBox with the shared stroke contract', () => {
    fixture.componentRef.setInput('name', 'chevron-down');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('stroke-width')).toBe('1.75');
  });

  it('uses the typed size contract without SVG pixel attributes', () => {
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('size', 24);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.style.getPropertyValue('--orbit-icon-size')).toBe('1.5rem');
    expect(svg.hasAttribute('width')).toBe(false);
    expect(svg.hasAttribute('height')).toBe(false);
  });

  it('hides decorative icons from assistive technology by default', () => {
    fixture.componentRef.setInput('name', 'check');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.hasAttribute('role')).toBe(false);
  });

  it('exposes an informative icon with its accessible label', () => {
    fixture.componentRef.setInput('name', 'mail');
    fixture.componentRef.setInput('decorative', false);
    fixture.componentRef.setInput('label', 'Messaggi');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Messaggi');
    expect(svg.hasAttribute('aria-hidden')).toBe(false);
  });

  it('renders normally when scaleSensitive is false, regardless of textScale', () => {
    fixture.componentRef.setInput('name', 'calendar');
    fixture.componentRef.setInput('textScale', 1.5);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
  });

  it('hides a scale-sensitive icon once textScale exceeds 1.2', () => {
    fixture.componentRef.setInput('name', 'calendar');
    fixture.componentRef.setInput('scaleSensitive', true);
    fixture.componentRef.setInput('textScale', 1.3);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
  });

  it('keeps a non-scale-sensitive icon like check visible at any scale', () => {
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('textScale', 1.5);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
  });
});
