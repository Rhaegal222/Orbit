import { booleanAttribute, ChangeDetectionStrategy, Component, contentChildren, forwardRef, input } from '@angular/core';
import { OrbitAccordionItemComponent } from './accordion-item.component';
import {
  ORBIT_ACCORDION_CONTROLLER,
  type OrbitAccordionController,
  type OrbitAccordionItemHandle,
} from './accordion-token';

@Component({
  selector: 'orbit-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './accordion.component.css',
  host: {
    role: 'presentation',
  },
  providers: [
    { provide: ORBIT_ACCORDION_CONTROLLER, useExisting: forwardRef(() => OrbitAccordionComponent) },
  ],
})
export class OrbitAccordionComponent implements OrbitAccordionController {
  /** Default: only one panel open at a time. */
  multi = input(false, { transform: booleanAttribute });

  private readonly items = contentChildren(OrbitAccordionItemComponent);

  isMulti(): boolean {
    return this.multi();
  }

  notifyExpanded(openedItem: OrbitAccordionItemHandle): void {
    if (this.multi()) return;
    for (const item of this.items()) {
      if (item !== openedItem) item.collapse();
    }
  }
}
