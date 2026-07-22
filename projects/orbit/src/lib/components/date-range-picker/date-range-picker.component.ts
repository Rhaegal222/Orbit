import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';
import { OrbitDatePickerComponent } from '../date-picker/date-picker.component';

export interface OrbitDateRangeValue {
  start: Date | null;
  end: Date | null;
}

/** A typed range field composed from two native Orbit calendar pickers. */
@Component({
  selector: 'orbit-date-range-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitDatePickerComponent],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrbitDateRangePickerComponent),
      multi: true,
    },
  ],
  host: {
    '[class.orbit-drp--disabled]': 'isDisabled()',
    '[class.orbit-drp--invalid]': 'invalid()',
  },
})
export class OrbitDateRangePickerComponent implements ControlValueAccessor {
  readonly i18n = inject(ORBIT_I18N);
  startInputId = input('');
  endInputId = input('');
  startLabel = input('');
  endLabel = input('');
  invalid = input(false, { transform: booleanAttribute });
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  valueChange = output<OrbitDateRangeValue>();

  readonly start = signal<Date | null>(null);
  readonly end = signal<Date | null>(null);
  readonly isDisabled = signal(false);
  private onChange: (value: OrbitDateRangeValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: OrbitDateRangeValue | null): void {
    this.start.set(value?.start ?? null);
    this.end.set(value?.end ?? null);
  }

  registerOnChange(fn: (value: OrbitDateRangeValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  onStartChange(start: Date | null): void {
    const end = this.end();
    this.start.set(start);
    if (start && end && start > end) this.end.set(null);
    this.commit();
  }

  onEndChange(end: Date | null): void {
    const start = this.start();
    this.end.set(end && start && end < start ? null : end);
    this.commit();
  }

  private commit(): void {
    const value = { start: this.start(), end: this.end() };
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);
  }
}
