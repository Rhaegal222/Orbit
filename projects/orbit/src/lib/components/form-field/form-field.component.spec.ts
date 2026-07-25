import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitFormFieldComponent } from './form-field.component';

describe('OrbitFormFieldComponent', () => {
  let fixture: ComponentFixture<OrbitFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitFormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitFormFieldComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders label', () => {
    fixture.componentRef.setInput('label', 'Nome');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('label')?.textContent?.trim()).toContain('Nome');
  });

  it('renders hint', () => {
    fixture.componentRef.setInput('hint', 'Max 50 caratteri');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.orbit-form-field__hint')?.textContent?.trim(),
    ).toBe('Max 50 caratteri');
  });

  it('renders error', () => {
    fixture.componentRef.setInput('error', 'Campo obbligatorio');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.orbit-form-field__error')?.textContent?.trim(),
    ).toBe('Campo obbligatorio');
  });

  it('can reserve feedback space before an error is present', () => {
    fixture.componentRef.setInput('reserveMessageSpace', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.orbit-form-field__feedback--reserved'),
    ).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.orbit-form-field__error')).toBeNull();
  });

  it('shows required asterisk', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-form-field__required')).toBeTruthy();
  });

  it('does not show required asterisk by default', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-form-field__required')).toBeNull();
  });

  it('associates label with input via inputId', () => {
    fixture.componentRef.setInput('label', 'Nome');
    fixture.componentRef.setInput('inputId', 'nome');
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    expect(label?.getAttribute('for')).toBe('nome');
  });
});
