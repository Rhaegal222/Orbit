import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrbitFormFieldComponent, OrbitSelectComponent, OrbitSelectOption } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-select-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitFormFieldComponent, OrbitSelectComponent, ReactiveFormsModule, LabExampleComponent],
  templateUrl: './select-page.component.html',
})
export class SelectPageComponent {
  protected readonly options: OrbitSelectOption[] = [
    { label: 'Mensile', value: 'monthly' },
    { label: 'Trimestrale', value: 'quarterly' },
    { label: 'Semestrale', value: 'semiannual', disabled: true },
    { label: 'Annuale', value: 'annual' },
  ];

  protected readonly baseControl = new FormControl<string | number | null>(null);
  protected readonly searchableControl = new FormControl<string | number | null>(null);
  protected readonly disabledControl = new FormControl<string | number | null>(
    { value: 'monthly', disabled: true },
  );

  protected readonly usageSnippet =
    '<orbit-select inputId="periodicita" [options]="periodicita" [formControl]="periodicitaControl" />';

  protected readonly searchableSnippet =
    '<orbit-select inputId="periodicita" [options]="periodicita" [searchable]="true" [formControl]="periodicitaControl" />';

  protected readonly invalidSnippet = '<orbit-select inputId="periodicita" [options]="periodicita" [invalid]="true" />';

  protected readonly disabledSnippet =
    '<orbit-select inputId="periodicita" [options]="periodicita" [formControl]="periodicitaControl" />\n// periodicitaControl = new FormControl({ value: \'monthly\', disabled: true })';
}
