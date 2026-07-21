import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { OrbitCodeBlockComponent } from '@galileo/orbit';

@Component({
  selector: 'lab-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitCodeBlockComponent],
  templateUrl: './example-panel.component.html',
  styleUrl: './example-panel.component.css',
})
export class LabExampleComponent {
  /** Optional copyable source snippet, rendered via the Core orbit-code-block component. */
  code = input('');
}
