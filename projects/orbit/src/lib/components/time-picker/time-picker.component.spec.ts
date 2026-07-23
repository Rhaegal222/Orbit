import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OrbitTimePickerComponent } from './time-picker.component';

describe('OrbitTimePickerComponent', () => {
  let fixture: ComponentFixture<OrbitTimePickerComponent>;
  let component: OrbitTimePickerComponent;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitTimePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('renders the dropdown in a CDK overlay (not clipped by an ancestor) when open', () => {
    component.toggle();
    fixture.detectChanges();
    expect(
      overlayContainer.getContainerElement().querySelector('.orbit-tp__dropdown'),
    ).toBeTruthy();
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
    component.valueChange.subscribe((value) => (emitted = value!));
    component.isOpen.set(true);

    component.onInputChange('09:05');

    expect(component.inputText()).toBe('09:05');
    expect(component.isOpen()).toBe(false);
    expect(emitted).toEqual({ hours: 9, minutes: 5 });
  });

  it('masks typed and pasted digits as HH:MM', () => {
    let emitted: { hours: number; minutes: number } | undefined;
    component.valueChange.subscribe((value) => (emitted = value!));

    component.onInputChange('12a3:45');

    expect(component.inputText()).toBe('12:34');
    expect(emitted).toEqual({ hours: 12, minutes: 34 });
  });

  it('does not emit invalid times after masking', () => {
    let emitted = false;
    component.valueChange.subscribe(() => (emitted = true));

    component.onInputChange('25:99');

    expect(component.inputText()).toBe('25:99');
    expect(emitted).toBe(false);
  });

  it('declares the native time pattern and input length', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.maxLength).toBe(5);
    expect(input.pattern).toBe('(?:[01][0-9]|2[0-3]):[0-5][0-9]');
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
