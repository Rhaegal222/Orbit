import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrbitFormFieldComponent, OrbitTextInputComponent, OrbitTextInputType } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-text-input-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitFormFieldComponent, OrbitTextInputComponent, ReactiveFormsModule, LabExampleComponent],
  templateUrl: './text-input-page.component.html',
  styleUrl: './text-input-page.component.css',
})
export class TextInputPageComponent {
  protected readonly types: OrbitTextInputType[] = [
    'text',
    'email',
    'password',
    'number',
    'search',
    'tel',
    'url',
    'currency',
  ];

  protected readonly typeExamples = this.types.map((type) => ({
    type,
    control: new FormControl(''),
  }));

  protected readonly baseControl = new FormControl('');
  protected readonly emailWithIconControl = new FormControl('nome@azienda.it');
  protected readonly passwordWithIconControl = new FormControl('password-segreta');
  protected readonly disabledControl = new FormControl({ value: 'Valore bloccato', disabled: true });

  protected readonly usageSnippet =
    '<orbit-text-input inputId="organizzazione" [formControl]="organizzazione" />';

  protected readonly invalidSnippet = '<orbit-text-input inputId="email" type="email" [invalid]="true" />';

  protected readonly leadingIconSnippet = `<orbit-text-input
  type="email"
  showLeadingIcon
  [formControl]="email"
/>
<orbit-text-input
  type="password"
  showLeadingIcon
  [formControl]="password"
/>`;

  protected readonly disabledSnippet =
    '<orbit-text-input inputId="bloccato" [formControl]="bloccato" />\n// bloccato = new FormControl({ value: \'...\', disabled: true })';

  protected typeSnippet(type: OrbitTextInputType): string {
    const leadingIcon = type === 'email' || type === 'password' ? ' showLeadingIcon' : '';
    return `<orbit-text-input inputId="campo" type="${type}"${leadingIcon} [formControl]="campo" />`;
  }
}
