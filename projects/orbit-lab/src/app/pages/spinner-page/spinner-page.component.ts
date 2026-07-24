import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitSpinnerComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../components/example-panel/example-panel.component';

@Component({
  selector: 'lab-spinner-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitSpinnerComponent, LabExampleComponent],
  templateUrl: './spinner-page.component.html',
})
export class SpinnerPageComponent {
  protected readonly sizesSnippet =
    '<orbit-spinner size="sm" />\n<orbit-spinner size="md" />\n<orbit-spinner size="lg" />\n<orbit-spinner size="xl" />\n<orbit-spinner size="xxl" />';

  protected readonly customLabelSnippet =
    '<orbit-spinner ariaLabel="Caricamento allegato in corso" />';
}
