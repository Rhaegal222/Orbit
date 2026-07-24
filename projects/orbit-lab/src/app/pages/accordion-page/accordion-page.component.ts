import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitAccordionComponent, OrbitAccordionItemComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../components/example-panel/example-panel.component';

@Component({
  selector: 'lab-accordion-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitAccordionComponent, OrbitAccordionItemComponent, LabExampleComponent],
  templateUrl: './accordion-page.component.html',
})
export class AccordionPageComponent {
  singleExpandedFirst = true;
  singleExpandedSecond = false;

  multiExpandedFirst = false;
  multiExpandedSecond = false;

  protected readonly usageSnippet = `<orbit-accordion>
  <orbit-accordion-item header="Sezione 1" [expanded]="expandedA" (expandedChange)="expandedA = $event">
    Contenuto della sezione 1
  </orbit-accordion-item>
  <orbit-accordion-item header="Sezione 2" [expanded]="expandedB" (expandedChange)="expandedB = $event">
    Contenuto della sezione 2
  </orbit-accordion-item>
</orbit-accordion>`;

  protected readonly multiSnippet = '<orbit-accordion multi>...</orbit-accordion>';

  protected readonly disabledSnippet =
    '<orbit-accordion-item header="Non disponibile" disabled>...</orbit-accordion-item>';
}
