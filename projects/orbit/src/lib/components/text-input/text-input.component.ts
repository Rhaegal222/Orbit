import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OrbitIconComponent } from '../../icons/icon.component';
import type { OrbitIconName } from '../../icons/icon-registry';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

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
  imports: [OrbitIconComponent],
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
  /** Renders the semantic mail/lock icon for email and password fields. */
  showLeadingIcon = input(false, { transform: booleanAttribute });
  /** Semantic Orbit icon for a decorative leading adornment or leading action. */
  leadingIconName = input<OrbitIconName | null>(null);
  leadingIcon = input('');
  leadingIconActionLabel = input('');
  /** Legacy CSS-class icon for a decorative trailing adornment or trailing action. */
  trailingIcon = input('');
  /** Semantic Orbit icon for a decorative trailing adornment or trailing action. */
  trailingIconName = input<OrbitIconName | null>(null);
  /** Accessible name that turns the trailing icon into an action. */
  trailingIconActionLabel = input('');
  /** @deprecated Use `trailingIconActionLabel` for new code. */
  trailingIconLabel = input('');
  currencySymbol = input('€');
  min = input<number | null>(null);
  max = input<number | null>(null);
  step = input(1);

  blurred = output<void>();
  leadingIconClick = output<void>();
  trailingIconClick = output<void>();

  value = signal('');
  showPassword = signal(false);
  isDisabled = signal(false);
  readonly i18n = inject(ORBIT_I18N);
  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('control');
  readonly typeLeadingIcon = computed<OrbitIconName | null>(() => {
    if (!this.showLeadingIcon() || this.leadingIcon() || this.leadingIconName()) return null;
    if (this.type() === 'email') return 'mail';
    if (this.type() === 'password') return 'lock';
    return null;
  });
  readonly resolvedLeadingActionLabel = computed(() => this.leadingIconActionLabel());
  readonly resolvedTrailingActionLabel = computed(
    () => this.trailingIconActionLabel() || this.trailingIconLabel(),
  );

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

  adjustNumber(direction: 1 | -1): void {
    const control = this.inputElement()?.nativeElement;
    if (!control || this.isDisabled() || this.readonly()) return;

    if (direction > 0) control.stepUp();
    else control.stepDown();

    this.value.set(control.value);
    this.onChange(control.value);
    control.focus();
  }

  focusInput(): void {
    if (!this.isDisabled()) this.inputElement()?.nativeElement.focus();
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
