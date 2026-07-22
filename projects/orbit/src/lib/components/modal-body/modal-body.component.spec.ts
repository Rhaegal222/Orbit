import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitModalBodyComponent } from './modal-body.component';

describe('OrbitModalBodyComponent', () => {
  let fixture: ComponentFixture<OrbitModalBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitModalBodyComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitModalBodyComponent);
    fixture.detectChanges();
  });

  it('does not show a loading overlay by default', () => {
    expect(fixture.nativeElement.querySelector('.orbit-modal-body__loader')).toBeNull();
  });

  it('provides a full-height scroll region for modal and offcanvas bodies', () => {
    const scrollRegion = fixture.nativeElement.querySelector('.orbit-modal-body__scroll') as HTMLElement;
    expect(scrollRegion).toBeTruthy();
    expect(getComputedStyle(scrollRegion).overflowY).toBe('auto');
    expect(getComputedStyle(scrollRegion).height).toBe('100%');
  });

  it('shows the labelled loading overlay', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingLabel', 'Caricamento elementi');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-modal-body__loader-text').textContent).toContain(
      'Caricamento elementi',
    );
  });
});
