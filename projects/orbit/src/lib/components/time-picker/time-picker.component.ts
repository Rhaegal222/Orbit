import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface OrbitTimeValue {
  hours: number;
  minutes: number;
}

@Component({
  selector: 'orbit-time-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrbitTimePickerComponent),
      multi: true,
    },
  ],
  host: {
    '[class.orbit-tp--disabled]': 'isDisabled()',
    '[class.orbit-tp--invalid]': 'invalid()',
  },
})
export class OrbitTimePickerComponent implements ControlValueAccessor {
  required = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  stepMinutes = input(15);
  valueChange = output<OrbitTimeValue | null>();

  isOpen = signal(false);
  isDisabled = signal(false);
  selectedHours = signal<number | null>(null);
  selectedMinutes = signal<number | null>(null);
  activeTab = signal<'hours' | 'minutes'>('hours');

  private onChange: (value: OrbitTimeValue | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly hours = Array.from({ length: 24 }, (_, i) => i);

  minutes = computed(() => {
    const step = this.stepMinutes();
    const result: number[] = [];
    for (let m = 0; m < 60; m += step) result.push(m);
    return result;
  });

  displayText = computed(() => {
    const h = this.selectedHours();
    const m = this.selectedMinutes();
    if (h === null || m === null) return '';
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  });

  writeValue(val: OrbitTimeValue | null): void {
    if (val) {
      this.selectedHours.set(val.hours);
      this.selectedMinutes.set(val.minutes);
    } else {
      this.selectedHours.set(null);
      this.selectedMinutes.set(null);
    }
  }

  registerOnChange(fn: (value: OrbitTimeValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  toggle(): void {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
  }

  selectHour(hour: number): void {
    this.selectedHours.set(hour);
    this.activeTab.set('minutes');
  }

  selectMinute(minute: number): void {
    this.selectedMinutes.set(minute);
    const value: OrbitTimeValue = {
      hours: this.selectedHours()!,
      minutes: minute,
    };
    this.isOpen.set(false);
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);
  }

  onInputBlur(): void {
    this.onTouched();
    this.isOpen.set(false);
  }

  formatHour(h: number): string {
    return String(h).padStart(2, '0');
  }

  formatMinute(m: number): string {
    return String(m).padStart(2, '0');
  }
}
