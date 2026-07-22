import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OrbitDateRangePickerComponent } from './date-range-picker.component';

describe('OrbitDateRangePickerComponent', () => {
  let fixture: ComponentFixture<OrbitDateRangePickerComponent>;
  let component: OrbitDateRangePickerComponent;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitDateRangePickerComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitDateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
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

  it('uses the CDK calendar overlay through both composed date pickers', () => {
    const startToggle = fixture.nativeElement.querySelector(
      '.orbit-drp orbit-date-picker .orbit-dp__toggle',
    ) as HTMLButtonElement;
    startToggle.click();
    fixture.detectChanges();

    expect(
      overlayContainer.getContainerElement().querySelector('.orbit-dp__dropdown'),
    ).toBeTruthy();
  });
});
