import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { ORBIT_ACCORDION_CONTROLLER } from './accordion-token';

let nextOrbitAccordionItemId = 0;

@Component({
  selector: 'orbit-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.css',
})
export class OrbitAccordionItemComponent {
  private readonly controller = inject(ORBIT_ACCORDION_CONTROLLER, { optional: true });
  protected readonly panelId = `orbit-accordion-panel-${++nextOrbitAccordionItemId}`;

  header = input.required<string>();
  expanded = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  expandedChange = output<boolean>();

  toggle(): void {
    if (this.disabled()) return;
    const next = !this.expanded();
    if (next) this.controller?.notifyExpanded(this);
    this.expandedChange.emit(next);
  }

  /** Invoked by the parent accordion when `multi()` is false and a sibling opened. */
  collapse(): void {
    if (this.expanded()) this.expandedChange.emit(false);
  }
}
