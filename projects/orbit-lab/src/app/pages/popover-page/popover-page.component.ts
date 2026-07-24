import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitButtonComponent, OrbitPopoverComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../components/example-panel/example-panel.component';

@Component({
  selector: 'lab-popover-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, OrbitPopoverComponent, LabExampleComponent],
  templateUrl: './popover-page.component.html',
})
export class PopoverPageComponent {
  protected readonly snippet = `<orbit-popover content="La disponibilità è aggiornata ogni 15 minuti." position="bottom">
  <orbit-button label="Verifica disponibilità" />
</orbit-popover>`;
}
