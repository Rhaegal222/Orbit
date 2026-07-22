import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
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

export type OrbitSelectValue = string | number;

export interface OrbitSelectOption {
  label: string;
  value: OrbitSelectValue;
  disabled?: boolean;
}

@Component({
  selector: 'orbit-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrbitSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[class.orbit-select--disabled]': 'isDisabled()',
    '[class.orbit-select--invalid]': 'invalid()',
  },
})
export class OrbitSelectComponent implements ControlValueAccessor {
  readonly i18n = inject(ORBIT_I18N);
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  options = input<OrbitSelectOption[]>([]);
  placeholder = input('');
  inputId = input('');
  required = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  searchable = input(false, { transform: booleanAttribute });

  valueChange = output<OrbitSelectValue | null>();

  selectedValue = signal<OrbitSelectValue | null>(null);
  inputText = signal('');
  isOpen = signal(false);
  queryText = signal('');
  activeIndex = signal(-1);
  isDisabled = signal(false);

  private onChange: (value: OrbitSelectValue | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(val: OrbitSelectValue | null): void {
    this.selectedValue.set(val);
    this.inputText.set(this.getOptionLabel(val));
    this.queryText.set('');
  }

  registerOnChange(fn: (value: OrbitSelectValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  get filteredOptions(): OrbitSelectOption[] {
    const q = this.queryText().toLocaleLowerCase(this.i18n.locale);
    return this.options().filter((o) =>
      o.label.toLocaleLowerCase(this.i18n.locale).includes(q),
    );
  }

  onInputChange(text: string): void {
    if (!this.searchable()) return;
    this.inputText.set(text);
    this.queryText.set(text);
    this.activeIndex.set(-1);
    const match = this.options().find(
      (o) =>
        !o.disabled &&
        o.label.toLocaleLowerCase(this.i18n.locale) === text.toLocaleLowerCase(this.i18n.locale),
    );
    this.setValue(match ? match.value : null);
  }

  onOptionSelect(option: OrbitSelectOption): void {
    if (option.disabled) return;
    this.inputText.set(option.label);
    this.queryText.set('');
    this.setValue(option.value);
    this.isOpen.set(false);
  }

  onFocus(): void {
    this.openAll();
  }

  onInputClick(): void {
    if (!this.isOpen()) this.openAll();
  }

  onToggleClick(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      return;
    }
    this.openAll();
  }

  onBlur(): void {
    this.onTouched();
    this.isOpen.set(false);
    if (this.selectedValue() == null) this.inputText.set('');
  }

  /**
   * Pointer events are observed before another control's click handler runs.
   * Closing here makes every Orbit picker/select mutually exclusive, including
   * controls whose trigger deliberately preserves input focus on mousedown.
   */
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

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isOpen.set(false);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.isOpen.set(true);
      this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (event.key === 'Enter' && this.activeIndex() >= 0) {
      event.preventDefault();
      const opts = this.filteredOptions;
      if (opts[this.activeIndex()]) {
        this.onOptionSelect(opts[this.activeIndex()]);
      }
    }
  }

  trackByValue(_: number, option: OrbitSelectOption): OrbitSelectValue {
    return option.value;
  }

  private openAll(): void {
    this.isOpen.set(true);
    this.activeIndex.set(-1);
    this.queryText.set('');
  }

  private moveActive(direction: number): void {
    const opts = this.filteredOptions;
    if (!opts.length) return;
    let idx = this.activeIndex();
    for (let i = 0; i < opts.length; i++) {
      idx = (idx + direction + opts.length) % opts.length;
      if (!opts[idx].disabled) {
        this.activeIndex.set(idx);
        return;
      }
    }
  }

  private setValue(val: OrbitSelectValue | null): void {
    if (this.selectedValue() === val) return;
    this.selectedValue.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  private getOptionLabel(val: OrbitSelectValue | null): string {
    return this.options().find((o) => o.value === val)?.label || '';
  }
}
