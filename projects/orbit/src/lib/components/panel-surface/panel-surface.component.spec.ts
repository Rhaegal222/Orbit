import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitPanelSurfaceComponent } from './panel-surface.component';

@Component({
  selector: 'test-host',
  imports: [OrbitPanelSurfaceComponent],
  template: `<orbit-panel-surface labelledBy="t" describedBy="d"><p>Contenuto</p></orbit-panel-surface>`,
})
class TestHostComponent {}

describe('OrbitPanelSurfaceComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('renders a dialog-role surface wired to the given labelledBy/describedBy', () => {
    const el = fixture.nativeElement.querySelector('.orbit-panel-surface');
    expect(el.getAttribute('role')).toBe('dialog');
    expect(el.getAttribute('aria-modal')).toBe('true');
    expect(el.getAttribute('aria-labelledby')).toBe('t');
    expect(el.getAttribute('aria-describedby')).toBe('d');
  });

  it('projects content', () => {
    expect(fixture.nativeElement.textContent).toContain('Contenuto');
  });
});
