import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitTooltipDirective } from '@galileo/orbit';
import { LabExampleComponent } from '../../components/example-panel/example-panel.component';

@Component({
  selector: 'lab-tooltip-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitTooltipDirective, LabExampleComponent],
  templateUrl: './tooltip-page.component.html',
})
export class TooltipPageComponent {
  protected readonly snippet = `<button orbitTooltip="Il codice SKU è visibile ai soli operatori." orbitTooltipPosition="top">
  Informazioni sul codice SKU
</button>`;
}
