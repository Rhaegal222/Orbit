import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

const TIME_VALUE_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export interface OrbitTimeValue {
  hours: number;
  minutes: number;
}

export interface OrbitTimePickerQuickOption {
  label: string;
  value: OrbitTimeValue;
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
  readonly i18n = inject(ORBIT_I18N);
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  inputId = input('');
  required = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  stepMinutes = input(15);
  quickOptions = input<readonly OrbitTimePickerQuickOption[]>([]);
  valueChange = output<OrbitTimeValue | null>();

  isOpen = signal(false);
  isDisabled = signal(false);
  selectedHours = signal<number | null>(null);
  selectedMinutes = signal<number | null>(null);
  inputText = signal('');

  private onChange: (value: OrbitTimeValue | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly hours = Array.from({ length: 24 }, (_, i) => i);

  minutes = computed(() => {
    const step = this.stepMinutes();
    const result: number[] = [];
    for (let m = 0; m < 60; m += step) result.push(m);
    return result;
  });

  writeValue(val: OrbitTimeValue | null): void {
    if (val) {
      this.selectedHours.set(val.hours);
      this.selectedMinutes.set(val.minutes);
      this.inputText.set(this.formatValue(val));
    } else {
      this.selectedHours.set(null);
      this.selectedMinutes.set(null);
      this.inputText.set('');
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
    this.commitIfComplete();
  }

  selectMinute(minute: number): void {
    if (this.selectedMinutes() === minute) {
      this.clearValue();
      return;
    }
    this.selectedMinutes.set(minute);
    this.commitIfComplete();
  }

  adjustHours(delta: number): void {
    const hours = this.selectedHours() ?? 0;
    this.selectedHours.set((hours + delta + 24) % 24);
  }

  adjustMinutes(delta: number): void {
    const step = Math.max(1, this.stepMinutes());
    const minutes = this.selectedMinutes() ?? 0;
    this.selectedMinutes.set((minutes + delta * step + 60) % 60);
  }

  toggleQuickOption(option: OrbitTimePickerQuickOption): void {
    if (
      this.selectedHours() === option.value.hours &&
      this.selectedMinutes() === option.value.minutes
    ) {
      this.clearValue();
      return;
    }
    this.selectedHours.set(option.value.hours);
    this.selectedMinutes.set(option.value.minutes);
    this.commitIfComplete();
  }

  onInputChange(text: string): void {
    this.isOpen.set(false);
    const maskedText = this.maskInput(text);
    this.inputText.set(maskedText);
    const value = this.parseValue(maskedText);
    if (!value) return;

    this.selectedHours.set(value.hours);
    this.selectedMinutes.set(value.minutes);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onInputBlur(): void {
    this.onTouched();
    this.isOpen.set(false);
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (this.isOpen() && !this.hostElement.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isOpen.set(false);
  }

  formatHour(h: number): string {
    return String(h).padStart(2, '0');
  }

  formatMinute(m: number): string {
    return String(m).padStart(2, '0');
  }

  private commitIfComplete(): void {
    const hours = this.selectedHours();
    const minutes = this.selectedMinutes();
    if (hours === null || minutes === null) return;

    const value = { hours, minutes };
    this.inputText.set(this.formatValue(value));
    this.isOpen.set(false);
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);
  }

  private clearValue(): void {
    this.selectedHours.set(null);
    this.selectedMinutes.set(null);
    this.inputText.set('');
    this.isOpen.set(false);
    this.onChange(null);
    this.onTouched();
    this.valueChange.emit(null);
  }

  private formatValue(value: OrbitTimeValue): string {
    return `${this.formatHour(value.hours)}:${this.formatMinute(value.minutes)}`;
  }

  private parseValue(text: string): OrbitTimeValue | null {
    const match = text.match(TIME_VALUE_PATTERN);
    if (!match) return null;
    return { hours: Number(match[1]), minutes: Number(match[2]) };
  }

  private maskInput(text: string): string {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
  }
}
