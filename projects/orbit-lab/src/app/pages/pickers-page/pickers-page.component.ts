import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  OrbitDatePickerComponent,
  OrbitDateRangePickerComponent,
  OrbitDateRangeValue,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-date-picker-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitDatePickerComponent,
    OrbitDateRangePickerComponent,
    ReactiveFormsModule,
    LabExampleComponent,
  ],
  templateUrl: './pickers-page.component.html',
})
export class DatePickerPageComponent {
  protected readonly dateSnippet = `<orbit-date-picker [formControl]="date" />`;
  protected readonly precisionSnippet = `<orbit-date-picker mode="month" [formControl]="month" />
<orbit-date-picker mode="year" [formControl]="year" />`;
  protected readonly rangeSnippet = `<orbit-date-range-picker [formControl]="range" />`;
  protected readonly date = new FormControl<Date | null>(new Date(2026, 0, 8));
  protected readonly month = new FormControl<Date | null>(new Date(2026, 0, 1));
  protected readonly year = new FormControl<Date | null>(new Date(2026, 0, 1));
  protected readonly range = new FormControl<OrbitDateRangeValue>({
    start: new Date(2026, 0, 8),
    end: new Date(2026, 0, 15),
  });
}
