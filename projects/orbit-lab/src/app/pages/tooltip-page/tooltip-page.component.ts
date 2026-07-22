import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitTooltipDirective } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-tooltip-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitTooltipDirective, LabExampleComponent],
  templateUrl: './tooltip-page.component.html',
})
export class TooltipPageComponent {
  protected readonly snippet = `<button orbitTooltip="Testo del tooltip" orbitTooltipPosition="top">
  Passa il mouse o naviga con Tab
</button>`;
}
