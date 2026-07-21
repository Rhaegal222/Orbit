import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type OrbitPillSwitchValue = string | number;

export interface OrbitPillSwitchOption {
  label: string;
  value: OrbitPillSwitchValue;
  disabled?: boolean;
}

@Component({
  selector: 'orbit-pill-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pill-switch.component.html',
  styleUrl: './pill-switch.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrbitPillSwitchComponent),
      multi: true,
    },
  ],
})
export class OrbitPillSwitchComponent implements ControlValueAccessor {
  ariaLabel = input('Selettore');
  options = input<OrbitPillSwitchOption[]>([]);
  disabled = input(false, { transform: booleanAttribute });

  valueChange = output<OrbitPillSwitchValue>();

  selectedValue = signal<OrbitPillSwitchValue | null>(null);
  isDisabled = signal(false);

  private onChange: (value: OrbitPillSwitchValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(val: OrbitPillSwitchValue | null): void {
    this.selectedValue.set(val);
  }

  registerOnChange(fn: (value: OrbitPillSwitchValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  select(option: OrbitPillSwitchOption): void {
    if (this.isDisabled() || option.disabled || option.value === this.selectedValue()) return;
    this.selectedValue.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.valueChange.emit(option.value);
  }

  trackByValue(_: number, option: OrbitPillSwitchOption): OrbitPillSwitchValue {
    return option.value;
  }
}
