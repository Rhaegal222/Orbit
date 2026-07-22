import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  OrbitFormFieldComponent,
  OrbitSelectableTileComponent,
  OrbitSelectComponent,
  OrbitSelectOption,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-select-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitFormFieldComponent,
    OrbitSelectableTileComponent,
    OrbitSelectComponent,
    ReactiveFormsModule,
    LabExampleComponent,
  ],
  templateUrl: './select-page.component.html',
  styleUrl: './select-page.component.css',
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
  protected readonly tileSelected = signal(true);

  protected readonly usageSnippet =
    '<orbit-select inputId="periodicita" [options]="periodicita" [formControl]="periodicitaControl" />';

  protected readonly searchableSnippet =
    '<orbit-select inputId="periodicita" [options]="periodicita" [searchable]="true" [formControl]="periodicitaControl" />';

  protected readonly statesSnippet = `<orbit-select inputId="periodicita-non-valida" [options]="periodicita" [invalid]="true" /> <!-- Stato non valido -->

<orbit-select inputId="periodicita-disabilitata" [options]="periodicita" [formControl]="periodicitaControl" /> <!-- Stato disabilitato: gestito dal FormControl -->
// periodicitaControl = new FormControl({ value: 'monthly', disabled: true });`;

  protected readonly tileSnippet = `<orbit-selectable-tile
  label="Opzione con icona"
  description="La selezione è controllata dal consumer."
  [selected]="selected()"
  (selectedChange)="selected.set($event)"
>
  <!-- Proiezione opzionale dell'icona -->
</orbit-selectable-tile> <!-- Interattiva -->

<orbit-selectable-tile label="Selezionata" [selected]="true" /> <!-- Selezionata -->
<orbit-selectable-tile label="Disabilitata" [selected]="true" disabled /> <!-- Selezionata e disabilitata -->`;
}
