import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { OrbitSliderComponent } from './slider.component';

@Component({
  imports: [OrbitSliderComponent, ReactiveFormsModule],
  template: `<orbit-slider
    inputId="intensity"
    [formControl]="intensity"
    [min]="50"
    [max]="150"
    [step]="25"
    showValue
  />`,
})
class TestHostComponent {
  readonly intensity = new FormControl(100, { nonNullable: true });
}

describe('OrbitSliderComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('renders a native range control with the configured bounds', () => {
    const control = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;

    expect(control.id).toBe('intensity');
    expect(control.min).toBe('50');
    expect(control.max).toBe('150');
    expect(control.step).toBe('25');
    expect(fixture.nativeElement.querySelector('output').textContent.trim()).toBe('100');
  });

  it('updates the reactive form and emits a numeric value on input', () => {
    const slider = fixture.nativeElement.querySelector('orbit-slider') as HTMLElement;
    const control = slider.querySelector('input') as HTMLInputElement;
    const valueChange = vi.fn();
    fixture.debugElement
      .query(By.directive(OrbitSliderComponent))
      .componentInstance.valueChange.subscribe(valueChange);

    control.value = '125';
    control.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.intensity.value).toBe(125);
    expect(valueChange).toHaveBeenCalledWith(125);
    expect(slider.style.getPropertyValue('--orbit-slider-progress')).toBe('75%');
  });

  it('honours the disabled form-control state', () => {
    fixture.componentInstance.intensity.disable();
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).disabled).toBe(true);
  });
});
