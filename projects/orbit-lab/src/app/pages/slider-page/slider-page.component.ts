import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrbitSliderComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-slider-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitSliderComponent, ReactiveFormsModule, LabExampleComponent],
  templateUrl: './slider-page.component.html',
})
export class SliderPageComponent {
  protected readonly baseControl = new FormControl<number>(50, { nonNullable: true });
  protected readonly disabledControl = new FormControl<number>(
    { value: 30, disabled: true },
    { nonNullable: true },
  );
  protected readonly steppedControl = new FormControl<number>(50, { nonNullable: true });

  protected readonly usageSnippet =
    '<orbit-slider inputId="notification-volume" ariaLabel="Volume della notifica" showValue [formControl]="notificationVolume" />';

  protected readonly disabledSnippet =
    '<orbit-slider inputId="volume" ariaLabel="Volume disabilitato" showValue [formControl]="volume" />\n// volume = new FormControl({ value: 30, disabled: true })';

  protected readonly steppedSnippet =
    '<orbit-slider inputId="ombre" ariaLabel="Intensità ombre" [min]="0" [max]="100" [step]="25" showValue [formControl]="shadowIntensity" />';
}
