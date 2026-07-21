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
});
