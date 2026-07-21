import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
  host: {
    '[class.orbit-form-field--disabled]': 'disabled()',
  },
})
export class OrbitFormFieldComponent {
  label = input('');
  inputId = input('');
  hint = input('');
  error = input('');
  required = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
}
