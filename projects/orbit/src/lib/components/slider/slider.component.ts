import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'orbit-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrbitSliderComponent),
      multi: true,
    },
  ],
  host: {
    '[class.orbit-slider--disabled]': 'isControlDisabled()',
    '[style.--orbit-slider-progress]': 'progress()',
  },
})
export class OrbitSliderComponent implements ControlValueAccessor {
  inputId = input('');
  ariaLabel = input('');
  ariaValueText = input('');
  min = input(0, { transform: numberAttribute });
  max = input(100, { transform: numberAttribute });
  step = input(1, { transform: numberAttribute });
  disabled = input(false, { transform: booleanAttribute });
  showValue = input(false, { transform: booleanAttribute });

  valueChange = output<number>();
  blurred = output<void>();

  readonly value = signal(0);
  readonly isDisabled = signal(false);
  readonly resolvedMax = computed(() => Math.max(this.min(), this.max()));
  readonly resolvedStep = computed(() => (this.step() > 0 ? this.step() : 1));
  readonly progress = computed(() => {
    const span = this.resolvedMax() - this.min();
    return `${span === 0 ? 0 : ((this.value() - this.min()) / span) * 100}%`;
  });

  private onChange: (value: number) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: number | null): void {
    this.value.set(this.clamp(value ?? this.min()));
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const value = this.clamp(Number((event.target as HTMLInputElement).value));
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  isControlDisabled(): boolean {
    return this.disabled() || this.isDisabled();
  }

  private clamp(value: number): number {
    const min = this.min();
    const max = this.resolvedMax();
    return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  }
}
