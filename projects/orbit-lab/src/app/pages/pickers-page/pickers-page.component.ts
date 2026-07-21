import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrbitDatePickerComponent, OrbitTimePickerComponent, OrbitTimePickerQuickOption } from '@galileo/orbit';

@Component({
  selector: 'lab-pickers-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitDatePickerComponent, OrbitTimePickerComponent, ReactiveFormsModule],
  templateUrl: './pickers-page.component.html',
})
export class PickersPageComponent {
  protected readonly date = new FormControl<Date | null>(new Date(2026, 0, 8));
  protected readonly time = new FormControl({ hours: 9, minutes: 30 });
  protected readonly quickOptions: readonly OrbitTimePickerQuickOption[] = [
    { label: 'Mattina', value: { hours: 9, minutes: 0 } },
    { label: 'Pomeriggio', value: { hours: 15, minutes: 0 } },
    { label: 'Sera', value: { hours: 18, minutes: 0 } },
  ];
}
