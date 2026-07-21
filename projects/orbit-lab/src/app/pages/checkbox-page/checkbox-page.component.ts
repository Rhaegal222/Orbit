import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrbitCheckboxComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-checkbox-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitCheckboxComponent, ReactiveFormsModule, LabExampleComponent],
  templateUrl: './checkbox-page.component.html',
})
export class CheckboxPageComponent {
  protected readonly baseControl = new FormControl(false);
  protected readonly checkedControl = new FormControl(true);
  protected readonly disabledControl = new FormControl({ value: true, disabled: true });

  protected readonly usageSnippet =
    '<orbit-checkbox label="Accetto le condizioni" inputId="terms" [formControl]="terms" />';

  protected readonly checkedSnippet =
    '<orbit-checkbox label="Selezionato" inputId="opt" [formControl]="opt" />\n// opt = new FormControl(true)';

  protected readonly disabledSnippet =
    '<orbit-checkbox label="Disabilitato" inputId="opt" [formControl]="opt" />\n// opt = new FormControl({ value: true, disabled: true })';
}
