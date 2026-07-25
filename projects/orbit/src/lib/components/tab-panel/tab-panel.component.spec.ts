import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTabPanelComponent } from './tab-panel.component';

describe('OrbitTabPanelComponent', () => {
  let fixture: ComponentFixture<OrbitTabPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitTabPanelComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitTabPanelComponent);
    fixture.componentRef.setInput('value', 'general');
    fixture.detectChanges();
  });

  it('renders ARIA tabpanel role wired to its matching tab', () => {
    const host = fixture.nativeElement;
    expect(host.getAttribute('role')).toBe('tabpanel');
    expect(host.getAttribute('id')).toBe('orbit-tab-panel-general');
    expect(host.getAttribute('aria-labelledby')).toBe('orbit-tab-general');
    expect(host.getAttribute('tabindex')).toBe('0');
  });
});
