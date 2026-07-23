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

  it('renders a single segmented stepper for number inputs', () => {
    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.orbit-input__number-step').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.orbit-input__number-stepper')).toBeTruthy();
  });

  it('steps number input values through the accessible actions', () => {
    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();
    component.writeValue(2);
    fixture.detectChanges();
    let emitted = '';
    component.registerOnChange((value) => (emitted = value));

    component.adjustNumber(1);

    expect(component.value()).toBe('3');
    expect(emitted).toBe('3');
  });

  it('renders the semantic mail icon when enabled for email', () => {
    fixture.componentRef.setInput('type', 'email');
    fixture.componentRef.setInput('showLeadingIcon', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('orbit-icon')).toBeTruthy();
    expect(component.typeLeadingIcon()).toBe('mail');
  });

  it('renders password with toggle', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').getAttribute('type')).toBe('password');
    component.togglePasswordVisibility();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').getAttribute('type')).toBe('text');
  });

  it('shows an accessible clear action for a populated search field', () => {
    fixture.componentRef.setInput('type', 'search');
    component.writeValue('Modulo LED');
    fixture.detectChanges();
    let emitted = 'not-cleared';
    component.registerOnChange((value) => (emitted = value));

    const clearAction = fixture.nativeElement.querySelector('.orbit-input__action') as HTMLButtonElement;
    expect(clearAction.getAttribute('aria-label')).toBe('Cancella ricerca');
    clearAction.click();

    expect(component.value()).toBe('');
    expect(emitted).toBe('');
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('input'));
  });

  it('does not render the search clear action when the field is empty', () => {
    fixture.componentRef.setInput('type', 'search');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.orbit-input__action')).toBeNull();
  });

  it('renders the semantic lock icon when enabled for password', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('showLeadingIcon', true);
    fixture.detectChanges();

    expect(component.typeLeadingIcon()).toBe('lock');
  });

  for (const [type, icon] of [
    ['search', 'search'],
    ['tel', 'phone'],
    ['url', 'link'],
  ] as const) {
    it(`renders the semantic ${icon} icon when enabled for ${type}`, () => {
      fixture.componentRef.setInput('type', type);
      fixture.componentRef.setInput('showLeadingIcon', true);
      fixture.detectChanges();

      expect(component.typeLeadingIcon()).toBe(icon);
      expect(fixture.nativeElement.querySelector('orbit-icon')).toBeTruthy();
    });
  }

  it('keeps a semantic leading icon decorative without an action label', () => {
    fixture.componentRef.setInput('leadingIconName', 'mail');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.orbit-input__action--leading')).toBeNull();
    expect(fixture.nativeElement.querySelector('.orbit-input__icon--leading orbit-icon')).toBeTruthy();
  });

  it('focuses the input when a decorative leading icon is clicked', () => {
    fixture.componentRef.setInput('leadingIconName', 'mail');
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.orbit-input__icon--leading') as HTMLElement).click();
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('input'));
  });

  it('turns a semantic trailing icon into an action only with an action label', () => {
    let clicked = false;
    component.trailingIconClick.subscribe(() => (clicked = true));
    fixture.componentRef.setInput('trailingIconName', 'copy');
    fixture.componentRef.setInput('trailingIconActionLabel', 'Copia valore');
    fixture.detectChanges();

    const action = fixture.nativeElement.querySelector('.orbit-input__action') as HTMLButtonElement;
    expect(action.getAttribute('aria-label')).toBe('Copia valore');
    action.click();
    expect(clicked).toBe(true);
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

  it('renders currency as a leading adornment', () => {
    fixture.componentRef.setInput('type', 'currency');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.orbit-input__symbol')).toBeTruthy();
  });

  it('applies invalid class', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-input--invalid')).toBe(true);
  });
});
