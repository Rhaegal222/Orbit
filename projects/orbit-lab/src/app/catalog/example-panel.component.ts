import { booleanAttribute, ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { OrbitButtonComponent, OrbitCodeBlockComponent } from '@galileo/orbit';

@Component({
  selector: 'lab-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, OrbitCodeBlockComponent],
  templateUrl: './example-panel.component.html',
  styleUrl: './example-panel.component.css',
})
export class LabExampleComponent {
  /** Optional source snippet rendered below the interactive preview. */
  code = input('');
  /** Lets a projected block component use the full preview width. */
  fullWidth = input(false, { transform: booleanAttribute });
  protected readonly isCodeVisible = signal(false);

  toggleCode(): void {
    this.isCodeVisible.update((visible) => !visible);
  }
}
