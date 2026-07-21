import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrbitPillSwitchComponent, OrbitPillSwitchOption } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-pill-switch-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitPillSwitchComponent, ReactiveFormsModule, LabExampleComponent],
  templateUrl: './pill-switch-page.component.html',
})
export class PillSwitchPageComponent {
  protected readonly options: OrbitPillSwitchOption[] = [
    { label: 'Giorno', value: 'day' },
    { label: 'Settimana', value: 'week' },
    { label: 'Mese', value: 'month', disabled: true },
  ];

  protected readonly baseControl = new FormControl<string | number | null>('day');
  protected readonly disabledControl = new FormControl<string | number | null>(
    { value: 'day', disabled: true },
  );

  protected readonly usageSnippet =
    '<orbit-pill-switch ariaLabel="Intervallo" [options]="options" [formControl]="range" />';

  protected readonly disabledSnippet =
    '<orbit-pill-switch ariaLabel="Intervallo disabilitato" [options]="options" [formControl]="range" />\n// range = new FormControl({ value: \'day\', disabled: true })';
}
