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

export type OrbitTextInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'
  | 'currency';

export type OrbitTextInputTone = 'default' | 'success';

@Component({
  selector: 'orbit-text-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrbitTextInputComponent),
      multi: true,
    },
  ],
  host: {
    '[class.orbit-input--disabled]': 'isDisabled()',
    '[class.orbit-input--invalid]': 'invalid()',
    '[class.orbit-input--readonly]': 'readonly()',
    '[class.orbit-input--success]': 'tone() === "success"',
  },
})
export class OrbitTextInputComponent implements ControlValueAccessor {
  type = input<OrbitTextInputType>('text');
  placeholder = input('');
  inputId = input('');
  autocomplete = input('off');
  required = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  readonly = input(false, { transform: booleanAttribute });
  tone = input<OrbitTextInputTone>('default');
  leadingIcon = input('');
  trailingIcon = input('');
  trailingIconLabel = input('');
  currencySymbol = input('€');

  blurred = output<void>();
  trailingIconClick = output<void>();

  value = signal('');
  showPassword = signal(false);
  isDisabled = signal(false);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(val: string | number | null): void {
    if (val == null || val === '') {
      this.value.set('');
      return;
    }
    this.value.set(
      this.type() === 'currency' ? this.formatCurrency(String(val)) : String(val),
    );
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  get nativeType(): string {
    if (this.type() === 'currency') return 'text';
    if (this.type() === 'password') return this.showPassword() ? 'text' : 'password';
    return this.type();
  }

  get inputMode(): string {
    switch (this.type()) {
      case 'currency':
        return 'decimal';
      case 'number':
        return 'numeric';
      case 'email':
        return 'email';
      case 'search':
        return 'search';
      case 'tel':
        return 'tel';
      case 'url':
        return 'url';
      default:
        return 'text';
    }
  }

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const formatted =
      this.type() === 'currency' ? this.formatCurrency(raw) : raw;
    this.value.set(formatted);
    this.onChange(formatted);
  }

  onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  private formatCurrency(raw: string): string {
    const cleaned = raw.replace(/[^\d,]/g, '');
    const commaIndex = cleaned.indexOf(',');
    let intPart = commaIndex >= 0 ? cleaned.slice(0, commaIndex) : cleaned;
    let decPart =
      commaIndex >= 0
        ? cleaned.slice(commaIndex + 1).replace(/,/g, '').slice(0, 2)
        : '';
    intPart = intPart
      .replace(/^0+(?=\d)/, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (commaIndex < 0) return intPart;
    return `${intPart || '0'},${decPart}`;
  }
}
