import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitModalComponent } from './modal.component';

describe('OrbitModalComponent', () => {
  let fixture: ComponentFixture<OrbitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitModalComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitModalComponent);
    fixture.detectChanges();
  });

  it('exposes dialog semantics and a fallback accessible name', () => {
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('Finestra di dialogo');
  });

  it('uses the visible heading as the accessible name when supplied', () => {
    fixture.componentRef.setInput('labelledBy', 'policy-dialog-title');
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog.getAttribute('aria-labelledby')).toBe('policy-dialog-title');
    expect(dialog.hasAttribute('aria-label')).toBe(false);
  });

  it('applies the compact layout class', () => {
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-modal--compact')).toBe(true);
  });
});
