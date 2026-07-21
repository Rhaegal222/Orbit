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

  it('shows the labelled loading overlay', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingLabel', 'Caricamento elementi');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-modal-body__loader-text').textContent).toContain(
      'Caricamento elementi',
    );
  });
});
