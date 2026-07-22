import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitButtonComponent, OrbitPopoverComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-popover-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, OrbitPopoverComponent, LabExampleComponent],
  templateUrl: './popover-page.component.html',
})
export class PopoverPageComponent {
  protected readonly snippet = `<orbit-popover content="Testo del popover" position="bottom">
  <orbit-button label="Apri popover" />
</orbit-popover>`;
}
