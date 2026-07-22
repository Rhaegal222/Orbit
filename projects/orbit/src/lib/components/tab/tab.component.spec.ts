import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTabComponent } from './tab.component';

describe('OrbitTabComponent', () => {
  let fixture: ComponentFixture<OrbitTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitTabComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitTabComponent);
    fixture.componentRef.setInput('value', 'general');
    fixture.componentRef.setInput('label', 'Generale');
  });

  it('renders ARIA tab role wired to its own value-derived id and controlled panel', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement;
    expect(host.getAttribute('role')).toBe('tab');
    expect(host.getAttribute('id')).toBe('orbit-tab-general');
    expect(host.getAttribute('aria-controls')).toBe('orbit-tab-panel-general');
    expect(host.textContent).toContain('Generale');
  });

  it('reflects selected state via aria-selected and tabindex', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-selected')).toBe('true');
    expect(fixture.nativeElement.getAttribute('tabindex')).toBe('0');
  });

  it('is not tab-reachable when unselected', () => {
    fixture.componentRef.setInput('selected', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('tabindex')).toBe('-1');
  });

  it('reflects disabled state and forces tabindex -1 even if selected', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.nativeElement.getAttribute('tabindex')).toBe('-1');
  });

  it('focus() moves DOM focus to the host element', () => {
    fixture.detectChanges();
    fixture.componentInstance.focus();
    expect(document.activeElement).toBe(fixture.nativeElement);
  });
});
