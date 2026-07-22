import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  OrbitDatePickerComponent,
  OrbitDateRangePickerComponent,
  OrbitDateRangeValue,
  OrbitTimePickerComponent,
  OrbitTimePickerQuickOption,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-pickers-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitDatePickerComponent,
    OrbitDateRangePickerComponent,
    OrbitTimePickerComponent,
    ReactiveFormsModule,
    LabExampleComponent,
  ],
  templateUrl: './pickers-page.component.html',
})
export class PickersPageComponent {
  protected readonly dateSnippet = `<orbit-date-picker [formControl]="date" />`;
  protected readonly precisionSnippet = `<orbit-date-picker mode="month" [formControl]="month" />
<orbit-date-picker mode="year" [formControl]="year" />`;
  protected readonly rangeSnippet = `<orbit-date-range-picker [formControl]="range" />`;
  protected readonly timeSnippet = `<orbit-time-picker [formControl]="time" [quickOptions]="quickOptions" />`;
  protected readonly date = new FormControl<Date | null>(new Date(2026, 0, 8));
  protected readonly month = new FormControl<Date | null>(new Date(2026, 0, 1));
  protected readonly year = new FormControl<Date | null>(new Date(2026, 0, 1));
  protected readonly range = new FormControl<OrbitDateRangeValue>({
    start: new Date(2026, 0, 8),
    end: new Date(2026, 0, 15),
  });
  protected readonly time = new FormControl({ hours: 9, minutes: 30 });
  protected readonly quickOptions: readonly OrbitTimePickerQuickOption[] = [
    { label: 'Mattina', value: { hours: 9, minutes: 0 } },
    { label: 'Pomeriggio', value: { hours: 15, minutes: 0 } },
    { label: 'Sera', value: { hours: 18, minutes: 0 } },
  ];
}
