import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitPanelComponent } from './panel.component';

describe('OrbitPanelComponent', () => {
  let fixture: ComponentFixture<OrbitPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitPanelComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitPanelComponent);
  });

  it('defaults to default padding', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-panel--no-padding')).toBe(false);
  });

  it('applies no-padding class when padding is "none"', () => {
    fixture.componentRef.setInput('padding', 'none');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-panel--no-padding')).toBe(true);
  });

  it('projects content', () => {
    const child = document.createElement('p');
    child.textContent = 'Barra laterale';
    fixture.nativeElement.appendChild(child);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Barra laterale');
  });
});
