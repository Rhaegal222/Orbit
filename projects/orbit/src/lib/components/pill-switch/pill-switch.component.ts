import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

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
  readonly i18n = inject(ORBIT_I18N);
  ariaLabel = input('');
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
    if (this.isControlDisabled || option.disabled || option.value === this.selectedValue()) return;
    this.selectedValue.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.valueChange.emit(option.value);
  }

  trackByValue(_: number, option: OrbitPillSwitchOption): OrbitPillSwitchValue {
    return option.value;
  }

  get isControlDisabled(): boolean {
    return this.disabled() || this.isDisabled();
  }

  onKeydown(event: KeyboardEvent, currentIndex: number): void {
    if (this.isControlDisabled) return;
    const enabled = this.options()
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => !option.disabled);
    if (!enabled.length) return;

    let nextIndex: number | null = null;
    if (event.key === 'Home') nextIndex = enabled[0].index;
    if (event.key === 'End') nextIndex = enabled.at(-1)!.index;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = enabled[(enabled.findIndex(({ index }) => index === currentIndex) - 1 + enabled.length) % enabled.length].index;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = enabled[(enabled.findIndex(({ index }) => index === currentIndex) + 1) % enabled.length].index;
    }
    if (nextIndex === null) return;

    event.preventDefault();
    this.select(this.options()[nextIndex]);
  }
}
