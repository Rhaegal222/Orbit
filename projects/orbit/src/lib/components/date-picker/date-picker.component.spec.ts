import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitDatePickerComponent } from './date-picker.component';

describe('OrbitDatePickerComponent', () => {
  let fixture: ComponentFixture<OrbitDatePickerComponent>;
  let component: OrbitDatePickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitDatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('starts closed', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('toggles open/closed', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('renders calendar days', () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    expect(component.calendarDays.length).toBe(42);
  });

  it('selects a day', () => {
    const day = component.calendarDays[10];
    component.selectDay(day);
    expect(component.selectedDate()).toEqual(day.date);
    expect(component.isOpen()).toBe(false);
  });

  it('emits valueChange', () => {
    let emitted: Date | undefined;
    component.valueChange.subscribe((d) => (emitted = d!));
    const day = component.calendarDays[10];
    component.selectDay(day);
    expect(emitted).toEqual(day.date);
  });

  it('implements writeValue', () => {
    const date = new Date(2026, 0, 15);
    component.writeValue(date);
    expect(component.selectedDate()).toEqual(date);
    expect(component.inputText()).toBe('15/01/2026');
  });

  it('implements setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('navigates to previous month', () => {
    const month = component.viewMonth();
    component.prevMonth();
    expect(component.viewMonth()).toBe(month === 0 ? 11 : month - 1);
  });

  it('navigates to next month', () => {
    const month = component.viewMonth();
    component.nextMonth();
    expect(component.viewMonth()).toBe(month === 11 ? 0 : month + 1);
  });

  it('parses date from input', () => {
    component.onInputChange('15/06/2025');
    expect(component.selectedDate()?.getDate()).toBe(15);
    expect(component.selectedDate()?.getMonth()).toBe(5);
  });

  it('closes the calendar when the user starts typing', () => {
    component.isOpen.set(true);
    component.onInputChange('1');

    expect(component.isOpen()).toBe(false);
  });

  it('closes when interaction moves outside the picker', () => {
    component.isOpen.set(true);
    component.onDocumentPointerDown(new PointerEvent('pointerdown'));

    expect(component.isOpen()).toBe(false);
  });

  it('invalidates bad date', () => {
    component.onInputChange('99/99/9999');
    expect(component.selectedDate()).toBeNull();
  });

  it('disables days outside min/max', () => {
    fixture.componentRef.setInput('minDate', new Date(2026, 0, 5));
    fixture.componentRef.setInput('maxDate', new Date(2026, 0, 10));
    component.viewMonth.set(0);
    component.viewYear.set(2026);
    const disabledDays = component.calendarDays.filter((d) => d.disabled);
    expect(disabledDays.length).toBeGreaterThan(0);
  });
});
