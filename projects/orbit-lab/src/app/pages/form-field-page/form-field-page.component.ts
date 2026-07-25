import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitFormFieldComponent, OrbitTextInputComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../components/example-panel/example-panel.component';

@Component({
  selector: 'lab-form-field-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitFormFieldComponent, OrbitTextInputComponent, LabExampleComponent],
  templateUrl: './form-field-page.component.html',
})
export class FormFieldPageComponent {
  protected readonly usageSnippet =
    '<orbit-form-field label="Ragione sociale" inputId="company-name" required>\n  <orbit-text-input inputId="company-name" />\n</orbit-form-field>';

  protected readonly hintSnippet =
    '<orbit-form-field label="Codice fiscale" inputId="cf" hint="16 caratteri alfanumerici">\n  <orbit-text-input inputId="cf" />\n</orbit-form-field>';

  protected readonly errorSnippet =
    '<orbit-form-field label="Email" inputId="email" error="Formato non valido">\n  <orbit-text-input inputId="email" [invalid]="true" />\n</orbit-form-field>';
}
