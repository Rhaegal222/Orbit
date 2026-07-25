import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitFormSectionComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../components/example-panel/example-panel.component';

@Component({
  selector: 'lab-form-section-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitFormSectionComponent, LabExampleComponent],
  templateUrl: './form-section-page.component.html',
})
export class FormSectionPageComponent {
  protected readonly usageSnippet =
    '<orbit-form-section title="Informazioni principali">\n  ...\n</orbit-form-section>';

  protected readonly dividedSnippet =
    '<orbit-form-section title="Opzioni avanzate" [divided]="true">\n  ...\n</orbit-form-section>';

  protected readonly indexedSnippet =
    '<orbit-form-section title="Dati polizza" [index]="1">\n  ...\n</orbit-form-section>';

  protected readonly collapsibleSnippet =
    '<orbit-form-section title="Dettagli facoltativi" [collapsible]="true">\n  ...\n</orbit-form-section>';
}
