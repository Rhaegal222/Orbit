import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrbitTimePickerComponent, OrbitTimePickerQuickOption } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-time-picker-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitTimePickerComponent, ReactiveFormsModule, LabExampleComponent],
  templateUrl: './time-picker-page.component.html',
})
export class TimePickerPageComponent {
  protected readonly timeSnippet = `<orbit-time-picker [formControl]="time" [quickOptions]="quickOptions" />`;
  protected readonly time = new FormControl({ hours: 9, minutes: 30 });
  protected readonly quickOptions: readonly OrbitTimePickerQuickOption[] = [
    { label: 'Mattina', value: { hours: 9, minutes: 0 } },
    { label: 'Pomeriggio', value: { hours: 15, minutes: 0 } },
    { label: 'Sera', value: { hours: 18, minutes: 0 } },
  ];
}
