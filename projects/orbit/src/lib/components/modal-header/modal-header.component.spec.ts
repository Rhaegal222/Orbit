import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitModalHeaderComponent } from './modal-header.component';

describe('OrbitModalHeaderComponent', () => {
  let fixture: ComponentFixture<OrbitModalHeaderComponent>;
  let component: OrbitModalHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitModalHeaderComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitModalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders a title and optional subtitle', () => {
    fixture.componentRef.setInput('title', 'Modifica elemento');
    fixture.componentRef.setInput('subtitle', 'Aggiorna i dati prima di salvare');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Modifica elemento');
    expect(fixture.nativeElement.querySelector('.orbit-modal-header__subtitle').textContent).toContain(
      'Aggiorna i dati prima di salvare',
    );
  });

  it('links the title to the id supplied by the dialog shell', () => {
    fixture.componentRef.setInput('titleId', 'policy-dialog-title');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').id).toBe('policy-dialog-title');
  });

  it('uses the shared icon button for close and emits on activation', () => {
    let closed = false;
    component.closeClicked.subscribe(() => (closed = true));
    fixture.nativeElement.querySelector('orbit-icon-button button').click();
    expect(closed).toBe(true);
  });

  it('omits the close control when the dialog cannot be closed', () => {
    fixture.componentRef.setInput('closable', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('orbit-icon-button')).toBeNull();
  });
});
