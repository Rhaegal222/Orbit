import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitTimePickerComponent } from './time-picker.component';

describe('OrbitTimePickerComponent', () => {
  let fixture: ComponentFixture<OrbitTimePickerComponent>;
  let component: OrbitTimePickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitTimePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('starts closed', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('toggles open', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);
  });

  it('generates 24 hours', () => {
    expect(component.hours.length).toBe(24);
  });

  it('generates minutes with step', () => {
    fixture.componentRef.setInput('stepMinutes', 15);
    fixture.detectChanges();
    expect(component.minutes()).toEqual([0, 15, 30, 45]);
  });

  it('selects an hour without closing until a minute is selected', () => {
    component.isOpen.set(true);
    component.selectHour(14);

    expect(component.selectedHours()).toBe(14);
    expect(component.isOpen()).toBe(true);
  });

  it('selects minute and emits value', () => {
    let emitted: { hours: number; minutes: number } | undefined;
    component.valueChange.subscribe((v) => (emitted = v!));
    component.selectedHours.set(8);
    component.selectMinute(30);
    expect(emitted).toEqual({ hours: 8, minutes: 30 });
    expect(component.isOpen()).toBe(false);
  });

  it('clears the value when the selected minute chip is pressed again', () => {
    let emitted: { hours: number; minutes: number } | null | undefined;
    component.valueChange.subscribe((value) => (emitted = value));
    component.writeValue({ hours: 8, minutes: 30 });

    component.selectMinute(30);

    expect(component.selectedHours()).toBeNull();
    expect(component.selectedMinutes()).toBeNull();
    expect(emitted).toBeNull();
  });

  it('implements writeValue', () => {
    component.writeValue({ hours: 10, minutes: 15 });
    expect(component.selectedHours()).toBe(10);
    expect(component.selectedMinutes()).toBe(15);
  });

  it('implements setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('accepts a typed valid time and closes the picker', () => {
    let emitted: { hours: number; minutes: number } | undefined;
    component.valueChange.subscribe((value) => (emitted = value));
    component.isOpen.set(true);

    component.onInputChange('09:05');

    expect(component.inputText()).toBe('09:05');
    expect(component.isOpen()).toBe(false);
    expect(emitted).toEqual({ hours: 9, minutes: 5 });
  });

  it('closes when interaction moves outside the picker', () => {
    component.isOpen.set(true);
    component.onDocumentPointerDown(new PointerEvent('pointerdown'));

    expect(component.isOpen()).toBe(false);
  });

  it('formats hour and minute', () => {
    expect(component.formatHour(0)).toBe('00');
    expect(component.formatMinute(45)).toBe('45');
  });
});
