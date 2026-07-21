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

  it('selects hour then switches to minutes tab', () => {
    component.selectHour(14);
    expect(component.selectedHours()).toBe(14);
    expect(component.activeTab()).toBe('minutes');
  });

  it('selects minute and emits value', () => {
    let emitted: { hours: number; minutes: number } | undefined;
    component.valueChange.subscribe((v) => (emitted = v!));
    component.selectedHours.set(8);
    component.selectMinute(30);
    expect(emitted).toEqual({ hours: 8, minutes: 30 });
    expect(component.isOpen()).toBe(false);
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

  it('formats display text', () => {
    component.selectedHours.set(9);
    component.selectedMinutes.set(5);
    expect(component.displayText()).toBe('09:05');
  });

  it('formats hour and minute', () => {
    expect(component.formatHour(0)).toBe('00');
    expect(component.formatMinute(45)).toBe('45');
  });
});
