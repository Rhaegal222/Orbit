import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitDateRangePickerComponent } from './date-range-picker.component';

describe('OrbitDateRangePickerComponent', () => {
  let fixture: ComponentFixture<OrbitDateRangePickerComponent>;
  let component: OrbitDateRangePickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitDateRangePickerComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitDateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('keeps a valid chronological range', () => {
    component.onEndChange(new Date(2026, 4, 20));
    component.onStartChange(new Date(2026, 4, 21));
    expect(component.end()).toBeNull();
  });

  it('implements ControlValueAccessor state', () => {
    component.writeValue({ start: new Date(2026, 0, 1), end: new Date(2026, 0, 2) });
    component.setDisabledState(true);
    expect(component.start()?.getDate()).toBe(1);
    expect(component.isDisabled()).toBe(true);
  });
});
