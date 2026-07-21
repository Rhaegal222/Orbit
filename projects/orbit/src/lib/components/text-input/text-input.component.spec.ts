import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitTextInputComponent } from './text-input.component';

describe('OrbitTextInputComponent', () => {
  let fixture: ComponentFixture<OrbitTextInputComponent>;
  let component: OrbitTextInputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitTextInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders text input by default', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('type')).toBe('text');
  });

  it('renders email type', () => {
    fixture.componentRef.setInput('type', 'email');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').getAttribute('type')).toBe('email');
  });

  it('renders password with toggle', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').getAttribute('type')).toBe('password');
    component.togglePasswordVisibility();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').getAttribute('type')).toBe('text');
  });

  it('renders placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Inserisci...');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').getAttribute('placeholder')).toBe('Inserisci...');
  });

  it('implements writeValue', () => {
    component.writeValue('hello');
    expect(component.value()).toBe('hello');
  });

  it('implements setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(component.isDisabled()).toBe(true);
    expect(fixture.nativeElement.querySelector('input').disabled).toBe(true);
  });

  it('emits value on input', () => {
    let emitted: string | undefined;
    component.registerOnChange((v: string) => (emitted = v));
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    expect(emitted).toBe('test');
  });

  it('emits blurred on blur', () => {
    let emitted = false;
    component.blurred.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('input').dispatchEvent(new Event('blur'));
    expect(emitted).toBe(true);
  });

  it('formats currency with Italian decimal separator', () => {
    fixture.componentRef.setInput('type', 'currency');
    fixture.detectChanges();
    component.writeValue('1234,56');
    expect(component.value()).toContain('1.234');
  });

  it('applies invalid class', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-input--invalid')).toBe(true);
  });
});
