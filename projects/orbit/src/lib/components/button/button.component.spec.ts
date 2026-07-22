import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitButtonComponent } from './button.component';

describe('OrbitButtonComponent', () => {
  let fixture: ComponentFixture<OrbitButtonComponent>;
  let component: OrbitButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders with empty label by default', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.textContent.trim()).toBe('');
  });

  it('renders label', () => {
    fixture.componentRef.setInput('label', 'Salva');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').textContent.trim()).toBe('Salva');
  });

  it('defaults to solid primary', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('orbit-btn--solid')).toBe(true);
    expect(btn.classList.contains('orbit-btn--primary')).toBe(true);
  });

  it('applies variant class', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.componentRef.setInput('tone', 'danger');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('orbit-btn--outline')).toBe(true);
    expect(btn.classList.contains('orbit-btn--danger')).toBe(true);
  });

  it('applies the translucent variant class', () => {
    fixture.componentRef.setInput('variant', 'translucent');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').classList).toContain(
      'orbit-btn--translucent',
    );
  });

  it('sets disabled attribute', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });

  it('shows spinner when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('label', 'Caricamento');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-btn__spinner')).toBeTruthy();
  });

  it('emits clicked on click', () => {
    let emitted = false;
    component.clicked.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('button').click();
    expect(emitted).toBe(true);
  });

  it('does not emit when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    let emitted = false;
    component.clicked.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('button').click();
    expect(emitted).toBe(false);
  });

  it('does not emit when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    let emitted = false;
    component.clicked.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('button').click();
    expect(emitted).toBe(false);
  });

  it('defaults type to button', () => {
    expect(fixture.nativeElement.querySelector('button').getAttribute('type')).toBe('button');
  });

  it('sets type attribute', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').getAttribute('type')).toBe('submit');
  });
});
