import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  forwardRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

const DATE_VALUE_PATTERN = /^([0-3]\d)\/([01]\d)\/(\d{4})$/;
const MONTH_VALUE_PATTERN = /^([01]\d)\/(\d{4})$/;
const YEAR_VALUE_PATTERN = /^\d{4}$/;

/** Determines the precision emitted by an Orbit date picker. */
export type OrbitDatePickerMode = 'date' | 'month' | 'year';

interface CalendarDay {
  date: Date;
  day: number;
  currentMonth: boolean;
  today: boolean;
  selected: boolean;
  disabled: boolean;
}

@Component({
  selector: 'orbit-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrbitDatePickerComponent),
      multi: true,
    },
  ],
  host: {
    '[class.orbit-dp--disabled]': 'isDisabled()',
    '[class.orbit-dp--invalid]': 'invalid()',
  },
})
export class OrbitDatePickerComponent implements ControlValueAccessor, OnDestroy {
  readonly i18n = inject(ORBIT_I18N);
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  inputId = input('');
  ariaLabel = input('');
  placeholder = input('');
  required = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  weekStartsOn = input<0 | 1>(1);
  /** Optional one-way value for compositional, non-form use. Prefer CVA in forms. */
  value = input<Date | null | undefined>(undefined);
  disabled = input(false, { transform: booleanAttribute });
  /** `month` emits the first day of the selected month; `year` emits 1 January. */
  mode = input<OrbitDatePickerMode>('date');

  valueChange = output<Date | null>();

  @ViewChild('dropdownTemplate') private dropdownTemplate!: TemplateRef<unknown>;

  isOpen = signal(false);
  private readonly cvaDisabled = signal(false);
  readonly isDisabled = computed(() => this.cvaDisabled() || this.disabled());
  selectedDate = signal<Date | null>(null);
  viewMonth = signal(new Date().getMonth());
  viewYear = signal(new Date().getFullYear());
  inputText = signal('');

  private overlayRef: OverlayRef | null = null;
  private onChange: (value: Date | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    effect(() => {
      const value = this.value();
      if (value !== undefined) this.writeValue(value);
    });
    effect(() => {
      if (this.isOpen() && !this.isDisabled()) this.attachOverlay();
      else this.detachOverlay();
    });
  }

  readonly weekdayLabels = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(this.i18n.locale, { weekday: 'short' }).format(
      new Date(2024, 0, index + 1),
    ),
  );

  readonly monthLabels = Array.from({ length: 12 }, (_, index) => {
    const label = new Intl.DateTimeFormat(this.i18n.locale, { month: 'short' }).format(
      new Date(2024, index, 1),
    );
    return label.charAt(0).toLocaleUpperCase(this.i18n.locale) + label.slice(1);
  });

  get yearOptions(): number[] {
    return Array.from({ length: 12 }, (_, index) => this.viewYear() - 5 + index);
  }

  monthLabel(): string {
    const label = new Intl.DateTimeFormat(this.i18n.locale, {
      month: 'long',
      year: 'numeric',
    }).format(new Date(this.viewYear(), this.viewMonth(), 1));
    return label.charAt(0).toLocaleUpperCase(this.i18n.locale) + label.slice(1);
  }

  get calendarDays(): CalendarDay[] {
    const year = this.viewYear();
    const month = this.viewMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = this.selectedDate();
    const min = this.minDate();
    const max = this.maxDate();

    const days: CalendarDay[] = [];

    const prevMonthLast = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLast - i);
      days.push(this.makeDay(d, false, today, selected, min, max));
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push(this.makeDay(date, true, today, selected, min, max));
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      days.push(this.makeDay(date, false, today, selected, min, max));
    }

    return days;
  }

  writeValue(val: Date | null): void {
    if (val) this.setDisplayedValue(val);
    else {
      this.selectedDate.set(null);
      this.inputText.set('');
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  toggle(): void {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
  }

  selectDay(day: CalendarDay): void {
    if (day.disabled) return;
    this.commitValue(day.date);
  }

  selectMonth(month: number): void {
    const value = new Date(this.viewYear(), month, 1);
    if (this.isOutOfRange(value)) return;
    this.commitValue(value);
  }

  selectYear(year: number): void {
    const value = new Date(year, 0, 1);
    if (this.isOutOfRange(value)) return;
    this.viewYear.set(year);
    this.commitValue(value);
  }

  isMonthSelected(month: number): boolean {
    const selected = this.selectedDate();
    return (
      !!selected && selected.getFullYear() === this.viewYear() && selected.getMonth() === month
    );
  }

  isYearSelected(year: number): boolean {
    return this.selectedDate()?.getFullYear() === year;
  }

  isMonthDisabled(month: number): boolean {
    return this.isOutOfRange(new Date(this.viewYear(), month, 1));
  }

  isYearDisabled(year: number): boolean {
    const min = this.minDate()?.getFullYear();
    const max = this.maxDate()?.getFullYear();
    return (min !== undefined && year < min) || (max !== undefined && year > max);
  }

  prevMonth(): void {
    if (this.viewMonth() === 0) {
      this.viewMonth.set(11);
      this.viewYear.update((y) => y - 1);
    } else {
      this.viewMonth.update((m) => m - 1);
    }
  }

  nextMonth(): void {
    if (this.viewMonth() === 11) {
      this.viewMonth.set(0);
      this.viewYear.update((y) => y + 1);
    } else {
      this.viewMonth.update((m) => m + 1);
    }
  }

  onInputChange(text: string): void {
    this.isOpen.set(false);
    const maskedText = this.maskInput(text);
    this.inputText.set(maskedText);
    const parsed = this.parseValue(maskedText);
    if (parsed) {
      this.selectedDate.set(parsed);
      this.viewMonth.set(parsed.getMonth());
      this.viewYear.set(parsed.getFullYear());
      this.onChange(parsed);
      this.valueChange.emit(parsed);
    }
  }

  onInputBlur(): void {
    this.onTouched();
    this.isOpen.set(false);
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.isOpen()) return;
    const target = event.target as Node;
    const insideTrigger = this.hostElement.nativeElement.contains(target);
    const insideDropdown = this.overlayRef?.overlayElement.contains(target) ?? false;
    if (!insideTrigger && !insideDropdown) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isOpen.set(false);
  }

  private formatDate(d: Date): string {
    if (this.mode() === 'year') return String(d.getFullYear());
    if (this.mode() === 'month') {
      return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  private parseValue(text: string): Date | null {
    if (this.mode() === 'year') {
      if (!YEAR_VALUE_PATTERN.test(text)) return null;
      const value = new Date(Number(text), 0, 1);
      return this.isOutOfRange(value) ? null : value;
    }
    if (this.mode() === 'month') {
      const match = text.match(MONTH_VALUE_PATTERN);
      if (!match || Number(match[1]) === 0) return null;
      const value = new Date(Number(match[2]), Number(match[1]) - 1, 1);
      return value.getMonth() === Number(match[1]) - 1 && !this.isOutOfRange(value) ? value : null;
    }
    const match = text.match(DATE_VALUE_PATTERN);
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    const date = new Date(+yyyy, +mm - 1, +dd);
    if (date.getFullYear() !== +yyyy || date.getMonth() !== +mm - 1 || date.getDate() !== +dd) {
      return null;
    }
    return this.isOutOfRange(date) ? null : date;
  }

  private maskInput(text: string): string {
    const maxDigits = this.mode() === 'date' ? 8 : this.mode() === 'month' ? 6 : 4;
    const digits = text.replace(/\D/g, '').slice(0, maxDigits);
    if (this.mode() === 'year') return digits;
    if (this.mode() === 'month') {
      return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  private makeDay(
    date: Date,
    currentMonth: boolean,
    today: Date,
    selected: Date | null,
    min: Date | null,
    max: Date | null,
  ): CalendarDay {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const disabled =
      (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) ||
      (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate()));
    return {
      date: d,
      day: d.getDate(),
      currentMonth,
      today: d.getTime() === today.getTime(),
      selected: selected ? d.getTime() === selected.getTime() : false,
      disabled: !!disabled,
    };
  }

  private commitValue(value: Date): void {
    this.selectedDate.set(value);
    this.inputText.set(this.formatDate(value));
    this.isOpen.set(false);
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);
  }

  private isOutOfRange(value: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    return !!(
      (min && value < new Date(min.getFullYear(), min.getMonth(), min.getDate())) ||
      (max && value > new Date(max.getFullYear(), max.getMonth(), max.getDate()))
    );
  }

  private setDisplayedValue(value: Date): void {
    this.selectedDate.set(value);
    this.inputText.set(this.formatDate(value));
    this.viewMonth.set(value.getMonth());
    this.viewYear.set(value.getFullYear());
  }

  ngOnDestroy(): void {
    this.detachOverlay();
  }

  private attachOverlay(): void {
    if (this.overlayRef) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.hostElement)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      panelClass: 'orbit-dp-panel',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const portal = new TemplatePortal(this.dropdownTemplate, this.vcr);
    this.overlayRef.attach(portal);
  }

  private detachOverlay(): void {
    if (!this.overlayRef) return;
    this.overlayRef.detach();
    this.overlayRef.dispose();
    this.overlayRef = null;
  }
}
