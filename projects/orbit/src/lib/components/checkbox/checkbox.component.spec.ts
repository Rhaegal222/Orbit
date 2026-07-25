import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitCheckboxComponent } from './checkbox.component';

describe('OrbitCheckboxComponent', () => {
  let fixture: ComponentFixture<OrbitCheckboxComponent>;
  let component: OrbitCheckboxComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('starts unchecked', () => {
    expect(component.isChecked()).toBe(false);
    expect(fixture.nativeElement.querySelector('input[type="checkbox"]').checked).toBe(false);
  });

  it('toggles on click', () => {
    component.toggle();
    fixture.detectChanges();
    expect(component.isChecked()).toBe(true);
    expect(fixture.nativeElement.querySelector('input[type="checkbox"]').checked).toBe(true);
  });

  it('toggles twice returns to unchecked', () => {
    component.toggle();
    component.toggle();
    fixture.detectChanges();
    expect(component.isChecked()).toBe(false);
  });

  it('emits checked event', () => {
    let emittedValue: boolean | undefined;
    component.checked.subscribe((v) => (emittedValue = v));
    component.toggle();
    expect(emittedValue).toBe(true);
  });

  it('does not toggle when disabled', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    component.toggle();
    expect(component.isChecked()).toBe(false);
  });

  it('implements writeValue', () => {
    component.writeValue(true);
    fixture.detectChanges();
    expect(component.isChecked()).toBe(true);
  });

  it('implements ControlValueAccessor', () => {
    let onChangeValue: boolean | undefined;
    let onTouchedCalled = false;
    component.registerOnChange((v: boolean) => (onChangeValue = v));
    component.registerOnTouched(() => (onTouchedCalled = true));

    component.toggle();
    expect(onChangeValue).toBe(true);
    expect(onTouchedCalled).toBe(true);
  });

  it('renders label', () => {
    fixture.componentRef.setInput('label', 'Accetto');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Accetto');
  });

  it('toggles on native checkbox change event', () => {
    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');
    input.click();
    fixture.detectChanges();
    expect(component.isChecked()).toBe(true);
  });
});
