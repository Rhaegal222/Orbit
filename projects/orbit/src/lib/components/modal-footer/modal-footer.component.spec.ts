import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitModalFooterComponent } from './modal-footer.component';

describe('OrbitModalFooterComponent', () => {
  let fixture: ComponentFixture<OrbitModalFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitModalFooterComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitModalFooterComponent);
    fixture.detectChanges();
  });

  it('uses the form footer treatment when requested', () => {
    fixture.componentRef.setInput('variant', 'form');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-modal-footer--form')).toBe(true);
  });

  it('renders the three compositional regions and a full-width legacy region', () => {
    const regions = fixture.nativeElement.querySelectorAll('.orbit-modal-footer__region');

    expect(regions.length).toBe(4);
    expect(regions[0].classList).toContain('orbit-modal-footer__region--left');
    expect(regions[1].classList).toContain('orbit-modal-footer__region--center');
    expect(regions[2].classList).toContain('orbit-modal-footer__region--right');
    expect(regions[3].classList).toContain('orbit-modal-footer__region--default');
  });
});
