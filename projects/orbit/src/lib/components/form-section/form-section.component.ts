import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-form-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-section.component.html',
  styleUrl: './form-section.component.css',
  host: {
    '[class.orbit-form-section--fill]': 'fill()',
  },
})
export class OrbitFormSectionComponent {
  title = input('');
  divided = input(false, { transform: booleanAttribute });
  fill = input(false, { transform: booleanAttribute });
  contentSpacing = input(false, { transform: booleanAttribute });
}
