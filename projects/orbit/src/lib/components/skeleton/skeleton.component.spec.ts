import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitSkeletonComponent } from './skeleton.component';

describe('OrbitSkeletonComponent', () => {
  let fixture: ComponentFixture<OrbitSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitSkeletonComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('is always aria-hidden, since a skeleton must never be announced by a screen reader', () => {
    expect(fixture.nativeElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('defaults to the text shape', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('orbit-skeleton--text')).toBe(true);
    expect(host.classList.contains('orbit-skeleton--circle')).toBe(false);
    expect(host.classList.contains('orbit-skeleton--rect')).toBe(false);
  });

  it('applies the circle shape class and removes the others', () => {
    fixture.componentRef.setInput('shape', 'circle');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('orbit-skeleton--circle')).toBe(true);
    expect(host.classList.contains('orbit-skeleton--text')).toBe(false);
    expect(host.classList.contains('orbit-skeleton--rect')).toBe(false);
  });

  it('applies the rect shape class and removes the others', () => {
    fixture.componentRef.setInput('shape', 'rect');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('orbit-skeleton--rect')).toBe(true);
    expect(host.classList.contains('orbit-skeleton--text')).toBe(false);
    expect(host.classList.contains('orbit-skeleton--circle')).toBe(false);
  });

  it('defaults width to 100%', () => {
    expect((fixture.nativeElement as HTMLElement).style.width).toBe('100%');
  });

  it('applies an explicit width', () => {
    fixture.componentRef.setInput('width', '3rem');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).style.width).toBe('3rem');
  });

  it('defaults height to a text-row height derived from typography tokens when shape is text', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.height).toBe('calc(var(--orbit-font-size-body) * var(--orbit-line-height-body))');
  });

  it('defaults height to a text-row height derived from typography tokens when shape is rect', () => {
    fixture.componentRef.setInput('shape', 'rect');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.height).toBe('calc(var(--orbit-font-size-body) * var(--orbit-line-height-body))');
  });

  it('defaults height to the width when shape is circle, so a bare width produces a true circle', () => {
    fixture.componentRef.setInput('shape', 'circle');
    fixture.componentRef.setInput('width', '3rem');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.height).toBe('3rem');
  });

  it('lets an explicit height override the shape-derived default, for every shape', () => {
    for (const shape of ['text', 'circle', 'rect'] as const) {
      fixture.componentRef.setInput('shape', shape);
      fixture.componentRef.setInput('height', '2.5rem');
      fixture.detectChanges();
      expect((fixture.nativeElement as HTMLElement).style.height).toBe('2.5rem');
    }
  });
});
