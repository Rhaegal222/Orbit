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

@Component({
  selector: 'orbit-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrbitSwitchComponent),
      multi: true,
    },
  ],
  host: {
    '[class.orbit-switch--disabled]': 'isControlDisabled()',
  },
})
export class OrbitSwitchComponent implements ControlValueAccessor {
  label = input('');
  inputId = input('');
  ariaLabel = input('');
  disabled = input(false, { transform: booleanAttribute });

  checkedChange = output<boolean>();

  readonly isChecked = signal(false);
  readonly isDisabled = signal(false);

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: boolean | null): void {
    this.isChecked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onNativeChange(event: Event): void {
    if (this.isControlDisabled()) return;
    const checked = (event.target as HTMLInputElement).checked;
    this.isChecked.set(checked);
    this.onChange(checked);
    this.onTouched();
    this.checkedChange.emit(checked);
  }

  isControlDisabled(): boolean {
    return this.disabled() || this.isDisabled();
  }
}
