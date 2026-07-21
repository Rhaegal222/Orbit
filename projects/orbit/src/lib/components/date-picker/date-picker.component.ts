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
export class OrbitDatePickerComponent implements ControlValueAccessor {
  placeholder = input('GG/MM/AAAA');
  required = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  weekStartsOn = input<0 | 1>(1);

  valueChange = output<Date | null>();

  isOpen = signal(false);
  isDisabled = signal(false);
  selectedDate = signal<Date | null>(null);
  viewMonth = signal(new Date().getMonth());
  viewYear = signal(new Date().getFullYear());
  inputText = signal('');

  private onChange: (value: Date | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly WEEKDAYS_IT = ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'];
  readonly MONTHS_IT = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
  ];

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
    this.selectedDate.set(val);
    this.inputText.set(val ? this.formatDate(val) : '');
    if (val) {
      this.viewMonth.set(val.getMonth());
      this.viewYear.set(val.getFullYear());
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
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

  selectDay(day: CalendarDay): void {
    if (day.disabled) return;
    this.selectedDate.set(day.date);
    this.inputText.set(this.formatDate(day.date));
    this.isOpen.set(false);
    this.onChange(day.date);
    this.onTouched();
    this.valueChange.emit(day.date);
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
    this.inputText.set(text);
    const parsed = this.parseDate(text);
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

  onInputFocus(): void {
    this.isOpen.set(true);
  }

  private formatDate(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  private parseDate(text: string): Date | null {
    const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    const date = new Date(+yyyy, +mm - 1, +dd);
    if (date.getDate() !== +dd) return null;
    return date;
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
}
