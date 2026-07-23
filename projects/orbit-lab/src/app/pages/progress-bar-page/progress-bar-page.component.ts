import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrbitProgressBarComponent, OrbitSliderComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-progress-bar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitProgressBarComponent,
    OrbitSliderComponent,
    ReactiveFormsModule,
    LabExampleComponent,
  ],
  templateUrl: './progress-bar-page.component.html',
})
export class ProgressBarPageComponent {
  protected readonly determinateControl = new FormControl<number>(40, { nonNullable: true });
  protected readonly determinateValue: Signal<number> = toSignal(
    this.determinateControl.valueChanges,
    { initialValue: this.determinateControl.value },
  );

  protected readonly determinateSnippet =
    '<orbit-slider inputId="upload-progress" ariaLabel="Avanzamento upload" showValue [formControl]="uploadProgress" />\n<orbit-progress-bar [value]="uploadProgress.value" ariaLabel="Avanzamento upload" />';

  protected readonly indeterminateSnippet =
    '<orbit-progress-bar ariaLabel="Caricamento in corso" />';
}
